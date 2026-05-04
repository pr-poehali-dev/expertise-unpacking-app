"""
API для платформы распаковки экспертности.
Методы: create_session, save_step, generate_followup, generate_summary, generate_final, generate_insights, get_session
"""
import json
import os
import uuid
import psycopg2
from datetime import datetime, timezone
import urllib.request

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
    "Content-Type": "application/json"
}

def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def polza_chat(messages, system_prompt="", model="openai/gpt-4o-mini", temperature=0.7, max_tokens=1500):
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    payload = json.dumps({
        "model": model,
        "messages": [{"role": "system", "content": system_prompt}] + messages if system_prompt else messages,
        "temperature": temperature,
        "max_tokens": max_tokens
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://api.polza.ai/v1/chat/completions",
        data=payload,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read())
    return data["choices"][0]["message"]["content"]

def ok(data):
    return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps(data, ensure_ascii=False, default=str)}

def err(msg, code=400):
    return {"statusCode": code, "headers": CORS_HEADERS, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    # GET /session/:id  — через ?action=get&session_id=...
    if method == "GET" and action == "get":
        return get_session(params.get("session_id", ""))

    if method != "POST":
        return err("Method not allowed", 405)

    if action == "create_session":
        return create_session(body)
    if action == "save_step":
        return save_step(body)
    if action == "generate_followup":
        return generate_followup(body)
    if action == "generate_summary":
        return generate_summary(body)
    if action == "generate_final":
        return generate_final(body)
    if action == "generate_insights":
        return generate_insights(body)

    return err("Unknown action")


# ── Handlers ────────────────────────────────────────────────────────────────

def create_session(body):
    goal = body.get("goal", "")
    user_role = body.get("user_role", "expert")
    session_id = str(uuid.uuid4())
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO sessions (session_id, user_role, goal, status, current_step) VALUES (%s,%s,%s,'in_progress',1)",
        (session_id, user_role, goal)
    )
    conn.commit()
    cur.close()
    conn.close()
    return ok({"session_id": session_id, "status": "in_progress", "current_step": 1})


def save_step(body):
    session_id = body.get("session_id")
    step_id = body.get("step_id")
    answers = body.get("answers", [])
    if not session_id or step_id is None:
        return err("session_id and step_id are required")
    conn = get_db()
    cur = conn.cursor()
    for ans in answers:
        cur.execute(
            """INSERT INTO answers (session_id, step_id, question_id, question_text, answer_text, answer_type)
               VALUES (%s,%s,%s,%s,%s,%s)
               ON CONFLICT DO NOTHING""",
            (session_id, step_id, ans.get("question_id",""), ans.get("question_text",""),
             ans.get("answer_text",""), ans.get("answer_type","text"))
        )
    next_step = step_id + 1
    cur.execute(
        "UPDATE sessions SET current_step=%s, updated_at=NOW() WHERE session_id=%s",
        (next_step, session_id)
    )
    conn.commit()
    cur.close()
    conn.close()
    return ok({"saved": True, "next_step": next_step})


def generate_followup(body):
    session_id = body.get("session_id")
    step_id = body.get("step_id")
    question_text = body.get("question_text", "")
    answer_text = body.get("answer_text", "")
    if not answer_text.strip():
        return ok({"followup": None})

    system = """Ты — опытный методолог-интервьюер, помогающий людям распаковать их экспертность.
Твоя задача — задать ОДИН короткий уточняющий вопрос по ответу пользователя.
Используй техники качественного интервью: попроси пример, уточни причину, спроси про клиента.
Вопрос должен быть разговорным, коротким (1 предложение), без давления.
Не повторяй вопрос пользователя. Не давай оценок. Только вопрос."""

    messages = [{"role": "user", "content": f"Вопрос был: «{question_text}»\nОтвет пользователя: «{answer_text}»\n\nЗадай один уточняющий вопрос."}]
    followup = polza_chat(messages, system_prompt=system, temperature=0.8, max_tokens=150)
    return ok({"followup": followup.strip()})


def generate_summary(body):
    session_id = body.get("session_id")
    step_id = body.get("step_id")
    if not session_id or step_id is None:
        return err("session_id and step_id are required")

    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "SELECT question_text, answer_text FROM answers WHERE session_id=%s AND step_id<=%s AND answer_text!='' ORDER BY step_id, created_at",
        (session_id, step_id)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    if not rows:
        return ok({"summary": "Пока недостаточно ответов для резюме."})

    qa_text = "\n".join([f"— {r[0]}\n  Ответ: {r[1]}" for r in rows])
    system = """Ты — редактор и методолог. Твоя задача — сделать короткое резюме того, что удалось выявить в ходе интервью.
Пиши от первого лица за пользователя, кратко и конкретно. 3-5 предложений.
Выдели ключевые смыслы и повторяющиеся паттерны. Не пиши банальностей уровня «вы уникальный эксперт».
Формат: просто текст, без заголовков и маркеров."""

    messages = [{"role": "user", "content": f"Вот ответы из интервью:\n{qa_text}\n\nНапиши краткое резюме."}]
    summary_text = polza_chat(messages, system_prompt=system, temperature=0.6, max_tokens=400)

    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO summaries (session_id, step_id, summary_text) VALUES (%s,%s,%s)",
        (session_id, step_id, summary_text)
    )
    conn.commit()
    cur.close()
    conn.close()
    return ok({"summary": summary_text.strip()})


