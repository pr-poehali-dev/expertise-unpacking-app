import { useState, useCallback } from "react";
import Icon from "@/components/ui/icon";
import * as api from "@/api/expertise";
import type { Answer, FinalProfile, BlindInsights, MarketingStrategy } from "@/api/expertise";

// ─── Step definitions ─────────────────────────────────────────────────────────

interface Question {
  id: string;
  text: string;
  hint?: string;
  placeholder?: string;
  type: "textarea" | "choice" | "chips";
  options?: string[];
  required?: boolean;
}

interface Step {
  id: number;
  title: string;
  subtitle: string;
  why: string;
  questions: Question[];
  hasSummary?: boolean;
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "Цель распаковки",
    subtitle: "С чего начнём",
    why: "Понимание вашей цели помогает сфокусировать весь сценарий на том, что действительно важно для вас прямо сейчас.",
    questions: [
      {
        id: "goal_choice",
        text: "Зачем вам сейчас нужна распаковка?",
        type: "choice",
        options: ["Запустить или развить блог", "Создать продукт или курс", "Повысить чек и ценность", "Сменить позиционирование", "Упаковать личный бренд", "Работа с клиентом / методология"],
        required: true,
      },
      {
        id: "goal_comment",
        text: "Добавьте контекст, если хотите (необязательно)",
        hint: "Например: «меняю нишу» или «первый раз упаковываю себя»",
        placeholder: "Напишите, как если бы рассказывали знакомому...",
        type: "textarea",
      },
    ],
  },
  {
    id: 2,
    title: "Личность",
    subtitle: "Кто вы",
    why: "Личностная основа — это фундамент позиционирования. Без неё любая упаковка остаётся пустой.",
    questions: [
      {
        id: "who_now",
        text: "Кто вы сейчас? Опишите себя в нескольких словах — без регалий",
        hint: "Не ищите идеальную формулировку — сначала смысл",
        placeholder: "Например: практик, который строит системы. Или: человек, который помогает другим думать яснее...",
        type: "textarea",
        required: true,
      },
      {
        id: "energizes",
        text: "Что вас заряжает в работе? Когда вы в потоке?",
        placeholder: "Можно коротко. Потом отредактируете.",
        type: "textarea",
        required: true,
      },
      {
        id: "qualities",
        text: "Какие ваши качества отличают вас от большинства коллег?",
        placeholder: "Приведите пример из реальной работы",
        type: "textarea",
      },
      {
        id: "transmit",
        text: "Что вы хотите транслировать аудитории? Какие ценности или идеи?",
        placeholder: "Не ищите идеальную формулировку — сначала смысл",
        type: "textarea",
      },
    ],
  },
  {
    id: 3,
    title: "Путь эксперта",
    subtitle: "Ваша история",
    why: "История формирует доверие. Поворотные точки и ошибки — часто самый ценный материал для контента и позиционирования.",
    hasSummary: true,
    questions: [
      {
        id: "how_came",
        text: "Как вы пришли в эту сферу? С чего началось?",
        placeholder: "Напишите, как если бы рассказывали знакомому",
        type: "textarea",
        required: true,
      },
      {
        id: "key_events",
        text: "Какие события или люди сильно на вас повлияли?",
        placeholder: "Приведите пример из реальной работы",
        type: "textarea",
      },
      {
        id: "key_mistakes",
        text: "Какие ошибки стали для вас ключевыми уроками?",
        hint: "Ошибки — это золото. Именно они часто делают экспертизу настоящей",
        placeholder: "Можно коротко. Потом отредактируете.",
        type: "textarea",
      },
      {
        id: "market_insights",
        text: "Что вы поняли о рынке или клиентах, чего не понимают другие?",
        placeholder: "Приведите пример из реальной работы",
        type: "textarea",
      },
    ],
  },
  {
    id: 4,
    title: "Экспертность",
    subtitle: "Ваша ценность",
    why: "Здесь мы выясним, за что клиенты готовы платить и что вы делаете иначе, чем другие.",
    questions: [
      {
        id: "tasks_solved",
        text: "Какие конкретные задачи вы решаете для клиентов?",
        hint: "Чем конкретнее — тем лучше",
        placeholder: "Например: помогаю командам перестать тушить пожары и начать думать стратегически...",
        type: "textarea",
        required: true,
      },
      {
        id: "client_result",
        text: "Какой результат получает клиент после работы с вами?",
        placeholder: "Приведите пример из реальной работы",
        type: "textarea",
        required: true,
      },
      {
        id: "different",
        text: "Что вы делаете иначе, чем большинство в вашей области?",
        placeholder: "Не ищите идеальную формулировку — сначала смысл",
        type: "textarea",
      },
      {
        id: "methods",
        text: "Какие методы или подходы вы используете?",
        placeholder: "Можно перечислить",
        type: "textarea",
      },
    ],
  },
  {
    id: 5,
    title: "Аудитория",
    subtitle: "Ваш клиент",
    why: "Чёткое понимание своей аудитории — это основа любого сильного позиционирования и контента.",
    hasSummary: true,
    questions: [
      {
        id: "ideal_client",
        text: "Кто ваш идеальный клиент? Опишите его максимально конкретно",
        hint: "Не демография, а образ человека: кем работает, что его волнует",
        placeholder: "Например: предприниматель на стадии первых 5 млн, у которого есть команда, но нет системы...",
        type: "textarea",
        required: true,
      },
      {
        id: "client_state",
        text: "В каком состоянии клиент приходит к вам? Что его беспокоит?",
        placeholder: "Приведите пример из реальной работы",
        type: "textarea",
        required: true,
      },
      {
        id: "client_wants",
        text: "Чего он хочет? Какой результат мечтает получить?",
        placeholder: "Можно коротко. Потом отредактируете.",
        type: "textarea",
      },
      {
        id: "why_you",
        text: "Почему клиент должен выбрать именно вас, а не другого специалиста?",
        placeholder: "Не ищите идеальную формулировку — сначала смысл",
        type: "textarea",
      },
    ],
  },
  {
    id: 6,
    title: "Позиционирование",
    subtitle: "Ваша формула",
    why: "Позиционирование — это короткий и ясный ответ на вопрос «кто вы, для кого и с каким результатом». Соберём его вместе.",
    questions: [
      {
        id: "who_one_phrase",
        text: "Кто вы в одной фразе? Попробуйте сформулировать прямо сейчас",
        hint: "Это рабочая версия, не финальная. Просто попробуйте",
        placeholder: "Например: помогаю экспертам превращать знания в продукты...",
        type: "textarea",
        required: true,
      },
      {
        id: "transformation",
        text: "Какую трансформацию вы даёте клиенту? До → После",
        placeholder: "До: хаос в голове и непонятный оффер. После: чёткое позиционирование и первые продажи...",
        type: "textarea",
        required: true,
      },
      {
        id: "approach",
        text: "В чём особенность вашего подхода?",
        placeholder: "Приведите пример из реальной работы",
        type: "textarea",
      },
      {
        id: "tone",
        text: "Каким тоном вы хотите звучать?",
        type: "choice",
        options: ["Строго и экспертно", "Дружески и по-человечески", "Вдохновляюще и с энергией", "Прагматично и по делу", "С юмором и легко", "Философски и глубоко"],
      },
    ],
  },
  {
    id: 7,
    title: "Контент-ядро",
    subtitle: "Смыслы для блога",
    why: "Контент-ядро — это то, о чём вы будете говорить постоянно. Основа для блога, выступлений, продаж.",
    hasSummary: true,
    questions: [
      {
        id: "important_topics",
        text: "О чём вам важно говорить? Что вас по-настоящему волнует?",
        hint: "Не про тренды, а про то, что горит изнутри",
        placeholder: "Например: про то, что большинство людей недооценивает свой опыт...",
        type: "textarea",
        required: true,
      },
      {
        id: "audience_topics",
        text: "Какие темы волнуют вашу аудиторию?",
        placeholder: "Можно коротко. Потом отредактируете.",
        type: "textarea",
      },
      {
        id: "formats",
        text: "Какие форматы контента вам комфортны?",
        type: "chips",
        options: ["Длинные тексты", "Короткие посты", "Видео", "Подкасты", "Сторис", "Разборы кейсов", "Личные истории", "Обучение / инструкции", "Мнения и позиции", "Интервью"],
      },
      {
        id: "key_meanings",
        text: "Какие 3–5 смыслов должны звучать в вашем контенте постоянно?",
        hint: "Это основа вашего голоса",
        placeholder: "Например: системность, честность про провалы, практика важнее теории...",
        type: "textarea",
      },
    ],
  },
];

