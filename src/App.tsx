import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ───────────────────────────────────────────────────────────────────

type Page = "home" | "profile" | "tests" | "results" | "admin" | "help" | "contacts" | "test-active";

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

interface Test {
  id: number;
  title: string;
  description: string;
  questions: number;
  duration: string;
  category: string;
  difficulty: "Лёгкий" | "Средний" | "Сложный";
  attempts: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TESTS: Test[] = [
  { id: 1, title: "Основы маркетинга", description: "Базовые концепции современного маркетинга и продвижения", questions: 15, duration: "20 мин", category: "Маркетинг", difficulty: "Лёгкий", attempts: 847 },
  { id: 2, title: "Финансовая грамотность", description: "Управление личными финансами, инвестиции и бюджетирование", questions: 20, duration: "30 мин", category: "Финансы", difficulty: "Средний", attempts: 623 },
  { id: 3, title: "Психология переговоров", description: "Техники убеждения, стратегии и психологические аспекты", questions: 25, duration: "40 мин", category: "Психология", difficulty: "Сложный", attempts: 391 },
  { id: 4, title: "Управление проектами", description: "Методологии, инструменты и практики управления проектами", questions: 18, duration: "25 мин", category: "Менеджмент", difficulty: "Средний", attempts: 512 },
];

const SAMPLE_QUESTIONS: Question[] = [
  { id: 1, text: "Что такое целевая аудитория в маркетинге?", options: ["Все потенциальные покупатели на рынке", "Группа людей, которой адресован продукт или услуга", "Аудитория рекламных показов", "База существующих клиентов"], correct: 1 },
  { id: 2, text: "Какой из методов НЕ относится к digital-маркетингу?", options: ["SEO-продвижение", "Контекстная реклама", "Печатные буклеты", "Email-рассылки"], correct: 2 },
  { id: 3, text: "Что означает аббревиатура CRM?", options: ["Content Resource Management", "Customer Relationship Management", "Creative Revenue Model", "Corporate Risk Management"], correct: 1 },
];

const RESULTS = [
  { test: "Основы маркетинга", score: 87, date: "28 апр 2026", time: "18 мин", status: "Отлично" },
  { test: "Финансовая грамотность", score: 64, date: "22 апр 2026", time: "28 мин", status: "Хорошо" },
  { test: "Управление проектами", score: 91, date: "15 апр 2026", time: "22 мин", status: "Отлично" },
];

// ─── Nav ──────────────────────────────────────────────────────────────────────

const NAV_ITEMS: { key: Page; label: string; icon: string }[] = [
  { key: "home", label: "Главная", icon: "Home" },
  { key: "profile", label: "Кабинет", icon: "User" },
  { key: "tests", label: "Тесты", icon: "FileQuestion" },
  { key: "results", label: "Результаты", icon: "BarChart3" },
  { key: "admin", label: "Админ", icon: "Settings2" },
  { key: "help", label: "Помощь", icon: "HelpCircle" },
  { key: "contacts", label: "Контакты", icon: "Mail" },
];

// ─── Navigation ───────────────────────────────────────────────────────────────

function Navigation({ current, onNav }: { current: Page; onNav: (p: Page) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header style={{ borderBottom: "1px solid hsl(var(--border))", backgroundColor: "rgba(14,12,10,0.9)", backdropFilter: "blur(12px)" }}
      className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => onNav("home")} className="flex items-center gap-3 group">
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 rotate-45 border border-gold opacity-60 group-hover:opacity-100 transition-opacity" style={{ borderColor: "var(--gold)" }} />
            <div className="absolute inset-1.5 rotate-45" style={{ backgroundColor: "var(--gold)", opacity: 0.15 }} />
            <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold" style={{ color: "var(--gold)" }}>T</span>
          </div>
          <span className="font-display text-xl font-semibold tracking-wide" style={{ color: "hsl(var(--foreground))" }}>
            Test<span style={{ color: "var(--gold)" }}>Lab</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map(item => (
            <button key={item.key} onClick={() => onNav(item.key)}
              className={`nav-link ${current === item.key ? "active" : ""}`}>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <span className="section-label">Иван С.</span>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: "var(--gold)", color: "var(--dark)" }}>
            ИС
          </div>
        </div>

        <button className="md:hidden" style={{ color: "var(--gold)" }} onClick={() => setMobileOpen(!mobileOpen)}>
          <Icon name={mobileOpen ? "X" : "Menu"} size={22} />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden animate-fade-in" style={{ backgroundColor: "var(--surface)", borderTop: "1px solid hsl(var(--border))" }}>
          {NAV_ITEMS.map(item => (
            <button key={item.key} onClick={() => { onNav(item.key); setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-6 py-3 text-left"
              style={{ color: current === item.key ? "var(--gold)" : "var(--text-dim)", borderBottom: "1px solid hsl(var(--border))" }}>
              <Icon name={item.icon} size={16} />
              <span className="font-sans text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage({ onNav }: { onNav: (p: Page) => void }) {
  const stats = [
    { value: "2 400+", label: "участников" },
    { value: "38", label: "тестов" },
    { value: "94%", label: "удовлетворённость" },
    { value: "15", label: "категорий" },
  ];

  return (
    <div className="min-h-screen pt-16">
      <section className="relative overflow-hidden grid-cross" style={{ minHeight: "90vh", display: "flex", alignItems: "center" }}>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20"
          style={{ background: "radial-gradient(ellipse at top right, var(--gold) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 opacity-10"
          style={{ background: "radial-gradient(circle, var(--teal) 0%, transparent 70%)" }} />
        <div className="absolute right-16 top-24 hidden lg:block">
          <div className="w-px h-64 opacity-20" style={{ background: "linear-gradient(to bottom, var(--gold), transparent)" }} />
        </div>
        <div className="absolute right-32 top-36 hidden lg:block">
          <div className="w-px h-48 opacity-10" style={{ background: "linear-gradient(to bottom, var(--gold), transparent)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div className="max-w-3xl">
            <p className="section-label mb-6 animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
              / платформа тестирования · 2026
            </p>
            <h1 className="font-display animate-fade-up opacity-0 delay-100 mb-6"
              style={{ fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 1.05, fontWeight: 300, animationFillMode: "forwards" }}>
              Знания,<br />
              <em style={{ color: "var(--gold)", fontStyle: "italic" }}>проверенные</em><br />
              временем
            </h1>
            <p className="animate-fade-up opacity-0 delay-200 mb-10 max-w-lg leading-relaxed"
              style={{ color: "var(--text-dim)", fontSize: "1.05rem", animationFillMode: "forwards" }}>
              Создавайте и проходите тесты с автоматической проверкой. Отслеживайте прогресс и получайте детальную аналитику по каждому ответу.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up opacity-0 delay-300" style={{ animationFillMode: "forwards" }}>
              <button onClick={() => onNav("tests")} className="btn-gold px-8 py-3 rounded text-sm animate-pulse-gold">
                Начать тестирование
              </button>
              <button onClick={() => onNav("profile")} className="btn-outline-gold px-8 py-3 rounded text-sm">
                Мой кабинет
              </button>
            </div>
          </div>
        </div>
      </section>

      <section style={{ borderTop: "1px solid hsl(var(--border))", borderBottom: "1px solid hsl(var(--border))" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="py-10 px-6 text-center"
                style={{ borderRight: i < 3 ? "1px solid hsl(var(--border))" : "none" }}>
                <div className="font-display text-4xl font-light mb-1" style={{ color: "var(--gold)" }}>{s.value}</div>
                <div className="section-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label mb-3">/ доступные тесты</p>
            <h2 className="font-display text-4xl font-light">Популярные курсы</h2>
          </div>
          <button onClick={() => onNav("tests")} className="btn-outline-gold px-6 py-2.5 rounded text-sm hidden md:block">
            Все тесты →
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTS.map((test, i) => (
            <div key={test.id} className="card-hover rounded p-6 bg-surface animate-fade-up opacity-0"
              style={{ animationFillMode: "forwards", animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-start justify-between mb-4">
                <span className="section-label">{test.category}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono"
                  style={{
                    backgroundColor: test.difficulty === "Лёгкий" ? "rgba(59,191,160,0.1)" : test.difficulty === "Сложный" ? "rgba(220,80,80,0.1)" : "rgba(212,168,71,0.1)",
                    color: test.difficulty === "Лёгкий" ? "var(--teal)" : test.difficulty === "Сложный" ? "hsl(var(--destructive))" : "var(--gold)"
                  }}>
                  {test.difficulty}
                </span>
              </div>
              <h3 className="font-display text-xl font-medium mb-2" style={{ color: "hsl(var(--foreground))" }}>{test.title}</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-dim)" }}>{test.description}</p>
              <div className="flex items-center justify-between text-xs mb-4" style={{ color: "var(--text-dim)" }}>
                <span className="font-mono">{test.questions} вопр. · {test.duration}</span>
                <span>{test.attempts} попыток</span>
              </div>
              <button onClick={() => onNav("test-active")}
                className="w-full py-2.5 rounded text-sm font-medium transition-all"
                style={{ backgroundColor: "rgba(212,168,71,0.08)", color: "var(--gold)", border: "1px solid rgba(212,168,71,0.2)" }}>
                Пройти тест
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="relative overflow-hidden rounded p-12 text-center"
          style={{ background: "linear-gradient(135deg, rgba(212,168,71,0.12), rgba(59,191,160,0.06))", border: "1px solid rgba(212,168,71,0.2)" }}>
          <div className="absolute inset-0 grid-cross opacity-30" />
          <p className="section-label mb-4 relative z-10">/ для администраторов</p>
          <h2 className="font-display text-4xl font-light mb-4 relative z-10">Создайте свой тест<br /><em style={{ color: "var(--gold)" }}>за несколько минут</em></h2>
          <p className="mb-8 relative z-10" style={{ color: "var(--text-dim)" }}>
            Конструктор тестов с неограниченным количеством вопросов и автоматической проверкой
          </p>
          <button onClick={() => onNav("admin")} className="btn-gold px-10 py-3 rounded text-sm relative z-10">
            Открыть конструктор
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

function ProfilePage() {
  const achievements = [
    { icon: "Trophy", label: "Первый тест", earned: true },
    { icon: "Flame", label: "3 дня подряд", earned: true },
    { icon: "Star", label: "Отличник", earned: true },
    { icon: "Zap", label: "Быстрый", earned: false },
    { icon: "Crown", label: "Эксперт", earned: false },
    { icon: "Award", label: "Топ-10", earned: false },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <p className="section-label mb-2">/ личный кабинет</p>
        <h1 className="font-display text-5xl font-light mb-12">Профиль</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-surface rounded p-8" style={{ border: "1px solid hsl(var(--border))" }}>
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold font-display"
                style={{ background: "linear-gradient(135deg, var(--gold), rgba(212,168,71,0.5))", color: "var(--dark)" }}>
                ИС
              </div>
              <h2 className="font-display text-2xl font-medium mb-1">Иван Смирнов</h2>
              <p className="text-sm" style={{ color: "var(--text-dim)" }}>ivan.smirnov@email.com</p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs"
                style={{ backgroundColor: "rgba(212,168,71,0.1)", color: "var(--gold)" }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--gold)" }} />
                Активен
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: "Зарегистрирован", value: "12 янв 2026" },
                { label: "Тестов пройдено", value: "12" },
                { label: "Средний балл", value: "81%" },
                { label: "Лучший результат", value: "96%" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2.5"
                  style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                  <span className="text-sm" style={{ color: "var(--text-dim)" }}>{item.label}</span>
                  <span className="text-sm font-medium font-mono" style={{ color: "hsl(var(--foreground))" }}>{item.value}</span>
                </div>
              ))}
            </div>
            <button className="btn-outline-gold w-full mt-6 py-2.5 rounded text-sm">
              Редактировать профиль
            </button>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface rounded p-6" style={{ border: "1px solid hsl(var(--border))" }}>
              <p className="section-label mb-6">/ прогресс по категориям</p>
              {[
                { label: "Маркетинг", pct: 87, color: "var(--gold)" },
                { label: "Финансы", pct: 64, color: "var(--teal)" },
                { label: "Менеджмент", pct: 91, color: "var(--gold)" },
                { label: "Психология", pct: 42, color: "rgba(212,168,71,0.5)" },
              ].map((item, i) => (
                <div key={i} className="mb-5">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm" style={{ color: "hsl(var(--foreground))" }}>{item.label}</span>
                    <span className="font-mono text-sm" style={{ color: item.color }}>{item.pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${item.pct}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-surface rounded p-6" style={{ border: "1px solid hsl(var(--border))" }}>
              <p className="section-label mb-6">/ достижения</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {achievements.map((a, i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                      style={{
                        backgroundColor: a.earned ? "rgba(212,168,71,0.15)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${a.earned ? "rgba(212,168,71,0.3)" : "hsl(var(--border))"}`,
                      }}>
                      <Icon name={a.icon} size={18} fallback="Award"
                        style={{ color: a.earned ? "var(--gold)" : "var(--text-dim)", opacity: a.earned ? 1 : 0.4 }} />
                    </div>
                    <p className="text-xs" style={{ color: a.earned ? "hsl(var(--foreground))" : "var(--text-dim)", opacity: a.earned ? 1 : 0.5 }}>
                      {a.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface rounded p-6" style={{ border: "1px solid hsl(var(--border))" }}>
              <p className="section-label mb-6">/ последняя активность</p>
              {RESULTS.map((r, i) => (
                <div key={i} className="flex items-center justify-between py-3"
                  style={{ borderBottom: i < RESULTS.length - 1 ? "1px solid hsl(var(--border))" : "none" }}>
                  <div>
                    <p className="text-sm font-medium mb-0.5" style={{ color: "hsl(var(--foreground))" }}>{r.test}</p>
                    <p className="text-xs font-mono" style={{ color: "var(--text-dim)" }}>{r.date} · {r.time}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl font-medium" style={{ color: r.score >= 80 ? "var(--gold)" : r.score >= 60 ? "var(--teal)" : "hsl(var(--destructive))" }}>
                      {r.score}%
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-dim)" }}>{r.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tests Page ───────────────────────────────────────────────────────────────

function TestsPage({ onStart }: { onStart: () => void }) {
  const [filter, setFilter] = useState("Все");
  const categories = ["Все", "Маркетинг", "Финансы", "Психология", "Менеджмент"];
  const filtered = filter === "Все" ? TESTS : TESTS.filter(t => t.category === filter);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <p className="section-label mb-2">/ каталог тестов</p>
        <div className="flex flex-wrap items-end justify-between mb-8 gap-4">
          <h1 className="font-display text-5xl font-light">Тесты</h1>
          <p style={{ color: "var(--text-dim)" }} className="text-sm">{TESTS.length} теста доступно</p>
        </div>

        <div className="flex gap-3 mb-8 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className="px-4 py-2 rounded text-sm font-medium transition-all"
              style={{
                backgroundColor: filter === cat ? "var(--gold)" : "rgba(255,255,255,0.04)",
                color: filter === cat ? "var(--dark)" : "var(--text-dim)",
                border: `1px solid ${filter === cat ? "var(--gold)" : "hsl(var(--border))"}`,
              }}>
              {cat}
            </button>
          ))}
        </div>

        <div className="relative mb-10">
          <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-dim)" }} />
          <input type="text" placeholder="Поиск по названию или теме..."
            className="w-full pl-11 pr-4 py-3 rounded text-sm outline-none"
            style={{ backgroundColor: "var(--surface2)", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontFamily: "Golos Text, sans-serif" }}
          />
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((test, i) => (
            <div key={test.id} className="card-hover rounded p-7 bg-surface animate-fade-up opacity-0"
              style={{ animationFillMode: "forwards", animationDelay: `${i * 0.08}s` }}>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <span className="section-label">{test.category}</span>
                  <h3 className="font-display text-2xl font-medium mt-1" style={{ color: "hsl(var(--foreground))" }}>{test.title}</h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-mono flex-shrink-0 ml-3"
                  style={{
                    backgroundColor: test.difficulty === "Лёгкий" ? "rgba(59,191,160,0.1)" : test.difficulty === "Сложный" ? "rgba(220,80,80,0.1)" : "rgba(212,168,71,0.1)",
                    color: test.difficulty === "Лёгкий" ? "var(--teal)" : test.difficulty === "Сложный" ? "hsl(var(--destructive))" : "var(--gold)"
                  }}>
                  {test.difficulty}
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-dim)" }}>{test.description}</p>
              <div className="flex items-center gap-4 mb-5 text-xs font-mono" style={{ color: "var(--text-dim)" }}>
                <span className="flex items-center gap-1.5"><Icon name="HelpCircle" size={12} />{test.questions} вопросов</span>
                <span className="flex items-center gap-1.5"><Icon name="Clock" size={12} />{test.duration}</span>
                <span className="flex items-center gap-1.5"><Icon name="Users" size={12} />{test.attempts}</span>
              </div>
              <button onClick={onStart} className="btn-gold w-full py-3 rounded text-sm">Начать тест</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Active Test Page ─────────────────────────────────────────────────────────

function ActiveTestPage({ onFinish }: { onFinish: () => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState<{ q: number; a: number }[]>([]);
  const [showResult, setShowResult] = useState(false);

  const q = SAMPLE_QUESTIONS[current];
  const pct = Math.round(((current + (showResult ? 1 : 0)) / SAMPLE_QUESTIONS.length) * 100);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => {
      const newAnswered = [...answered, { q: current, a: idx }];
      setAnswered(newAnswered);
      if (current < SAMPLE_QUESTIONS.length - 1) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 900);
  };

  const correctCount = answered.filter(a => SAMPLE_QUESTIONS[a.q].correct === a.a).length;
  const finalScore = Math.round((correctCount / SAMPLE_QUESTIONS.length) * 100);

  if (showResult) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center">
        <div className="max-w-2xl mx-auto px-6 w-full text-center animate-fade-in">
          <p className="section-label mb-6">/ тест завершён</p>
          <div className="w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center relative"
            style={{ background: `conic-gradient(var(--gold) ${finalScore * 3.6}deg, var(--surface2) 0deg)` }}>
            <div className="absolute inset-2 rounded-full flex flex-col items-center justify-center" style={{ backgroundColor: "var(--dark)" }}>
              <div className="font-display text-3xl font-medium" style={{ color: "var(--gold)" }}>{finalScore}%</div>
            </div>
          </div>
          <h2 className="font-display text-4xl font-light mb-3">
            {finalScore >= 80 ? "Отличный результат!" : finalScore >= 60 ? "Хороший результат" : "Есть куда расти"}
          </h2>
          <p className="mb-8" style={{ color: "var(--text-dim)" }}>
            Верных ответов: {correctCount} из {SAMPLE_QUESTIONS.length}
          </p>
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: "Верно", value: correctCount, color: "var(--teal)" },
              { label: "Ошибок", value: SAMPLE_QUESTIONS.length - correctCount, color: "hsl(var(--destructive))" },
              { label: "Время", value: "~2 мин", color: "var(--gold)" },
            ].map((s, i) => (
              <div key={i} className="bg-surface rounded p-4" style={{ border: "1px solid hsl(var(--border))" }}>
                <div className="font-display text-2xl font-medium mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="section-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={onFinish} className="btn-gold px-8 py-3 rounded text-sm">Посмотреть результаты</button>
            <button onClick={() => { setCurrent(0); setSelected(null); setAnswered([]); setShowResult(false); }}
              className="btn-outline-gold px-8 py-3 rounded text-sm">
              Пройти снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="section-label mb-1">Основы маркетинга</p>
            <p className="text-sm" style={{ color: "var(--text-dim)" }}>Вопрос {current + 1} из {SAMPLE_QUESTIONS.length}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded" style={{ backgroundColor: "var(--surface2)", border: "1px solid hsl(var(--border))" }}>
            <Icon name="Clock" size={14} style={{ color: "var(--gold)" }} />
            <span className="font-mono text-sm" style={{ color: "var(--gold)" }}>20:00</span>
          </div>
        </div>

        <div className="progress-bar mb-10">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>

        <div key={current} className="animate-fade-in">
          <h2 className="font-display text-3xl font-light leading-snug mb-10" style={{ color: "hsl(var(--foreground))" }}>
            {q.text}
          </h2>
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              let extraStyle: React.CSSProperties = {};
              if (selected !== null) {
                if (idx === q.correct) {
                  extraStyle = { borderColor: "var(--teal)", backgroundColor: "rgba(59,191,160,0.1)", color: "var(--teal)" };
                } else if (idx === selected && idx !== q.correct) {
                  extraStyle = { borderColor: "hsl(var(--destructive))", backgroundColor: "rgba(220,80,80,0.08)", color: "hsl(var(--destructive))" };
                }
              }
              return (
                <button key={idx} onClick={() => handleSelect(idx)}
                  className="answer-option w-full text-left"
                  style={selected !== null ? { ...extraStyle, cursor: "default" } : {}}>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-sm"
                      style={{ border: "1px solid currentColor", opacity: 0.6 }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2 justify-center mt-10">
          {SAMPLE_QUESTIONS.map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full transition-all"
              style={{
                backgroundColor: i <= current ? "var(--gold)" : "hsl(var(--border))",
                opacity: i === current ? 1 : i < current ? 0.5 : 0.3,
                transform: i === current ? "scale(1.4)" : "scale(1)",
              }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Results Page ─────────────────────────────────────────────────────────────

function ResultsPage() {
  const avg = Math.round(RESULTS.reduce((a, r) => a + r.score, 0) / RESULTS.length);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <p className="section-label mb-2">/ история</p>
        <h1 className="font-display text-5xl font-light mb-12">Результаты</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Средний балл", value: `${avg}%`, icon: "TrendingUp" },
            { label: "Тестов пройдено", value: "12", icon: "CheckCircle" },
            { label: "Лучший результат", value: "96%", icon: "Trophy" },
            { label: "Время обучения", value: "4.2 ч", icon: "Clock" },
          ].map((s, i) => (
            <div key={i} className="bg-surface rounded p-5 animate-fade-up opacity-0"
              style={{ border: "1px solid hsl(var(--border))", animationFillMode: "forwards", animationDelay: `${i * 0.08}s` }}>
              <Icon name={s.icon} size={20} style={{ color: "var(--gold)" }} fallback="Star" className="mb-3" />
              <div className="font-display text-3xl font-light mb-1" style={{ color: "var(--gold)" }}>{s.value}</div>
              <div className="section-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-surface rounded overflow-hidden" style={{ border: "1px solid hsl(var(--border))" }}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
            <p className="section-label">/ все попытки</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                  {["Тест", "Дата", "Время", "Результат", "Статус", ""].map((h, i) => (
                    <th key={i} className="text-left px-6 py-3 section-label font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RESULTS.map((r, i) => (
                  <tr key={i} className="transition-colors hover:bg-surface2"
                    style={{ borderBottom: i < RESULTS.length - 1 ? "1px solid hsl(var(--border))" : "none" }}>
                    <td className="px-6 py-4"><span className="font-medium text-sm" style={{ color: "hsl(var(--foreground))" }}>{r.test}</span></td>
                    <td className="px-6 py-4 font-mono text-xs" style={{ color: "var(--text-dim)" }}>{r.date}</td>
                    <td className="px-6 py-4 font-mono text-xs" style={{ color: "var(--text-dim)" }}>{r.time}</td>
                    <td className="px-6 py-4">
                      <span className="font-display text-2xl font-medium"
                        style={{ color: r.score >= 80 ? "var(--gold)" : r.score >= 60 ? "var(--teal)" : "hsl(var(--destructive))" }}>
                        {r.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-full font-mono"
                        style={{ backgroundColor: r.score >= 80 ? "rgba(212,168,71,0.1)" : "rgba(59,191,160,0.1)", color: r.score >= 80 ? "var(--gold)" : "var(--teal)" }}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-xs font-mono" style={{ color: "var(--text-dim)" }}>Детали →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────

function AdminPage() {
  const [activeTab, setActiveTab] = useState<"tests" | "users" | "create">("tests");

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <p className="section-label">/ администратор</p>
          <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ backgroundColor: "rgba(212,168,71,0.1)", color: "var(--gold)" }}>полный доступ</span>
        </div>
        <h1 className="font-display text-5xl font-light mb-10">Панель управления</h1>

        <div className="flex gap-0 mb-10" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
          {([
            { key: "tests" as const, label: "Тесты", icon: "FileQuestion" },
            { key: "users" as const, label: "Пользователи", icon: "Users" },
            { key: "create" as const, label: "Создать тест", icon: "Plus" },
          ]).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-6 py-4 text-sm relative transition-colors"
              style={{ color: activeTab === tab.key ? "var(--gold)" : "var(--text-dim)" }}>
              <Icon name={tab.icon} size={15} />
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-px" style={{ backgroundColor: "var(--gold)" }} />
              )}
            </button>
          ))}
        </div>

        {activeTab === "tests" && (
          <div className="animate-fade-in space-y-4">
            {TESTS.map((test) => (
              <div key={test.id} className="bg-surface rounded p-5 flex items-center justify-between"
                style={{ border: "1px solid hsl(var(--border))" }}>
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 flex items-center justify-center rounded"
                    style={{ backgroundColor: "rgba(212,168,71,0.1)", color: "var(--gold)" }}>
                    <Icon name="FileQuestion" size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-0.5" style={{ color: "hsl(var(--foreground))" }}>{test.title}</h3>
                    <p className="text-xs font-mono" style={{ color: "var(--text-dim)" }}>
                      {test.questions} вопросов · {test.category} · {test.attempts} попыток
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2.5 py-1 rounded-full font-mono" style={{ backgroundColor: "rgba(59,191,160,0.1)", color: "var(--teal)" }}>Активен</span>
                  <button className="btn-outline-gold px-4 py-1.5 rounded text-xs">Изменить</button>
                  <button className="text-xs px-4 py-1.5 rounded" style={{ color: "hsl(var(--destructive))", border: "1px solid rgba(220,80,80,0.2)" }}>Удалить</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "users" && (
          <div className="animate-fade-in bg-surface rounded overflow-hidden" style={{ border: "1px solid hsl(var(--border))" }}>
            {[
              { name: "Иван Смирнов", email: "ivan@email.com", tests: 12, avg: "81%", joined: "12 янв" },
              { name: "Мария Петрова", email: "maria@email.com", tests: 8, avg: "74%", joined: "3 фев" },
              { name: "Алексей Козлов", email: "alex@email.com", tests: 21, avg: "89%", joined: "28 янв" },
              { name: "Елена Новикова", email: "elena@email.com", tests: 5, avg: "66%", joined: "15 мар" },
            ].map((u, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-surface2 transition-colors"
                style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold font-display"
                    style={{ backgroundColor: "rgba(212,168,71,0.15)", color: "var(--gold)" }}>
                    {u.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{u.name}</p>
                    <p className="text-xs font-mono" style={{ color: "var(--text-dim)" }}>{u.email}</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-8 text-xs font-mono" style={{ color: "var(--text-dim)" }}>
                  <span>Тестов: <span style={{ color: "hsl(var(--foreground))" }}>{u.tests}</span></span>
                  <span>Средний: <span style={{ color: "var(--gold)" }}>{u.avg}</span></span>
                  <span>С {u.joined}</span>
                </div>
                <button className="btn-outline-gold px-3 py-1.5 rounded text-xs">Профиль</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "create" && (
          <div className="animate-fade-in max-w-2xl">
            <p className="section-label mb-6">/ конструктор тестов</p>
            <div className="space-y-5">
              {[
                { label: "Название теста", placeholder: "Например: Основы Python" },
                { label: "Описание", placeholder: "Краткое описание содержания теста" },
              ].map((f, i) => (
                <div key={i}>
                  <label className="section-label block mb-2">{f.label}</label>
                  <input type="text" placeholder={f.placeholder}
                    className="w-full px-4 py-3 rounded text-sm outline-none"
                    style={{ backgroundColor: "var(--surface2)", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontFamily: "Golos Text, sans-serif" }}
                    onFocus={e => (e.target.style.borderColor = "rgba(212,168,71,0.5)")}
                    onBlur={e => (e.target.style.borderColor = "hsl(var(--border))")}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="section-label block mb-2">Категория</label>
                  <select className="w-full px-4 py-3 rounded text-sm outline-none"
                    style={{ backgroundColor: "var(--surface2)", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontFamily: "Golos Text, sans-serif" }}>
                    {["Маркетинг", "Финансы", "Психология", "Менеджмент"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="section-label block mb-2">Сложность</label>
                  <select className="w-full px-4 py-3 rounded text-sm outline-none"
                    style={{ backgroundColor: "var(--surface2)", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontFamily: "Golos Text, sans-serif" }}>
                    {["Лёгкий", "Средний", "Сложный"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="rounded p-5" style={{ border: "1px dashed rgba(212,168,71,0.3)", backgroundColor: "rgba(212,168,71,0.03)" }}>
                <p className="section-label mb-4">+ добавить вопрос</p>
                <textarea placeholder="Введите текст вопроса..." rows={3}
                  className="w-full px-4 py-3 rounded text-sm outline-none resize-none"
                  style={{ backgroundColor: "var(--surface)", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontFamily: "Golos Text, sans-serif" }}
                />
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {["Вариант A", "Вариант B", "Вариант C", "Вариант D"].map(p => (
                    <input key={p} type="text" placeholder={p}
                      className="px-3 py-2 rounded text-sm outline-none"
                      style={{ backgroundColor: "var(--surface)", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontFamily: "Golos Text, sans-serif" }} />
                  ))}
                </div>
                <button className="btn-outline-gold w-full py-2.5 rounded text-sm mt-4">Добавить вопрос</button>
              </div>
              <button className="btn-gold w-full py-3 rounded text-sm">Сохранить тест</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Help Page ────────────────────────────────────────────────────────────────

function HelpPage() {
  const [open, setOpen] = useState<number | null>(null);
  const faq = [
    { q: "Как начать проходить тест?", a: "Перейдите в раздел «Тесты», выберите интересующую тему и нажмите «Начать тест». Тест начнётся немедленно — каждый вопрос отображается по одному." },
    { q: "Как сохраняются результаты?", a: "Результаты сохраняются автоматически после завершения теста. Вы найдёте все попытки в разделе «Результаты» с подробной статистикой." },
    { q: "Можно ли пройти тест повторно?", a: "Да, любой тест можно пройти неограниченное количество раз. Все попытки сохраняются в истории." },
    { q: "Как создать собственный тест?", a: "В разделе «Админ-панель» нажмите «Создать тест». Заполните название, описание и добавьте вопросы через конструктор." },
    { q: "Что такое достижения?", a: "Достижения — это награды за определённые действия: первый пройденный тест, серия дней активности, высокие баллы и другие успехи." },
    { q: "Как изменить данные профиля?", a: "В разделе «Личный кабинет» нажмите «Редактировать профиль». Вы можете изменить имя, email и аватар." },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <p className="section-label mb-2">/ центр поддержки</p>
        <h1 className="font-display text-5xl font-light mb-3">Помощь</h1>
        <p className="mb-12" style={{ color: "var(--text-dim)" }}>Ответы на часто задаваемые вопросы</p>
        <div className="space-y-2">
          {faq.map((item, i) => (
            <div key={i} className="bg-surface rounded overflow-hidden"
              style={{ border: `1px solid ${open === i ? "rgba(212,168,71,0.3)" : "hsl(var(--border))"}` }}>
              <button className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}>
                <span className="font-medium" style={{ color: "hsl(var(--foreground))" }}>{item.q}</span>
                <Icon name={open === i ? "ChevronUp" : "ChevronDown"} size={16} style={{ color: "var(--gold)", flexShrink: 0, marginLeft: "16px" }} />
              </button>
              {open === i && (
                <div className="px-6 pb-5 animate-fade-in">
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-12 rounded p-8 text-center"
          style={{ background: "linear-gradient(135deg, rgba(212,168,71,0.08), rgba(59,191,160,0.04))", border: "1px solid rgba(212,168,71,0.15)" }}>
          <Icon name="MessageCircle" size={28} style={{ color: "var(--gold)" }} className="mx-auto mb-4" />
          <h3 className="font-display text-2xl font-light mb-2">Не нашли ответ?</h3>
          <p className="text-sm mb-5" style={{ color: "var(--text-dim)" }}>Напишите нам — ответим в течение рабочего дня</p>
          <button className="btn-gold px-8 py-2.5 rounded text-sm">Написать в поддержку</button>
        </div>
      </div>
    </div>
  );
}

// ─── Contacts Page ────────────────────────────────────────────────────────────

function ContactsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <p className="section-label mb-2">/ свяжитесь с нами</p>
        <h1 className="font-display text-5xl font-light mb-12">Контакты</h1>
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <p className="text-lg leading-relaxed mb-10" style={{ color: "var(--text-dim)" }}>
              Есть вопросы о платформе или предложения по улучшению? Мы всегда рады обратной связи от наших пользователей.
            </p>
            <div className="space-y-6">
              {[
                { icon: "Mail", label: "Email", value: "hello@testlab.ru" },
                { icon: "Phone", label: "Телефон", value: "+7 (495) 123-45-67" },
                { icon: "MapPin", label: "Адрес", value: "Москва, ул. Тверская, 16" },
                { icon: "Clock", label: "Часы работы", value: "Пн-Пт, 9:00–18:00" },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded"
                    style={{ backgroundColor: "rgba(212,168,71,0.1)", border: "1px solid rgba(212,168,71,0.2)" }}>
                    <Icon name={c.icon} size={16} style={{ color: "var(--gold)" }} />
                  </div>
                  <div>
                    <p className="section-label mb-0.5">{c.label}</p>
                    <p style={{ color: "hsl(var(--foreground))" }}>{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-surface rounded p-8" style={{ border: "1px solid hsl(var(--border))" }}>
            <p className="section-label mb-6">/ форма обратной связи</p>
            <div className="space-y-4">
              {[
                { label: "Ваше имя", placeholder: "Иван Смирнов" },
                { label: "Email", placeholder: "ivan@email.com" },
                { label: "Тема", placeholder: "Вопрос / предложение / ошибка" },
              ].map((f, i) => (
                <div key={i}>
                  <label className="section-label block mb-2">{f.label}</label>
                  <input type="text" placeholder={f.placeholder}
                    className="w-full px-4 py-3 rounded text-sm outline-none transition-all"
                    style={{ backgroundColor: "var(--surface2)", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontFamily: "Golos Text, sans-serif" }}
                    onFocus={e => (e.target.style.borderColor = "rgba(212,168,71,0.5)")}
                    onBlur={e => (e.target.style.borderColor = "hsl(var(--border))")}
                  />
                </div>
              ))}
              <div>
                <label className="section-label block mb-2">Сообщение</label>
                <textarea rows={5} placeholder="Опишите ваш вопрос подробнее..."
                  className="w-full px-4 py-3 rounded text-sm outline-none resize-none"
                  style={{ backgroundColor: "var(--surface2)", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontFamily: "Golos Text, sans-serif" }}
                  onFocus={e => (e.target.style.borderColor = "rgba(212,168,71,0.5)")}
                  onBlur={e => (e.target.style.borderColor = "hsl(var(--border))")}
                />
              </div>
              <button className="btn-gold w-full py-3 rounded text-sm">Отправить сообщение</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ onNav }: { onNav: (p: Page) => void }) {
  return (
    <footer style={{ borderTop: "1px solid hsl(var(--border))", backgroundColor: "var(--surface)" }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 relative">
              <div className="absolute inset-0 rotate-45 border" style={{ borderColor: "var(--gold)", opacity: 0.5 }} />
              <span className="absolute inset-0 flex items-center justify-center font-mono text-xs" style={{ color: "var(--gold)" }}>T</span>
            </div>
            <span className="font-display text-lg" style={{ color: "hsl(var(--foreground))" }}>
              Test<span style={{ color: "var(--gold)" }}>Lab</span>
            </span>
          </div>
          <div className="flex gap-6">
            {NAV_ITEMS.slice(0, 5).map(item => (
              <button key={item.key} onClick={() => onNav(item.key)} className="nav-link text-xs">{item.label}</button>
            ))}
          </div>
          <p className="font-mono text-xs" style={{ color: "var(--text-dim)" }}>© 2026 TestLab</p>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ backgroundColor: "var(--dark)", minHeight: "100vh" }}>
      <Navigation current={page === "test-active" ? "tests" : page} onNav={navigate} />
      <main>
        {page === "home" && <HomePage onNav={navigate} />}
        {page === "profile" && <ProfilePage />}
        {page === "tests" && <TestsPage onStart={() => navigate("test-active")} />}
        {page === "test-active" && <ActiveTestPage onFinish={() => navigate("results")} />}
        {page === "results" && <ResultsPage />}
        {page === "admin" && <AdminPage />}
        {page === "help" && <HelpPage />}
        {page === "contacts" && <ContactsPage />}
      </main>
      {page !== "test-active" && <Footer onNav={navigate} />}
    </div>
  );
}