def generate_final(body):
    session_id = body.get("session_id")
    if not session_id:
        return err("session_id is required")

    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "SELECT step_id, question_text, answer_text FROM answers WHERE session_id=%s AND answer_text!='' ORDER BY step_id, created_at",
        (session_id,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    if not rows:
        return err("No answers found for this session")

    step_names = {1:"Цель", 2:"Личность", 3:"Путь эксперта", 4:"Экспертность", 5:"Аудитория", 6:"Позиционирование", 7:"Контент-ядро"}
    qa_by_step = {}
    for step_id, q, a in rows:
        name = step_names.get(step_id, f"Шаг {step_id}")
        qa_by_step.setdefault(name, []).append(f"  Q: {q}\n  A: {a}")
    full_text = "\n\n".join([f"### {name}\n" + "\n".join(qas) for name, qas in qa_by_step.items()])

    system = """Ты — профессиональный методолог по личному брендингу и упаковке экспертов.
На основе интервью с пользователем сформируй структурированный профиль эксперта.
Используй ТОЛЬКО то, что сказал пользователь. Не придумывай факты. Не используй шаблонный маркетинговый язык.
Ответ верни СТРОГО в формате JSON (без markdown-блоков, без ```json) с такими ключами:
{
  "personal_code": "2-3 предложения: кто этот человек в глубине, его ценности и особенности",
  "expert_zone": "2-3 предложения: в чём реальная экспертность, задачи которые решает",
  "audience_profile": "2-3 предложения: кто целевая аудитория, их боли и желания",
  "positioning": "1-2 предложения: чёткая формула — кто я, для кого, с каким результатом",
  "tone_of_voice": "1-2 предложения: тон и стиль общения",
  "content_core": "3-4 предложения: ключевые смыслы и темы для контента",
  "rubrics": ["рубрика 1", "рубрика 2", "рубрика 3", "рубрика 4", "рубрика 5"],
  "self_presentations": [
    {"length": "короткая (1-2 предложения)", "text": "..."},
    {"length": "средняя (3-4 предложения)", "text": "..."},
    {"length": "развёрнутая (6-8 предложений)", "text": "..."}
  ]
}"""

    messages = [{"role": "user", "content": f"Данные интервью:\n\n{full_text}\n\nСформируй итоговый профиль эксперта в JSON."}]
    raw = polza_chat(messages, system_prompt=system, temperature=0.5, max_tokens=2000)

    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[-2] if "```" in raw else raw
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    try:
        profile = json.loads(raw)
    except Exception:
        profile = {"raw": raw}

    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """INSERT INTO final_profiles
           (session_id, personal_code, expert_zone, audience_profile, positioning, tone_of_voice, content_core, rubrics, self_presentations)
           VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
        (session_id,
         profile.get("personal_code",""),
         profile.get("expert_zone",""),
         profile.get("audience_profile",""),
         profile.get("positioning",""),
         profile.get("tone_of_voice",""),
         profile.get("content_core",""),
         json.dumps(profile.get("rubrics",[]), ensure_ascii=False),
         json.dumps(profile.get("self_presentations",[]), ensure_ascii=False))
    )
    cur.execute("UPDATE sessions SET status='completed', updated_at=NOW() WHERE session_id=%s", (session_id,))
    conn.commit()
    cur.close()
    conn.close()
    return ok({"profile": profile})


def generate_insights(body):
    session_id = body.get("session_id")
    if not session_id:
        return err("session_id is required")

    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "SELECT step_id, question_text, answer_text FROM answers WHERE session_id=%s AND answer_text!='' ORDER BY step_id, created_at",
        (session_id,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    if not rows:
        return err("No answers found for this session")

    step_names = {1:"Цель", 2:"Личность", 3:"Путь эксперта", 4:"Экспертность", 5:"Аудитория", 6:"Позиционирование", 7:"Контент-ядро"}
    qa_by_step = {}
    for step_id, q, a in rows:
        name = step_names.get(step_id, f"Шаг {step_id}")
        qa_by_step.setdefault(name, []).append(f"  Q: {q}\n  A: {a}")
    full_text = "\n\n".join([f"### {name}\n" + "\n".join(qas) for name, qas in qa_by_step.items()])

    # ── Слепые зоны ──────────────────────────────────────────────────────────
    blind_system = """Ты — опытный бизнес-психолог и стратег личного бренда.
Твоя задача — увидеть в ответах эксперта то, чего он сам о себе не замечает.
Это не комплименты и не критика — это объективный взгляд снаружи.

Ответ верни СТРОГО в формате JSON (без markdown, без ```json):
{
  "hidden_strengths": [
    {"title": "Название сильной стороны", "description": "1-2 предложения: что именно видно из ответов и почему это ценно"},
    ...
  ],
  "blind_spots": [
    {"title": "Название слепой зоны", "description": "1-2 предложения: что эксперт недооценивает или не замечает в себе"},
    ...
  ],
  "patterns": "2-3 предложения: повторяющиеся паттерны мышления и поведения, которые прослеживаются в ответах",
  "underused_potential": "2-3 предложения: ресурсы и возможности, которые эксперт имеет, но пока не использует на полную",
  "risk_warning": "1-2 предложения: главный риск текущего позиционирования или подхода, который эксперт, вероятно, не видит"
}

Правила:
- Только то, что реально видно из ответов. Никаких домыслов.
- Конкретно и честно, без лести и без осуждения.
- hidden_strengths и blind_spots — по 3-4 пункта каждый."""

    blind_messages = [{"role": "user", "content": f"Интервью с экспертом:\n\n{full_text}\n\nПроанализируй и верни JSON со слепыми зонами и скрытыми сильными сторонами."}]
    blind_raw = polza_chat(blind_messages, system_prompt=blind_system, temperature=0.6, max_tokens=1800)
    blind_raw = blind_raw.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
    try:
        blind_data = json.loads(blind_raw)
    except Exception:
        blind_data = {"raw": blind_raw}

    # ── Маркетинговая стратегия ───────────────────────────────────────────────
    strategy_system = """Ты — стратег по маркетингу личного бренда и продвижению экспертов.
На основе распаковки составь конкретную маркетинговую стратегию продвижения.
Не общие слова — только конкретные действия, каналы и форматы под этого конкретного эксперта.

Ответ верни СТРОГО в формате JSON (без markdown, без ```json):
{
  "positioning_angle": "1-2 предложения: главный угол подачи — через что именно продвигаться, какой нарратив",
  "primary_channels": [
    {"channel": "Название канала", "why": "Почему подходит этому эксперту", "format": "Конкретный формат контента"},
    ...
  ],
  "content_strategy": {
    "weekly_rhythm": "Конкретный ритм публикаций: сколько постов в неделю, какие дни, какие форматы",
    "hook_themes": ["Тема-крючок 1", "Тема-крючок 2", "Тема-крючок 3", "Тема-крючок 4", "Тема-крючок 5"],
    "viral_mechanic": "1-2 предложения: что в этом эксперте может вызывать споры, обсуждение, репосты"
  },
  "lead_magnet": {
    "idea": "Конкретная идея лид-магнита под этого эксперта",
    "format": "Формат: чек-лист / гайд / мини-курс / шаблон / и т.д.",
    "title": "Рабочий заголовок лид-магнита"
  },
  "first_product": {
    "idea": "Идея первого или следующего продукта / услуги под текущую аудиторию",
    "format": "Формат: консультация / мастермайнд / курс / практикум / и т.д.",
    "price_range": "Примерный ценовой диапазон и обоснование",
    "launch_mechanic": "Как запустить: через контент / вебинар / личные продажи / и т.д."
  },
  "quick_wins": [
    "Действие 1 — что сделать в первые 7 дней",
    "Действие 2 — что сделать в первые 7 дней",
    "Действие 3 — что сделать в первые 7 дней"
  ],
  "growth_roadmap": [
    {"period": "1 месяц", "focus": "На чём сфокусироваться", "goal": "Конкретная цель"},
    {"period": "3 месяца", "focus": "На чём сфокусироваться", "goal": "Конкретная цель"},
    {"period": "6 месяцев", "focus": "На чём сфокусироваться", "goal": "Конкретная цель"}
  ]
}

Правила:
- Всё строго под этого конкретного эксперта, его нишу и аудиторию.
- primary_channels — 2-3 канала, не больше. Лучше меньше, но точнее.
- quick_wins должны быть реально выполнимы за 7 дней.
- Никаких общих советов вроде «публикуйте полезный контент»."""

    strategy_messages = [{"role": "user", "content": f"Интервью с экспертом:\n\n{full_text}\n\nСоставь маркетинговую стратегию продвижения в JSON."}]
    strategy_raw = polza_chat(strategy_messages, system_prompt=strategy_system, temperature=0.65, max_tokens=2000)
    strategy_raw = strategy_raw.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
    try:
        strategy_data = json.loads(strategy_raw)
    except Exception:
        strategy_data = {"raw": strategy_raw}

    return ok({"insights": blind_data, "strategy": strategy_data})


def get_session(session_id):
    if not session_id:
        return err("session_id is required")
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT session_id, user_role, goal, status, current_step, created_at FROM sessions WHERE session_id=%s", (session_id,))
    row = cur.fetchone()
    if not row:
        return err("Session not found", 404)
    session = {"session_id": str(row[0]), "user_role": row[1], "goal": row[2], "status": row[3], "current_step": row[4], "created_at": str(row[5])}
    cur.execute("SELECT step_id, question_id, question_text, answer_text FROM answers WHERE session_id=%s ORDER BY step_id, created_at", (session_id,))
    answers = [{"step_id": r[0], "question_id": r[1], "question_text": r[2], "answer_text": r[3]} for r in cur.fetchall()]
    cur.close()
    conn.close()
    return ok({"session": session, "answers": answers})