// ─── App state types ──────────────────────────────────────────────────────────

type AppState = "landing" | "wizard" | "result";

interface WizardState {
  sessionId: string;
  currentStep: number;
  answers: Record<string, string>;
  followups: Record<string, string>;
  summaries: Record<number, string>;
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function copyText(text: string) {
  navigator.clipboard.writeText(text).catch(() => {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  });
}

// ─── Landing ──────────────────────────────────────────────────────────────────

function Landing({ onStart, loading, error }: { onStart: () => void; loading: boolean; error: string }) {
  const outcomes = [
    { icon: "Fingerprint", label: "Личный код", desc: "Кто вы и в чём ваша суть" },
    { icon: "Layers", label: "Экспертная зона", desc: "Что вы умеете лучше других" },
    { icon: "Users", label: "Портрет аудитории", desc: "Кому вы по-настоящему нужны" },
    { icon: "Crosshair", label: "Позиционирование", desc: "Формула: кто → для кого → результат" },
    { icon: "Mic2", label: "3 самопрезентации", desc: "Короткая, средняя и развёрнутая" },
    { icon: "LayoutGrid", label: "5 контент-рубрик", desc: "Основа для системного блога" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <header className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "var(--accent)", color: "var(--bg)" }}>
            <Icon name="Sparkles" size={14} />
          </div>
          <span className="font-semibold text-sm" style={{ color: "var(--fg)" }}>Распаковка экспертности</span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "var(--surface2)", color: "var(--muted)" }}>Beta</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-xl w-full text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-8"
            style={{ background: "var(--accent-subtle)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}>
            <Icon name="Zap" size={12} />
            AI-assisted · 7 шагов · ~30 минут
          </div>

          <h1 className="font-display mb-5 leading-tight" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "var(--fg)", fontWeight: 300 }}>
            Узнайте, в чём ваша<br />
            <span style={{ color: "var(--accent)" }}>настоящая экспертность</span>
          </h1>

          <p className="text-base leading-relaxed mb-10 mx-auto max-w-md" style={{ color: "var(--muted)" }}>
            Пошаговый сценарий с AI-помощником. На выходе — готовый профиль для блога, сайта и продаж.
          </p>

          <button onClick={onStart} disabled={loading}
            className="ex-btn-primary text-sm px-8 py-3.5 rounded-xl mb-3 flex items-center gap-2 mx-auto disabled:opacity-60">
            {loading ? <Icon name="Loader2" size={16} className="animate-spin" /> : <Icon name="ArrowRight" size={16} />}
            {loading ? "Запускаем..." : "Начать распаковку"}
          </button>

          {error && <p className="text-sm mt-2 mb-2" style={{ color: "#ef4444" }}>{error}</p>}
          <p className="text-xs" style={{ color: "var(--muted2)" }}>Бесплатно · Без регистрации · Результат сразу</p>
        </div>

        <div className="max-w-xl w-full mt-14">
          <p className="text-xs text-center mb-5 uppercase tracking-widest" style={{ color: "var(--muted2)" }}>Что вы получите</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {outcomes.map((o, i) => (
              <div key={i} className="ex-card rounded-xl p-4 text-left">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-3" style={{ background: "var(--accent-subtle)" }}>
                  <Icon name={o.icon} size={14} style={{ color: "var(--accent)" }} fallback="Star" />
                </div>
                <p className="text-sm font-medium mb-0.5" style={{ color: "var(--fg)" }}>{o.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── ProgressBar ──────────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round(((step - 1) / total) * 100);
  return (
    <div style={{ height: 2, background: "var(--border)", width: "100%" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: "var(--accent)", transition: "width 0.5s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

// ─── ChoiceCards ──────────────────────────────────────────────────────────────

function ChoiceCards({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt === value ? "" : opt)}
          className="text-left px-4 py-3 rounded-xl text-sm transition-all"
          style={{
            background: value === opt ? "var(--accent-subtle)" : "var(--surface)",
            border: `1.5px solid ${value === opt ? "var(--accent)" : "var(--border)"}`,
            color: value === opt ? "var(--accent)" : "var(--fg)",
          }}>
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ border: `1.5px solid ${value === opt ? "var(--accent)" : "var(--border)"}` }}>
              {value === opt && <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent)" }} />}
            </div>
            {opt}
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Chips ────────────────────────────────────────────────────────────────────

function Chips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  const selected = value ? value.split(",").map(s => s.trim()).filter(Boolean) : [];
  const toggle = (opt: string) => {
    const next = selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt];
    onChange(next.join(", "));
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button key={opt} onClick={() => toggle(opt)}
            className="px-3 py-1.5 rounded-full text-sm transition-all"
            style={{
              background: active ? "var(--accent-subtle)" : "var(--surface)",
              border: `1.5px solid ${active ? "var(--accent)" : "var(--border)"}`,
              color: active ? "var(--accent)" : "var(--muted)",
            }}>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ─── QuestionBlock ────────────────────────────────────────────────────────────

function QuestionBlock({ question, value, onChange, followup, onFollowup, followupAnswer, onFollowupAnswer, isLoadingFollowup }: {
  question: Question; value: string; onChange: (v: string) => void;
  followup?: string; onFollowup: () => void; followupAnswer: string;
  onFollowupAnswer: (v: string) => void; isLoadingFollowup: boolean;
}) {
  const [showHint, setShowHint] = useState(false);
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between gap-3 mb-2">
        <label className="text-sm font-medium leading-snug" style={{ color: "var(--fg)" }}>
          {question.text}
          {question.required && <span style={{ color: "var(--accent)" }}> *</span>}
        </label>
        {question.hint && (
          <button onClick={() => setShowHint(!showHint)} title="Подсказка"
            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all"
            style={{ background: showHint ? "var(--accent-subtle)" : "var(--surface2)", color: showHint ? "var(--accent)" : "var(--muted)", border: "1px solid var(--border)" }}>
            ?
          </button>
        )}
      </div>

      {showHint && question.hint && (
        <div className="mb-3 px-3 py-2 rounded-lg text-xs leading-relaxed"
          style={{ background: "var(--accent-subtle)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}>
          💡 {question.hint}
        </div>
      )}

      {question.type === "textarea" && (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={question.placeholder} rows={4}
          className="ex-textarea w-full rounded-xl text-sm resize-none" style={{ padding: "12px 14px" }}
        />
      )}
      {question.type === "choice" && <ChoiceCards options={question.options || []} value={value} onChange={onChange} />}
      {question.type === "chips" && <Chips options={question.options || []} value={value} onChange={onChange} />}

      {question.type === "textarea" && value.length > 30 && !followup && !isLoadingFollowup && (
        <button onClick={onFollowup} className="mt-2 text-xs flex items-center gap-1.5" style={{ color: "var(--muted2)" }}>
          <Icon name="MessageCircle" size={12} />
          Уточняющий вопрос от AI
        </button>
      )}
      {isLoadingFollowup && (
        <p className="mt-2 text-xs flex items-center gap-1.5" style={{ color: "var(--muted2)" }}>
          <Icon name="Loader2" size={12} className="animate-spin" /> AI думает...
        </p>
      )}

      {followup && (
        <div className="mt-3 rounded-xl p-3" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
          <p className="text-xs mb-2 font-medium" style={{ color: "var(--accent)" }}>↳ {followup}</p>
          <textarea value={followupAnswer} onChange={e => onFollowupAnswer(e.target.value)}
            placeholder="Ваш ответ..." rows={2}
            className="ex-textarea w-full rounded-lg text-xs resize-none" style={{ padding: "8px 10px" }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Summary Screen ───────────────────────────────────────────────────────────

function SummaryScreen({ stepId, text, isLoading, onContinue }: { stepId: number; text: string; isLoading: boolean; onContinue: () => void }) {
  const stepName = STEPS.find(s => s.id === stepId)?.title || `Шаг ${stepId}`;
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-xl w-full">
        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-6" style={{ background: "var(--accent-subtle)" }}>
          <Icon name="CheckCircle2" size={20} style={{ color: "var(--accent)" }} />
        </div>
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--muted2)" }}>Резюме блока · {stepName}</p>
        <h2 className="font-display text-2xl font-light mb-6" style={{ color: "var(--fg)" }}>Что удалось выявить</h2>

        <div className="ex-card rounded-2xl p-6 mb-6 min-h-24">
          {isLoading ? (
            <div className="flex items-center gap-3" style={{ color: "var(--muted)" }}>
              <Icon name="Loader2" size={18} className="animate-spin" />
              <span className="text-sm">AI составляет резюме...</span>
            </div>
          ) : (
            <p className="text-sm leading-relaxed" style={{ color: "var(--fg)", whiteSpace: "pre-wrap" }}>{text}</p>
          )}
        </div>

        <button onClick={onContinue} disabled={isLoading}
          className="ex-btn-primary px-6 py-3 rounded-xl text-sm w-full disabled:opacity-50">
          Продолжить →
        </button>
      </div>
    </div>
  );
}

// ─── Wizard ───────────────────────────────────────────────────────────────────

function Wizard({ state, setState, onComplete }: {
  state: WizardState;
  setState: (s: WizardState) => void;
  onComplete: (profile: FinalProfile) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [followupLoading, setFollowupLoading] = useState<string | null>(null);
  const [summaryState, setSummaryState] = useState<{ show: boolean; loading: boolean; text: string }>({ show: false, loading: false, text: "" });
  const [error, setError] = useState("");

  const step = STEPS[state.currentStep - 1];
  const isLastStep = state.currentStep === STEPS.length;

  const setAnswer = useCallback((qId: string, val: string) => {
    setState({ ...state, answers: { ...state.answers, [qId]: val } });
  }, [state, setState]);

  const setFollowupQ = useCallback((qId: string, followup: string) => {
    setState({ ...state, followups: { ...state.followups, [qId]: followup } });
  }, [state, setState]);

  const setFollowupA = useCallback((qId: string, val: string) => {
    setState({ ...state, answers: { ...state.answers, [`${qId}_followup`]: val } });
  }, [state, setState]);

  const requestFollowup = async (q: Question) => {
    const answer = state.answers[q.id] || "";
    if (!answer.trim() || followupLoading) return;
    setFollowupLoading(q.id);
    try {
      const res = await api.generateFollowup(state.sessionId, step.id, q.text, answer);
      if (res.followup) setFollowupQ(q.id, res.followup);
    } catch (err: unknown) {
      console.error("followup error", err);
    }
    setFollowupLoading(null);
  };

  const buildAnswers = (): Answer[] => {
    const result: Answer[] = [];
    for (const q of step.questions) {
      const val = state.answers[q.id] || "";
      if (val) result.push({ question_id: q.id, question_text: q.text, answer_text: val });
      const fq = state.followups[q.id];
      const fval = state.answers[`${q.id}_followup`] || "";
      if (fq && fval) result.push({ question_id: `${q.id}_followup`, question_text: fq, answer_text: fval });
    }
    return result;
  };

  const handleNext = async () => {
    const required = step.questions.filter(q => q.required);
    for (const q of required) {
      if (!state.answers[q.id]?.trim()) {
        setError(`Пожалуйста, ответьте на вопрос: «${q.text}»`);
        return;
      }
    }
    setError("");
    setLoading(true);
    try {
      await api.saveStep(state.sessionId, step.id, buildAnswers());
      if (step.hasSummary) {
        setSummaryState({ show: true, loading: true, text: "" });
        setLoading(false);
        const sumRes = await api.generateSummary(state.sessionId, step.id);
        setSummaryState({ show: true, loading: false, text: sumRes.summary });
        return;
      }
      if (isLastStep) {
        const finalRes = await api.generateFinal(state.sessionId);
        onComplete(finalRes.profile);
      } else {
        setState({ ...state, currentStep: state.currentStep + 1 });
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Произошла ошибка. Попробуйте ещё раз.");
    }
    setLoading(false);
  };

  const handleSummaryContinue = async () => {
    setSummaryState({ show: false, loading: false, text: "" });
    if (isLastStep) {
      setLoading(true);
      try {
        const finalRes = await api.generateFinal(state.sessionId);
        onComplete(finalRes.profile);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Ошибка генерации профиля.");
      }
      setLoading(false);
    } else {
      setState({ ...state, currentStep: state.currentStep + 1 });
    }
  };

  if (summaryState.show) {
    return <SummaryScreen stepId={step.id} text={summaryState.text} isLoading={summaryState.loading} onContinue={handleSummaryContinue} />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "var(--accent)", color: "var(--bg)" }}>
              <Icon name="Sparkles" size={11} />
            </div>
            <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Распаковка</span>
          </div>
          <span className="text-xs font-mono" style={{ color: "var(--muted2)" }}>Шаг {state.currentStep} из {STEPS.length}</span>
        </div>
        <ProgressBar step={state.currentStep} total={STEPS.length} />
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
        <div key={step.id} style={{ animation: "fadeInUp 0.35s ease forwards" }}>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold"
              style={{ background: "var(--accent)", color: "var(--bg)" }}>
              {step.id}
            </div>
            <span className="text-xs uppercase tracking-widest" style={{ color: "var(--muted2)" }}>{step.subtitle}</span>
          </div>

          <h2 className="font-display mb-2" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "var(--fg)", fontWeight: 300, lineHeight: 1.2 }}>
            {step.title}
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--muted)" }}>{step.why}</p>

          {step.questions.map(q => (
            <QuestionBlock
              key={q.id}
              question={q}
              value={state.answers[q.id] || ""}
              onChange={val => setAnswer(q.id, val)}
              followup={state.followups[q.id]}
              onFollowup={() => requestFollowup(q)}
              followupAnswer={state.answers[`${q.id}_followup`] || ""}
              onFollowupAnswer={val => setFollowupA(q.id, val)}
              isLoadingFollowup={followupLoading === q.id}
            />
          ))}

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 mt-2" style={{ borderTop: "1px solid var(--border)" }}>
            {state.currentStep > 1 ? (
              <button onClick={() => setState({ ...state, currentStep: state.currentStep - 1 })}
                className="flex items-center gap-1.5 text-sm" style={{ color: "var(--muted)" }}>
                <Icon name="ArrowLeft" size={15} /> Назад
              </button>
            ) : <div />}

            <button onClick={handleNext} disabled={loading}
              className="ex-btn-primary px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-60">
              {loading && <Icon name="Loader2" size={15} className="animate-spin" />}
              {isLastStep ? (loading ? "Создаём профиль..." : "Сформировать результат ✦") : "Далее"}
              {!loading && !isLastStep && <Icon name="ArrowRight" size={15} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ResultBlock ──────────────────────────────────────────────────────────────

function ResultBlock({ title, icon, content }: { title: string; icon: string; content: string | string[] }) {
  const [copied, setCopied] = useState(false);
  const text = Array.isArray(content) ? content.join("\n") : content;
  const handleCopy = () => { copyText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="ex-card rounded-2xl p-5 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon name={icon} size={15} style={{ color: "var(--accent)" }} fallback="Star" />
          <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>{title}</h3>
        </div>
        <button onClick={handleCopy} className="text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all"
          style={{ background: copied ? "var(--accent-subtle)" : "var(--surface2)", color: copied ? "var(--accent)" : "var(--muted)" }}>
          <Icon name={copied ? "Check" : "Copy"} size={11} />
          {copied ? "Скопировано" : "Копировать"}
        </button>
      </div>
      {Array.isArray(content) ? (
        <ul className="space-y-1.5">
          {content.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--fg)" }}>
              <span style={{ color: "var(--accent)", marginTop: 3, flexShrink: 0 }}>·</span>{item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-relaxed" style={{ color: "var(--fg)", whiteSpace: "pre-wrap" }}>{content}</p>
      )}
    </div>
  );
}

// ─── Blind Insights Section ───────────────────────────────────────────────────

function BlindInsightsSection({ data }: { data: BlindInsights }) {
  return (
    <div className="space-y-4">
      {/* Hidden strengths */}
      {(data.hidden_strengths?.length ?? 0) > 0 && (
        <div className="ex-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="Eye" size={15} style={{ color: "#10b981" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>Скрытые сильные стороны</h3>
          </div>
          <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>То, что вы используете как само собой разумеющееся — но это редкость на рынке</p>
          <div className="space-y-3">
            {data.hidden_strengths.map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 text-xs font-bold"
                  style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>{i + 1}</div>
                <div>
                  <p className="text-sm font-medium mb-0.5" style={{ color: "var(--fg)" }}>{s.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blind spots */}
      {(data.blind_spots?.length ?? 0) > 0 && (
        <div className="ex-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="EyeOff" size={15} style={{ color: "#f59e0b" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>Слепые зоны</h3>
          </div>
          <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>То, чего вы о себе не замечаете — но это видно снаружи</p>
          <div className="space-y-3">
            {data.blind_spots.map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 text-xs font-bold"
                  style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>{i + 1}</div>
                <div>
                  <p className="text-sm font-medium mb-0.5" style={{ color: "var(--fg)" }}>{s.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patterns */}
      {data.patterns && (
        <div className="ex-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="GitBranch" size={15} style={{ color: "var(--accent)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>Паттерны мышления</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--fg)" }}>{data.patterns}</p>
        </div>
      )}

      {/* Underused potential */}
      {data.underused_potential && (
        <div className="ex-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="TrendingUp" size={15} style={{ color: "#10b981" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>Нераскрытый потенциал</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--fg)" }}>{data.underused_potential}</p>
        </div>
      )}

      {/* Risk warning */}
      {data.risk_warning && (
        <div className="rounded-2xl p-5" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Icon name="AlertTriangle" size={15} style={{ color: "#f59e0b" }} />
            <h3 className="text-sm font-semibold" style={{ color: "#f59e0b" }}>Главный риск</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--fg)" }}>{data.risk_warning}</p>
        </div>
      )}
    </div>
  );
}

// ─── Marketing Strategy Section ───────────────────────────────────────────────

function MarketingStrategySection({ data }: { data: MarketingStrategy }) {
  return (
    <div className="space-y-4">
      {/* Angle */}
      {data.positioning_angle && (
        <div className="ex-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Crosshair" size={15} style={{ color: "var(--accent)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>Угол подачи</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--fg)" }}>{data.positioning_angle}</p>
        </div>
      )}

      {/* Channels */}
      {(data.primary_channels?.length ?? 0) > 0 && (
        <div className="ex-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="Radio" size={15} style={{ color: "var(--accent)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>Приоритетные каналы</h3>
          </div>
          <div className="space-y-4">
            {data.primary_channels.map((ch, i) => (
              <div key={i} className="pb-4 last:pb-0" style={{ borderBottom: i < data.primary_channels.length - 1 ? "1px solid var(--border)" : "none" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--fg)" }}>{ch.channel}</p>
                <p className="text-xs leading-relaxed mb-1.5" style={{ color: "var(--muted)" }}>{ch.why}</p>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}>
                  {ch.format}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content strategy */}
      {data.content_strategy && (
        <div className="ex-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="Calendar" size={15} style={{ color: "var(--accent)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>Контент-стратегия</h3>
          </div>
          {data.content_strategy.weekly_rhythm && (
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider mb-1.5" style={{ color: "var(--muted2)" }}>Ритм публикаций</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--fg)" }}>{data.content_strategy.weekly_rhythm}</p>
            </div>
          )}
          {(data.content_strategy.hook_themes?.length ?? 0) > 0 && (
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--muted2)" }}>Темы-крючки</p>
              <div className="flex flex-wrap gap-2">
                {data.content_strategy.hook_themes.map((t, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "var(--surface2)", color: "var(--fg)", border: "1px solid var(--border)" }}>{t}</span>
                ))}
              </div>
            </div>
          )}
          {data.content_strategy.viral_mechanic && (
            <div>
              <p className="text-xs uppercase tracking-wider mb-1.5" style={{ color: "var(--muted2)" }}>Вирусная механика</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--fg)" }}>{data.content_strategy.viral_mechanic}</p>
            </div>
          )}
        </div>
      )}

      {/* Lead magnet */}
      {data.lead_magnet && (
        <div className="ex-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="Gift" size={15} style={{ color: "#10b981" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>Лид-магнит</h3>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--fg)" }}>{data.lead_magnet.title}</p>
          <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>{data.lead_magnet.idea}</p>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
            {data.lead_magnet.format}
          </span>
        </div>
      )}

      {/* First product */}
      {data.first_product && (
        <div className="ex-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="Package" size={15} style={{ color: "var(--accent)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>Первый / следующий продукт</h3>
          </div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--fg)" }}>{data.first_product.idea}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3" style={{ background: "var(--surface2)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--muted2)" }}>Формат</p>
              <p className="text-xs font-medium" style={{ color: "var(--fg)" }}>{data.first_product.format}</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: "var(--surface2)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--muted2)" }}>Цена</p>
              <p className="text-xs font-medium" style={{ color: "var(--fg)" }}>{data.first_product.price_range}</p>
            </div>
          </div>
          {data.first_product.launch_mechanic && (
            <div className="mt-3">
              <p className="text-xs mb-1" style={{ color: "var(--muted2)" }}>Как запустить</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{data.first_product.launch_mechanic}</p>
            </div>
          )}
        </div>
      )}

      {/* Quick wins */}
      {(data.quick_wins?.length ?? 0) > 0 && (
        <div className="rounded-2xl p-5" style={{ background: "rgba(124,110,246,0.06)", border: "1px solid var(--accent-border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="Zap" size={15} style={{ color: "var(--accent)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>Первые 7 дней — быстрые шаги</h3>
          </div>
          <div className="space-y-2.5">
            {data.quick_wins.map((w, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 text-xs font-bold"
                  style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}>{i + 1}</div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--fg)" }}>{w}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roadmap */}
      {(data.growth_roadmap?.length ?? 0) > 0 && (
        <div className="ex-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="Map" size={15} style={{ color: "var(--accent)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>Дорожная карта роста</h3>
          </div>
          <div className="space-y-4">
            {data.growth_roadmap.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: "var(--accent-subtle)", color: "var(--accent)", border: "1.5px solid var(--accent-border)" }}>
                    {i + 1}
                  </div>
                  {i < data.growth_roadmap.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: "var(--border)" }} />}
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: "var(--surface2)", color: "var(--muted)" }}>{item.period}</span>
                  </div>
                  <p className="text-sm font-medium mb-0.5" style={{ color: "var(--fg)" }}>{item.focus}</p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>{item.goal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Result Screen ────────────────────────────────────────────────────────────

function ResultScreen({ profile, sessionId, onRestart }: { profile: FinalProfile; sessionId: string; onRestart: () => void }) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "insights" | "strategy">("profile");
  const [insights, setInsights] = useState<BlindInsights | null>(null);
  const [strategy, setStrategy] = useState<MarketingStrategy | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  const handleLoadInsights = async () => {
    if (insights && strategy) { setActiveTab("insights"); return; }
    setInsightsLoading(true);
    setInsightsError("");
    try {
      const res = await api.generateInsights(sessionId);
      setInsights(res.insights);
      setStrategy(res.strategy);
      setActiveTab("insights");
    } catch (e: unknown) {
      setInsightsError(e instanceof Error ? e.message : "Ошибка генерации. Попробуйте ещё раз.");
    }
    setInsightsLoading(false);
  };

  const fullText = [
    "ПРОФИЛЬ ЭКСПЕРТА\n",
    `ЛИЧНЫЙ КОД\n${profile.personal_code}`,
    `ЭКСПЕРТНАЯ ЗОНА\n${profile.expert_zone}`,
    `ПОРТРЕТ АУДИТОРИИ\n${profile.audience_profile}`,
    `ПОЗИЦИОНИРОВАНИЕ\n${profile.positioning}`,
    `ТОН ОБЩЕНИЯ\n${profile.tone_of_voice}`,
    `КОНТЕНТ-ЯДРО\n${profile.content_core}`,
    `КОНТЕНТ-РУБРИКИ\n${(profile.rubrics || []).map((r, i) => `${i + 1}. ${r}`).join("\n")}`,
    `САМОПРЕЗЕНТАЦИИ\n${(profile.self_presentations || []).map(s => `[${s.length}]\n${s.text}`).join("\n\n")}`,
  ].join("\n\n");

  const handleDownload = () => {
    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "профиль-эксперта.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div style={{ borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "var(--bg)", zIndex: 40 }}>
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "var(--accent)", color: "var(--bg)" }}>
              <Icon name="Sparkles" size={11} />
            </div>
            <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Профиль готов</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleDownload} className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              style={{ background: "var(--surface2)", color: "var(--muted)", border: "1px solid var(--border)" }}>
              <Icon name="Download" size={12} /> Скачать
            </button>
            <button onClick={() => { copyText(fullText); setCopiedAll(true); setTimeout(() => setCopiedAll(false), 2500); }}
              className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
              style={{ background: copiedAll ? "var(--accent-subtle)" : "var(--accent)", color: copiedAll ? "var(--accent)" : "var(--bg)" }}>
              <Icon name={copiedAll ? "Check" : "Copy"} size={12} />
              {copiedAll ? "Скопировано!" : "Копировать всё"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-0">
        <div className="flex gap-0 rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>
          {([
            { key: "profile" as const, label: "Профиль", icon: "User" },
            { key: "insights" as const, label: "Полная картина", icon: "Eye" },
            { key: "strategy" as const, label: "Стратегия", icon: "TrendingUp" },
          ]).map(tab => (
            <button key={tab.key}
              onClick={() => tab.key === "insights" ? handleLoadInsights() : tab.key === "strategy" ? (insights ? setActiveTab("strategy") : handleLoadInsights()) : setActiveTab(tab.key)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all"
              style={{
                background: activeTab === tab.key ? "var(--accent)" : "transparent",
                color: activeTab === tab.key ? "#fff" : "var(--muted)",
              }}>
              <Icon name={tab.icon} size={13} fallback="Star" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Profile tab */}
        {activeTab === "profile" && (
          <div style={{ animation: "fadeInUp 0.3s ease forwards" }}>
            <div className="mb-7">
              <h1 className="font-display text-2xl font-light mb-1" style={{ color: "var(--fg)" }}>Ваш профиль эксперта</h1>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Используйте в блоге, на сайте и в продажах</p>
            </div>

            <ResultBlock title="Личный код" icon="Fingerprint" content={profile.personal_code || "—"} />
            <ResultBlock title="Экспертная зона" icon="Layers" content={profile.expert_zone || "—"} />
            <ResultBlock title="Портрет аудитории" icon="Users" content={profile.audience_profile || "—"} />
            <ResultBlock title="Позиционирование" icon="Crosshair" content={profile.positioning || "—"} />
            <ResultBlock title="Тон общения" icon="MessageSquare" content={profile.tone_of_voice || "—"} />
            <ResultBlock title="Контент-ядро" icon="Flame" content={profile.content_core || "—"} />
            {(profile.rubrics?.length ?? 0) > 0 && (
              <ResultBlock title="5 контент-рубрик" icon="LayoutGrid" content={profile.rubrics} />
            )}

            {(profile.self_presentations?.length ?? 0) > 0 && (
              <div className="ex-card rounded-2xl p-5 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="Mic2" size={15} style={{ color: "var(--accent)" }} />
                  <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>Самопрезентации</h3>
                </div>
                {profile.self_presentations.map((sp, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted2)" }}>{sp.length}</p>
                      <button onClick={() => copyText(sp.text)} className="text-xs" style={{ color: "var(--muted)" }}>Скопировать</button>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--fg)" }}>{sp.text}</p>
                    {i < profile.self_presentations.length - 1 && <div className="mt-4" style={{ borderTop: "1px solid var(--border)" }} />}
                  </div>
                ))}
              </div>
            )}

            {/* CTA to insights */}
            <div className="mt-6 p-5 rounded-2xl" style={{ background: "rgba(124,110,246,0.06)", border: "1px solid var(--accent-border)" }}>
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "var(--accent-subtle)" }}>
                  <Icon name="Eye" size={16} style={{ color: "var(--accent)" }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1" style={{ color: "var(--fg)" }}>Хотите увидеть полную картину?</p>
                  <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>AI проанализирует то, чего вы о себе не замечаете — и составит маркетинговую стратегию специально под вас</p>
                  <button onClick={handleLoadInsights} disabled={insightsLoading}
                    className="ex-btn-primary px-5 py-2 rounded-lg text-xs flex items-center gap-2 disabled:opacity-60">
                    {insightsLoading ? <Icon name="Loader2" size={13} className="animate-spin" /> : <Icon name="Sparkles" size={13} />}
                    {insightsLoading ? "Анализируем..." : "Получить полный анализ"}
                  </button>
                  {insightsError && <p className="text-xs mt-2" style={{ color: "#ef4444" }}>{insightsError}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Insights tab */}
        {activeTab === "insights" && (
          <div style={{ animation: "fadeInUp 0.3s ease forwards" }}>
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="Eye" size={16} style={{ color: "var(--accent)" }} />
                <h1 className="font-display text-2xl font-light" style={{ color: "var(--fg)" }}>Полная картина</h1>
              </div>
              <p className="text-xs" style={{ color: "var(--muted)" }}>То, чего вы о себе не видите — взгляд снаружи</p>
            </div>
            {insightsLoading && (
              <div className="ex-card rounded-2xl p-8 text-center">
                <Icon name="Loader2" size={24} className="animate-spin mx-auto mb-3" style={{ color: "var(--accent)" }} />
                <p className="text-sm" style={{ color: "var(--muted)" }}>AI анализирует ваши ответы...</p>
              </div>
            )}
            {insights && !insightsLoading && <BlindInsightsSection data={insights} />}
          </div>
        )}

        {/* Strategy tab */}
        {activeTab === "strategy" && (
          <div style={{ animation: "fadeInUp 0.3s ease forwards" }}>
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="TrendingUp" size={16} style={{ color: "var(--accent)" }} />
                <h1 className="font-display text-2xl font-light" style={{ color: "var(--fg)" }}>Маркетинговая стратегия</h1>
              </div>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Конкретный план продвижения под вашу экспертность</p>
            </div>
            {insightsLoading && (
              <div className="ex-card rounded-2xl p-8 text-center">
                <Icon name="Loader2" size={24} className="animate-spin mx-auto mb-3" style={{ color: "var(--accent)" }} />
                <p className="text-sm" style={{ color: "var(--muted)" }}>Составляем стратегию...</p>
              </div>
            )}
            {strategy && !insightsLoading && <MarketingStrategySection data={strategy} />}
          </div>
        )}

        {/* Restart */}
        <div className="mt-10 p-5 rounded-2xl text-center" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--fg)" }}>Хотите пройти ещё раз?</p>
          <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>Начните новую сессию — всё начнётся с чистого листа</p>
          <button onClick={onRestart} className="text-sm px-5 py-2.5 rounded-xl"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--fg)" }}>
            Начать заново
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

const EMPTY_WIZARD: WizardState = { sessionId: "", currentStep: 1, answers: {}, followups: {}, summaries: {} };

export default function App() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [wizardState, setWizardState] = useState<WizardState>(EMPTY_WIZARD);
  const [finalProfile, setFinalProfile] = useState<FinalProfile | null>(null);
  const [startLoading, setStartLoading] = useState(false);
  const [startError, setStartError] = useState("");

  const handleStart = async () => {
    setStartLoading(true); setStartError("");
    try {
      const res = await api.createSession("", "expert");
      setWizardState({ ...EMPTY_WIZARD, sessionId: res.session_id });
      setAppState("wizard");
    } catch (e: unknown) {
      setStartError(e instanceof Error ? e.message : "Ошибка соединения. Попробуйте ещё раз.");
    }
    setStartLoading(false);
  };

  const handleComplete = (profile: FinalProfile) => { setFinalProfile(profile); setAppState("result"); };
  const handleRestart = () => { setWizardState(EMPTY_WIZARD); setFinalProfile(null); setAppState("landing"); };

  if (appState === "landing") return <Landing onStart={handleStart} loading={startLoading} error={startError} />;
  if (appState === "wizard") return <Wizard state={wizardState} setState={setWizardState} onComplete={handleComplete} />;
  if (appState === "result" && finalProfile) return <ResultScreen profile={finalProfile} sessionId={wizardState.sessionId} onRestart={handleRestart} />;
  return null;
}