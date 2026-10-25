import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Code2,
  Database,
  Flag,
  Globe2,
  GraduationCap,
  LayoutGrid,
  LogOut,
  Mail,
  Menu,
  Monitor,
  Network,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react'
import {
  login,
  signup,
  logout,
  getUser,
  onAuthChange,
  handleAuthCallback,
  requestPasswordRecovery,
  updateUser,
} from '@netlify/identity'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  courses,
  examSource,
  objectiveSource,
  videoSources,
  type Course,
  type Lang,
  type Lesson,
} from '@/lib/courses'
import {
  facts,
  questions,
  pickQuestions,
  isCorrect,
  type Question,
} from '@/lib/questions'

export const Route = createFileRoute('/')({ component: App })
type View =
  | 'courses'
  | 'course'
  | 'lesson'
  | 'practice'
  | 'exams'
  | 'progress'
  | 'resources'
type User = { id: string; email?: string; name?: string }
type Attempt = {
  id: string
  courseId: string
  questionIds: string[]
  answers: Record<string, number[]>
  deadline: string
  startedAt: string
  finishedAt: string | null
  score: number | null
}
const text = (lang: Lang, en: string, ru: string) => (lang === 'en' ? en : ru)
async function learning(data?: unknown) {
  const res = await fetch(
    '/api/learning',
    data
      ? {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      : undefined,
  )
  const result = await res.json()
  if (!res.ok) throw new Error(result.error || 'Please try again.')
  return result
}
function CourseIcon({
  course,
  large = false,
}: {
  course: Course
  large?: boolean
}) {
  if (course.id === 'python')
    return (
      <svg
        className={large ? 'course-symbol python-symbol' : 'small-symbol'}
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M32 5C17 5 18 12 18 12v8h15v3H12s-9-1-9 14 8 14 8 14h8v-10s0-9 9-9h15s8 0 8-8V13s1-8-19-8Z"
          fill="currentColor"
        />
        <circle cx="26" cy="13" r="2.4" fill="var(--symbol-bg,#f4d274)" />
        <path
          d="M32 59c15 0 14-7 14-7v-8H31v-3h21s9 1 9-14-8-14-8-14h-8v10s0 9-9 9H21s-8 0-8 8v11s-1 8 19 8Z"
          fill="currentColor"
          opacity=".58"
        />
        <circle cx="38" cy="51" r="2.4" fill="var(--symbol-bg,#f4d274)" />
      </svg>
    )
  const Icon =
    course.id === 'databases'
      ? Database
      : course.id === 'networking'
        ? Network
        : course.id === 'html5'
          ? Code2
          : Monitor
  return (
    <Icon
      className={large ? 'course-symbol' : 'small-symbol'}
      strokeWidth={1.5}
    />
  )
}
function App() {
  const [lang, setLang] = useState<Lang>('en'),
    [view, setView] = useState<View>('courses'),
    [selected, setSelected] = useState('python'),
    [lessonIndex, setLessonIndex] = useState(0)
  const [user, setUser] = useState<User | null>(null),
    [auth, setAuth] = useState(false),
    [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>(
      'login',
    )
  const [completed, setCompleted] = useState<string[]>([]),
    [history, setHistory] = useState<Attempt[]>([]),
    [notice, setNotice] = useState(''),
    [menu, setMenu] = useState(false)
  const [query, setQuery] = useState(''),
    [category, setCategory] = useState('All courses'),
    [exam, setExam] = useState<Attempt | null>(null),
    [practice, setPractice] = useState<Question[] | null>(null),
    [busy, setBusy] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(false)
  const course = courses.find((c) => c.id === selected) ?? courses[0]
  const tr = (en: string, ru: string) => text(lang, en, ru)
  const go = (next: View, id?: string) => {
    setView(next)
    if (id) setSelected(id)
    setMenu(false)
    setPractice(null)
    setNotice('')
    if (typeof window !== 'undefined') {
      const u = new URL(window.location.href)
      u.searchParams.set('view', next)
      u.searchParams.set('course', id || selected)
      window.history.replaceState(null, '', u)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const v = params.get('view')
    if (
      v &&
      [
        'courses',
        'course',
        'lesson',
        'practice',
        'exams',
        'progress',
        'resources',
      ].includes(v)
    )
      setView(v as View)
    const initialLang = params.get('lang')
    if (initialLang === 'ru') setLang('ru')
    const chapter = Number(params.get('chapter'))
    if (Number.isInteger(chapter) && chapter >= 0 && chapter < 6)
      setLessonIndex(chapter)
    const c = params.get('course')
    if (courses.some((cou) => cou.id === c)) setSelected(c!)
    let mounted = true
    getUser().then((u) => {
      if (mounted) setUser(u)
    })
    const unsubscribe = onAuthChange((_event, u) => {
      if (mounted) setUser(u)
    })
    handleAuthCallback()
      .then((result) => {
        if (result?.type === 'recovery') {
          setAuthMode('reset')
          setAuth(true)
        } else if (result?.user) {
          setUser(result.user)
          setNotice('Email confirmed. Welcome to BacIt.')
        }
      })
      .catch(() =>
        setNotice(
          'The email link has expired or is invalid. Request a new link.',
        ),
      )
    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang
    const url = new URL(window.location.href)
    url.searchParams.set('lang', lang)
    url.searchParams.set('course', selected)
    url.searchParams.set('chapter', String(lessonIndex))
    window.history.replaceState(null, '', url)
  }, [lang, selected, lessonIndex])
  useEffect(() => {
    if (!user) {
      setCompleted([])
      setHistory([])
      setExam(null)
      return
    }
    let active = true
    setLoadingProgress(true)
    learning()
      .then((data) => {
        if (active) {
          setCompleted(data.completed)
          setHistory(data.attempts)
        }
      })
      .catch((e) => {
        if (active) setNotice(e.message)
      })
      .finally(() => {
        if (active) setLoadingProgress(false)
      })
    return () => {
      active = false
    }
  }, [user?.id])
  async function refresh() {
    if (user) {
      const d = await learning()
      setCompleted(d.completed)
      setHistory(d.attempts)
    }
  }
  async function complete(lesson: Lesson) {
    if (!user) {
      setAuth(true)
      return
    }
    setBusy(true)
    try {
      await learning({ action: 'complete', lessonId: lesson.id })
      setCompleted((prev) => [...new Set([...prev, lesson.id])])
      setNotice(
        tr(
          'Lesson completed. One step closer!',
          'Урок завершён. Ещё на шаг ближе!',
        ),
      )
    } catch (e) {
      setNotice((e as Error).message)
    } finally {
      setBusy(false)
    }
  }
  async function startExam() {
    if (!user) {
      setAuth(true)
      return
    }
    setBusy(true)
    setNotice('')
    try {
      const a = await learning({ action: 'start', courseId: course.id })
      setExam(a)
    } catch (e) {
      setNotice((e as Error).message)
    } finally {
      setBusy(false)
    }
  }
  const nav = [
    {
      id: 'courses' as View,
      icon: LayoutGrid,
      en: 'Course library',
      ru: 'Библиотека курсов',
    },
    {
      id: 'practice' as View,
      icon: Zap,
      en: 'Daily practice',
      ru: 'Ежедневная практика',
    },
    {
      id: 'exams' as View,
      icon: Target,
      en: 'Exam simulator',
      ru: 'Симулятор экзамена',
    },
    {
      id: 'progress' as View,
      icon: TrendingUp,
      en: 'My progress',
      ru: 'Мой прогресс',
    },
  ]
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        {tr('Skip to content', 'К содержимому')}
      </a>
      {menu && (
        <button
          className="sidebar-overlay"
          aria-label={tr('Close navigation', 'Закрыть меню')}
          onClick={() => setMenu(false)}
        />
      )}
      <header className={`sidebar ${menu ? 'open' : ''}`}>
        <button
          className="brand"
          onClick={() => go('courses')}
          aria-label="BacIt home"
        >
          <span className="brand-mark">
            <Code2 size={23} />
          </span>
          <span>
            Bac<span className="brand-it">It</span>
            <span className="brand-dot">.</span>
          </span>
        </button>
        <nav aria-label={tr('Main navigation', 'Основная навигация')}>
          {nav.map((n) => (
            <button
              key={n.id}
              className={`nav-item ${view === n.id || (n.id === 'courses' && ['course', 'lesson'].includes(view)) ? 'active' : ''}`}
              onClick={() => go(n.id)}
            >
              <n.icon size={19} />
              <span>{lang === 'en' ? n.en : n.ru}</span>
              {n.id === 'courses' && <span className="nav-count">5</span>}
              {n.id === 'exams' && (
                <span className="tiny-new">{tr('NEW', 'НОВОЕ')}</span>
              )}
            </button>
          ))}
        </nav>
        <button
          className={`nav-item ${view === 'resources' ? 'active' : ''}`}
          onClick={() => go('resources')}
        >
          <BookOpen size={19} />
          {tr('Study resources', 'Учебные материалы')}
          <ArrowUpRight size={15} className="push-right" />
        </button>
        <div className="top-actions">
          <div className="language-toggle" aria-label="Interface language">
            <button
              className={lang === 'en' ? 'selected' : ''}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <button
              className={lang === 'ru' ? 'selected' : ''}
              onClick={() => setLang('ru')}
            >
              RU
            </button>
          </div>
          {user ? (
            <>
              <button className="account-button" onClick={() => go('progress')}>
                <span className="avatar">
                  {(user.name || user.email || 'B')[0].toUpperCase()}
                </span>
                <span>{user.name || user.email?.split('@')[0]}</span>
              </button>
              <button
                className="icon-button"
                aria-label={tr('Sign out', 'Выйти')}
                onClick={async () => {
                  try {
                    await logout()
                    setUser(null)
                    go('courses')
                  } catch {
                    setNotice(
                      tr(
                        'Sign out failed. Please retry.',
                        'Не удалось выйти. Повторите.',
                      ),
                    )
                  }
                }}
              >
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <button
              className="signin-button"
              onClick={() => {
                setAuthMode('login')
                setAuth(true)
              }}
            >
              <Mail size={16} />
              {tr('Sign in', 'Войти')}
              <ArrowUpRight size={15} />
            </button>
          )}
        </div>
        <button
          className="mobile-menu icon-button"
          onClick={() => setMenu(!menu)}
          aria-expanded={menu}
          aria-label={tr('Toggle navigation', 'Открыть или закрыть меню')}
        >
          {menu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>
      <div className="main-shell">
        <main id="main-content" className="main-content" tabIndex={-1}>
          {notice && (
            <div role="status" className="notice">
              {notice}
              <button
                className="icon-button"
                aria-label="Dismiss"
                onClick={() => setNotice('')}
              >
                <X size={16} />
              </button>
            </div>
          )}
          {view === 'courses' && (
            <>
              <div className="page-intro">
                <div>
                  <div className="eyebrow">
                    {tr(
                      'A GOOD DAY TO LEARN SOMETHING',
                      'ХОРОШИЙ ДЕНЬ ДЛЯ НОВЫХ ЗНАНИЙ',
                    )}
                  </div>
                  <h1>
                    {tr(
                      'Five exams. One place to prepare.',
                      'Пять экзаменов. Одна платформа.',
                    )}
                  </h1>
                  <p>
                    {tr(
                      'Build your IT skills, one focused lesson at a time.',
                      'Развивайте IT-навыки — один короткий урок за другим.',
                    )}
                  </p>
                </div>
                <span className="outline-pill">
                  <ShieldCheck size={15} />
                  IT Specialist · Certiport prep
                </span>
              </div>
              <section className="learning-hero">
                <div className="hero-copy">
                  <span className="hero-kicker">
                    <span />{' '}
                    {tr(
                      'LESS OVERWHELM. MORE PROGRESS.',
                      'МЕНЬШЕ ПЕРЕГРУЗКИ. БОЛЬШЕ ПРОГРЕССА.',
                    )}
                  </span>
                  <h2>
                    {tr(
                      'Learn a little every day.',
                      'Учитесь понемногу каждый день.',
                    )}
                    <br />
                    <em>
                      {tr('Build your IT skills.', 'Развивайте IT-навыки.')}
                    </em>
                  </h2>
                  <p>
                    {tr(
                      'Trade hours of video for 15–30 minute chapters. Learn, put it into practice, and walk into your exam prepared.',
                      'Вместо многочасовых видео — главы по 15–30 минут. Изучайте, практикуйтесь и уверенно готовьтесь к экзамену.',
                    )}
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => go('course', 'python')}
                  >
                    {tr('Explore your first course', 'Открыть первый курс')}
                    <ArrowRight size={17} />
                  </button>
                  <div className="hero-features">
                    <span>
                      <CheckCircle2 size={14} />
                      {tr('Free to learn', 'Бесплатное обучение')}
                    </span>
                    <span>
                      <Globe2 size={14} />
                      {tr('English + Russian support', 'Английский + русский')}
                    </span>
                  </div>
                </div>
                <div className="hero-art">
                  <div className="example-question">
                    <div className="example-topline">
                      <span>
                        {tr('Matching · Example', 'Соответствия · Пример')}
                      </span>
                      <Code2 size={19} />
                    </div>
                    <h3>
                      {tr(
                        'Match each connector to its device.',
                        'Сопоставьте разъём и устройство.',
                      )}
                    </h3>
                    <div className="example-chips">
                      <span>HDMI</span>
                      <span>USB</span>
                      <span>ETHERNET</span>
                    </div>
                    <div className="example-matches">
                      <div>
                        <span>{tr('Printer', 'Принтер')}</span>
                        <code>USB</code>
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <span>{tr('Television', 'Телевизор')}</span>
                        <code>HDMI</code>
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <span>{tr('Router', 'Маршрутизатор')}</span>
                        <code>ETHERNET</code>
                        <CheckCircle2 size={16} />
                      </div>
                    </div>
                    <button
                      className="primary-button"
                      onClick={() => go('practice', 'devices')}
                    >
                      {tr('Try a practice question', 'Попробовать задание')}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </section>
              <div className="stats-strip">
                <Stat
                  icon={BookOpen}
                  value="5"
                  label={tr('focused courses', 'курсов')}
                />
                <Stat
                  icon={Play}
                  value="30"
                  label={tr('bite-sized chapters', 'коротких глав')}
                />
                <Stat
                  icon={CircleHelp}
                  value={String(questions.length)}
                  label={tr('original questions', 'авторских заданий')}
                />
                <Stat
                  icon={Clock3}
                  value="50 min"
                  label={tr('timed exam practice', 'время симуляции')}
                />
              </div>
              <section className="catalog">
                <div className="section-heading">
                  <div>
                    <h2>
                      {tr('Find your next skill', 'Выберите следующий навык')}
                      <span className="count-pill">5</span>
                    </h2>
                    <p>
                      {tr(
                        'Pick your path. We’ll take it one chapter at a time.',
                        'Выберите направление и двигайтесь шаг за шагом.',
                      )}
                    </p>
                  </div>
                  <label className="search-field">
                    <Search size={17} />
                    <input
                      aria-label={tr('Search courses', 'Поиск курсов')}
                      placeholder={tr('Search courses...', 'Найти курс...')}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                      <button
                        aria-label="Clear search"
                        onClick={() => setQuery('')}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </label>
                </div>
                <div className="filter-row">
                  <div className="filter-tabs">
                    {['All courses', 'Development', 'Infrastructure'].map(
                      (c) => (
                        <button
                          key={c}
                          className={category === c ? 'active' : ''}
                          onClick={() => setCategory(c)}
                        >
                          {c === 'All courses'
                            ? tr('All courses', 'Все курсы')
                            : c === 'Development'
                              ? tr('Development', 'Разработка')
                              : tr('Infrastructure', 'Инфраструктура')}
                          {c === 'All courses' && <span>5</span>}
                        </button>
                      ),
                    )}
                  </div>
                  <span className="catalog-hint">
                    <span className="online-dot" />
                    {tr('Updated learning paths', 'Обновлённая программа')}
                  </span>
                </div>
                <div className="course-grid">
                  {courses
                    .filter(
                      (c) =>
                        (category === 'All courses' ||
                          c.category === category) &&
                        `${c.title.en} ${c.title.ru} ${c.description[lang]}`
                          .toLowerCase()
                          .includes(query.toLowerCase()),
                    )
                    .map((c) => (
                      <CourseCard
                        key={c.id}
                        course={c}
                        lang={lang}
                        completed={completed}
                        onOpen={() => go('course', c.id)}
                      />
                    ))}
                  {courses.filter(
                    (c) =>
                      (category === 'All courses' || c.category === category) &&
                      `${c.title.en} ${c.title.ru} ${c.description[lang]}`
                        .toLowerCase()
                        .includes(query.toLowerCase()),
                  ).length === 0 && (
                    <div className="empty-state">
                      <Search />
                      <h3>{tr('No courses found', 'Курсы не найдены')}</h3>
                      <p>
                        {tr(
                          'Try another skill or clear your filters.',
                          'Попробуйте другой запрос или сбросьте фильтры.',
                        )}
                      </p>
                      <button
                        className="secondary-button"
                        onClick={() => {
                          setQuery('')
                          setCategory('All courses')
                        }}
                      >
                        {tr('Reset filters', 'Сбросить фильтры')}
                      </button>
                    </div>
                  )}
                  <div className="exam-promo">
                    <span className="promo-icon">
                      <Target size={25} />
                    </span>
                    <span className="eyebrow">
                      {tr(
                        'PUT YOUR SKILLS TO THE TEST',
                        'ПРОВЕРЬТЕ СВОИ ЗНАНИЯ',
                      )}
                    </span>
                    <h3>
                      {tr(
                        'Practice with a little pressure.',
                        'Практика в условиях экзамена.',
                      )}
                    </h3>
                    <p>
                      {tr(
                        'A real timer. Mixed question formats. A clear picture of what to work on next.',
                        'Таймер, разные типы заданий и понятный разбор ошибок.',
                      )}
                    </p>
                    <button onClick={() => go('exams')}>
                      {tr('Try the exam simulator', 'Открыть симулятор')}
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </div>
              </section>
              <section
                className="learning-steps"
                aria-labelledby="learning-steps-title"
              >
                <h2 id="learning-steps-title">
                  {tr('How it works', 'Как это работает')}
                </h2>
                <ol>
                  {[
                    {
                      icon: Play,
                      title: tr(
                        'Watch a short lesson',
                        'Посмотрите короткий урок',
                      ),
                      body: tr(
                        '15–30 minutes of English video with independent English and Russian notes.',
                        '15–30 минут видео на английском и самостоятельные конспекты на английском и русском.',
                      ),
                    },
                    {
                      icon: CircleHelp,
                      title: tr(
                        'Check your understanding',
                        'Проверьте понимание',
                      ),
                      body: tr(
                        'Practice each topic with explanations for every answer.',
                        'Закрепляйте темы с объяснением каждого ответа.',
                      ),
                    },
                    {
                      icon: TrendingUp,
                      title: tr('Build your progress', 'Следите за прогрессом'),
                      body: tr(
                        'Sign in to save completed lessons and exam attempts to your account.',
                        'Войдите, чтобы сохранять пройденные уроки и попытки экзаменов в аккаунте.',
                      ),
                    },
                    {
                      icon: Clock3,
                      title: tr(
                        'Try a timed exam',
                        'Пройдите экзамен на время',
                      ),
                      body: tr(
                        'Independent 50-minute practice with review flags and a detailed result review.',
                        'Независимая 50-минутная симуляция с отметками для проверки и подробным разбором.',
                      ),
                    },
                  ].map((step, i) => (
                    <li key={i}>
                      <div>
                        <step.icon size={25} />
                        <span>0{i + 1}</span>
                      </div>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                    </li>
                  ))}
                </ol>
              </section>
              <section className="daily-practice-banner">
                <div>
                  <h2>
                    {tr(
                      'Your next step: a little practice.',
                      'Следующий шаг — немного практики.',
                    )}
                  </h2>
                  <p>
                    {tr(
                      'Choose a course and turn today’s lesson into knowledge you can use.',
                      'Выберите курс и закрепите знания из сегодняшнего урока.',
                    )}
                  </p>
                </div>
                <button
                  className="secondary-button"
                  onClick={() => go('practice')}
                >
                  {tr('Start practicing', 'Начать практику')}
                  <ArrowRight size={17} />
                </button>
              </section>
              <div className="bottom-note">
                <ShieldCheck size={16} />
                <span>
                  {tr(
                    'Independent preparation, built around the published IT Specialist objectives.',
                    'Независимая подготовка по опубликованным требованиям IT Specialist.',
                  )}
                </span>
                <a href={objectiveSource} target="_blank" rel="noreferrer">
                  {tr('View objectives', 'Требования')}
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </>
          )}
          {view === 'course' && (
            <>
              <button className="back-link" onClick={() => go('courses')}>
                <ChevronLeft size={16} />
                {tr('All courses', 'Все курсы')}
              </button>
              <div className={`course-detail-banner ${course.color}`}>
                <CourseIcon course={course} large />
                <div>
                  <div className="eyebrow">IT SPECIALIST LEARNING PATH</div>
                  <h1>{course.title[lang]}</h1>
                  <p>{course.description[lang]}</p>
                  <div className="detail-meta">
                    <span>
                      <Play size={15} />6{' '}
                      {tr('focused chapters', 'коротких глав')}
                    </span>
                    <span>
                      <CircleHelp size={15} />
                      60 {tr('questions', 'заданий')}
                    </span>
                    <span>
                      <Globe2 size={15} />
                      EN + RU
                    </span>
                  </div>
                </div>
              </div>
              <div className="detail-columns">
                <section>
                  <div className="section-heading">
                    <div>
                      <h2>{tr('Your learning path', 'Ваша программа')}</h2>
                      <p>
                        {tr(
                          'Watch a short English chapter. Use the Russian companion alongside it.',
                          'Смотрите короткую главу на английском с русским конспектом рядом.',
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="lesson-list">
                    {course.lessons.map((l, i) => (
                      <button
                        className="lesson-row"
                        key={l.id}
                        onClick={() => {
                          setLessonIndex(i)
                          go('lesson')
                        }}
                      >
                        <span
                          className={`lesson-number ${completed.includes(l.id) ? 'done' : ''}`}
                        >
                          {completed.includes(l.id) ? (
                            <Check size={18} />
                          ) : (
                            String(i + 1).padStart(2, '0')
                          )}
                        </span>
                        <div>
                          <strong>{l.title[lang]}</strong>
                          <small>
                            {tr(
                              'Video chapter + bilingual notes + practice',
                              'Видеоглава + конспект на двух языках + практика',
                            )}
                          </small>
                        </div>
                        <span className="lesson-duration">
                          <Clock3 size={14} />
                          {Math.round((l.end - l.start) / 60)} min
                        </span>
                        <Play size={16} />
                      </button>
                    ))}
                  </div>
                </section>
                <aside className="detail-aside">
                  <Target size={28} />
                  <h3>
                    {tr(
                      'Make exam day familiar.',
                      'Привыкните к формату экзамена.',
                    )}
                  </h3>
                  <p>
                    {tr(
                      `${course.range} questions in the official range. Our simulator uses ${course.examCount} questions and 50 minutes.`,
                      `Официальный диапазон: ${course.range} заданий. В симуляции — ${course.examCount} заданий и 50 минут.`,
                    )}
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => go('exams')}
                  >
                    {tr('Practice an exam', 'Пройти симуляцию')}
                    <ArrowRight size={16} />
                  </button>
                  <a
                    href={`https://certiport.pearsonvue.com/fc/ITS/${course.objective}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {tr('Official objective domains', 'Официальные требования')}
                    <ArrowUpRight size={14} />
                  </a>
                </aside>
              </div>
            </>
          )}
          {view === 'lesson' && (
            <>
              <button className="back-link" onClick={() => go('course')}>
                <ChevronLeft size={16} />
                {course.title[lang]}
              </button>
              <LessonView
                course={course}
                index={lessonIndex}
                lang={lang}
                completed={completed}
                busy={busy}
                onComplete={complete}
                onNext={() => setLessonIndex((i) => Math.min(i + 1, 5))}
                onSelect={setLessonIndex}
                onPractice={() => {
                  setPractice(
                    pickQuestions(course.id, 60)
                      .filter((q) => q.module === lessonIndex)
                      .slice(0, 6),
                  )
                  setView('practice')
                }}
              />
            </>
          )}
          {view === 'practice' && (
            <>
              <PageTitle
                eyebrow={tr('MAKE IT STICK', 'ЗАКРЕПЛЯЙТЕ ЗНАНИЯ')}
                title={tr(
                  'A little practice goes a long way.',
                  'Немного практики каждый день.',
                )}
                description={tr(
                  'Original questions. Immediate explanations. No timer, no pressure.',
                  'Авторские вопросы и объяснения сразу после ответа. Без таймера.',
                )}
              />
              {practice ? (
                <Quiz
                  key={practice.map((q) => q.id).join(',')}
                  items={practice}
                  lang={lang}
                  onExit={() => setPractice(null)}
                />
              ) : (
                <>
                  <CoursePicker
                    selected={selected}
                    onSelect={setSelected}
                    lang={lang}
                  />
                  <div className="practice-start">
                    <div className={`practice-art ${course.color}`}>
                      <CourseIcon course={course} large />
                    </div>
                    <div>
                      <span className="eyebrow">
                        {tr(
                          'YOUR NEXT 10 QUESTIONS',
                          'ВАШИ СЛЕДУЮЩИЕ 10 ВОПРОСОВ',
                        )}
                      </span>
                      <h2>{course.title[lang]}</h2>
                      <p>
                        {tr(
                          'A mix of single answer, multiple answer and matching exercises across all six topics.',
                          'Выбор одного или нескольких ответов и сопоставление по всем шести темам.',
                        )}
                      </p>
                      <button
                        className="primary-button"
                        onClick={() =>
                          setPractice(pickQuestions(course.id, 10))
                        }
                      >
                        {tr('Start practicing', 'Начать практику')}
                        <ArrowRight size={17} />
                      </button>
                      <small>
                        {tr(
                          '60 original exercises in this course · English and Russian',
                          '60 авторских заданий в курсе · английский и русский',
                        )}
                      </small>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          {view === 'exams' && (
            <>
              <PageTitle
                eyebrow={tr('YOUR DRESS REHEARSAL', 'РЕПЕТИЦИЯ ЭКЗАМЕНА')}
                title={tr(
                  'Get comfortable with exam day.',
                  'Подготовьтесь к дню экзамена.',
                )}
                description={tr(
                  'Practice the timing and question styles before it counts.',
                  'Заранее познакомьтесь со временем и форматами заданий.',
                )}
              />
              {exam ? (
                <ExamView
                  key={exam.id}
                  attempt={exam}
                  lang={lang}
                  onDone={async () => {
                    setExam(null)
                    try {
                      await refresh()
                    } catch {
                      setNotice(
                        'Could not refresh your results. Please reload.',
                      )
                    }
                  }}
                />
              ) : (
                <>
                  <CoursePicker
                    selected={selected}
                    onSelect={setSelected}
                    lang={lang}
                  />
                  <div className="exam-setup">
                    <div>
                      <span className="exam-setup-icon">
                        <Target size={34} />
                      </span>
                      <h2>{course.title[lang]}</h2>
                      <p>
                        IT Specialist ·{' '}
                        {tr(
                          'Independent practice simulation',
                          'Независимая учебная симуляция',
                        )}
                      </p>
                      <div className="exam-facts">
                        <div>
                          <strong>50</strong>
                          <span>{tr('minutes', 'минут')}</span>
                        </div>
                        <div>
                          <strong>{course.examCount}</strong>
                          <span>{tr('questions', 'заданий')}</span>
                        </div>
                        <div>
                          <strong>3</strong>
                          <span>{tr('question formats', 'формата')}</span>
                        </div>
                      </div>
                      <button
                        className="primary-button"
                        disabled={busy}
                        onClick={startExam}
                      >
                        {busy
                          ? tr('Preparing exam…', 'Подготовка…')
                          : user
                            ? tr('Start / resume exam', 'Начать / продолжить')
                            : tr('Sign in to start', 'Войдите, чтобы начать')}
                        <ArrowRight size={17} />
                      </button>
                    </div>
                    <div className="exam-instructions">
                      <h3>{tr('Before you begin', 'Перед началом')}</h3>
                      {[
                        tr(
                          'The timer continues if you close the page.',
                          'Таймер продолжает идти после закрытия страницы.',
                        ),
                        tr(
                          'Move freely between questions and mark items for review.',
                          'Переходите между вопросами и отмечайте их для проверки.',
                        ),
                        tr(
                          'Answers are saved to your account as you go.',
                          'Ответы сохраняются в вашей учётной записи.',
                        ),
                        tr(
                          'Explanations appear only after you submit.',
                          'Объяснения доступны только после завершения.',
                        ),
                      ].map((t) => (
                        <p key={t}>
                          <CheckCircle2 size={17} />
                          {t}
                        </p>
                      ))}
                      <div className="exam-disclaimer">
                        {tr(
                          `Official range: ${course.range} questions, 50 minutes. This is an original practice test, not a copy of the Certiport exam. The practice goal is 70% correct; it is not a conversion to Certiport’s scaled score. Python covers selective-response preparation, not the Next Generation performance environment.`,
                          `Официальный диапазон: ${course.range} заданий, 50 минут. Это авторский учебный тест, а не копия Certiport. Учебная цель — 70% правильных ответов; это не перевод в шкалу Certiport. Python готовит к вопросам с выбором ответа, не воспроизводит среду Next Generation.`,
                        )}
                      </div>
                      <a href={examSource} target="_blank" rel="noreferrer">
                        {tr(
                          'Check official exam lengths',
                          'Официальная длительность экзаменов',
                        )}
                        <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          {view === 'progress' && (
            <>
              <PageTitle
                eyebrow={tr('EVERY STEP COUNTS', 'КАЖДЫЙ ШАГ ВАЖЕН')}
                title={tr(
                  'Your progress, in one place.',
                  'Весь ваш прогресс в одном месте.',
                )}
                description={tr(
                  'Completed chapters and saved exam attempts follow your account.',
                  'Завершённые главы и результаты сохраняются в учётной записи.',
                )}
              />
              {!user ? (
                <div className="empty-state">
                  <GraduationCap size={38} />
                  <h2>
                    {tr(
                      'Give your progress a home.',
                      'Сохраняйте свои достижения.',
                    )}
                  </h2>
                  <p>
                    {tr(
                      'Sign in with your email to keep your learning across devices.',
                      'Войдите по почте, чтобы продолжать обучение на любом устройстве.',
                    )}
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => setAuth(true)}
                  >
                    {tr('Sign in with email', 'Войти по почте')}
                    <Mail size={17} />
                  </button>
                </div>
              ) : loadingProgress ? (
                <div
                  className="progress-skeleton"
                  role="status"
                  aria-label={tr('Loading progress', 'Загрузка прогресса')}
                >
                  <div />
                  <div />
                  <div />
                </div>
              ) : (
                <>
                  <div className="progress-summary">
                    <Stat
                      icon={CheckCircle2}
                      value={String(completed.length)}
                      label={tr('chapters completed', 'глав завершено')}
                    />
                    <Stat
                      icon={Target}
                      value={String(history.filter((a) => a.finishedAt).length)}
                      label={tr('exams completed', 'симуляций завершено')}
                    />
                    <Stat
                      icon={TrendingUp}
                      value={`${Math.round((completed.length / 30) * 100)}%`}
                      label={tr('of your learning journey', 'всей программы')}
                    />
                  </div>
                  <div className="progress-paths">
                    {courses.map((c) => (
                      <button key={c.id} onClick={() => go('course', c.id)}>
                        <span className={`progress-icon ${c.color}`}>
                          <CourseIcon course={c} />
                        </span>
                        <strong>{c.title[lang]}</strong>
                        <span>
                          {
                            c.lessons.filter((l) => completed.includes(l.id))
                              .length
                          }
                          /6
                        </span>
                        <ChevronRight size={18} />
                      </button>
                    ))}
                  </div>
                  <h2 className="history-title">
                    {tr('Exam history', 'История симуляций')}
                  </h2>
                  {history.length === 0 ? (
                    <p className="muted">
                      {tr(
                        'Your first exam result is waiting to happen.',
                        'Здесь появится результат первой симуляции.',
                      )}
                    </p>
                  ) : (
                    <div className="history-list">
                      {history.map((a) => (
                        <div key={a.id}>
                          <Target size={18} />
                          <strong>
                            {
                              courses.find((c) => c.id === a.courseId)?.title[
                                lang
                              ]
                            }
                          </strong>
                          <span>
                            {new Date(a.startedAt).toLocaleDateString(
                              lang === 'ru' ? 'ru-RU' : 'en-GB',
                            )}
                          </span>
                          {a.finishedAt ? (
                            <button
                              onClick={() => {
                                setSelected(a.courseId)
                                setExam(a)
                                go('exams', a.courseId)
                              }}
                              title={tr(
                                'Review this attempt',
                                'Разобрать эту попытку',
                              )}
                              className={
                                (a.score ?? 0) >= 70
                                  ? 'score-good'
                                  : 'score-low'
                              }
                            >
                              {a.score}% <ArrowUpRight size={11} />
                            </button>
                          ) : (
                            <button
                              className="secondary-button"
                              onClick={() => {
                                setSelected(a.courseId)
                                setExam(a)
                                go('exams', a.courseId)
                              }}
                            >
                              {tr('Resume', 'Продолжить')}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
          {view === 'resources' && (
            <>
              <PageTitle
                eyebrow={tr('GO A LITTLE DEEPER', 'ПОГРУЗИТЕСЬ ГЛУБЖЕ')}
                title={tr(
                  'Good references. Clearer understanding.',
                  'Надёжные источники. Больше понимания.',
                )}
                description={tr(
                  'Official objectives, documentation and a bilingual concept glossary.',
                  'Официальные требования, документация и двуязычный глоссарий.',
                )}
              />
              <div className="resource-links">
                <a href={objectiveSource} target="_blank" rel="noreferrer">
                  <GraduationCap />
                  <div>
                    <strong>
                      {tr(
                        'Certiport objective domains',
                        'Требования Certiport',
                      )}
                    </strong>
                    <p>
                      {tr(
                        'Check the published skills for your certification.',
                        'Проверьте перечень навыков для вашей сертификации.',
                      )}
                    </p>
                  </div>
                  <ArrowUpRight />
                </a>
                <a href={examSource} target="_blank" rel="noreferrer">
                  <Clock3 />
                  <div>
                    <strong>
                      {tr(
                        'Exam lengths & question ranges',
                        'Время и количество заданий',
                      )}
                    </strong>
                    <p>
                      {tr(
                        'Official exam information, reviewed 25 October 2026.',
                        'Официальная информация, проверено 25 октября 2026.',
                      )}
                    </p>
                  </div>
                  <ArrowUpRight />
                </a>
              </div>
              <CoursePicker
                selected={selected}
                onSelect={setSelected}
                lang={lang}
              />
              <div className="glossary">
                {facts[course.id].map((f) => (
                  <div key={f.term}>
                    <code>{f.term}</code>
                    <p>{f.meaning[lang]}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          <footer className="page-footer">
            <span>
              BacIt<span className="brand-dot">.</span>{' '}
              <span>
                {tr(
                  'A little progress, every day.',
                  'Немного прогресса каждый день.',
                )}
              </span>
            </span>
            <span>
              {tr(
                'Independent learning · Not affiliated with Certiport or Pearson',
                'Независимый проект · Не связан с Certiport или Pearson',
              )}
            </span>
          </footer>
        </main>
      </div>
      <AuthDialog
        open={auth}
        onOpenChange={setAuth}
        mode={authMode}
        setMode={setAuthMode}
        lang={lang}
        onUser={(u) => {
          setUser(u)
          setAuth(false)
        }}
      />
    </div>
  )
}
function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof BookOpen
  value: string
  label: string
}) {
  return (
    <div className="stat">
      <span className="stat-icon">
        <Icon size={20} strokeWidth={1.6} />
      </span>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}
function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="page-intro standalone">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  )
}
function CourseCard({
  course: c,
  lang,
  completed,
  onOpen,
}: {
  course: Course
  lang: Lang
  completed: string[]
  onOpen: () => void
}) {
  const count = c.lessons.filter((l) => completed.includes(l.id)).length
  return (
    <button className={`course-card course-${c.id}`} onClick={onOpen}>
      <div className="course-card-content">
        <div className="course-card-heading">
          <span className={`course-icon-tile ${c.color}`}>
            <CourseIcon course={c} />
          </span>
          <div>
            <h3>{c.title[lang]}</h3>
            <span className="course-tag">IT SPECIALIST</span>
          </div>
        </div>
        <p>{c.description[lang]}</p>
        <div className="card-meta">
          <span>
            <BookOpen size={13} />6 {text(lang, 'chapters', 'глав')}
          </span>
          <span>
            <Globe2 size={13} />
            EN / RU
          </span>
          <span>
            <CircleHelp size={13} />
            60
          </span>
        </div>
        <div className="course-completion">
          <span>{text(lang, 'Lessons completed', 'Уроков завершено')}</span>
          <strong>
            {count}/{c.lessons.length}
          </strong>
        </div>
        <div className="course-progress-track">
          <span style={{ width: `${(count / c.lessons.length) * 100}%` }} />
        </div>
        <span className="course-open">
          {text(lang, 'Open course', 'Открыть курс')}
          <ArrowRight size={16} />
        </span>
      </div>
    </button>
  )
}
function CoursePicker({
  selected,
  onSelect,
  lang,
}: {
  selected: string
  onSelect: (id: string) => void
  lang: Lang
}) {
  return (
    <div className="course-picker" aria-label="Choose course">
      {courses.map((c) => (
        <button
          key={c.id}
          className={c.id === selected ? 'selected' : ''}
          onClick={() => onSelect(c.id)}
        >
          <CourseIcon course={c} />
          {c.title[lang]}
        </button>
      ))}
    </div>
  )
}
function LessonView({
  course,
  index,
  lang,
  completed,
  busy,
  onComplete,
  onNext,
  onSelect,
  onPractice,
}: {
  course: Course
  index: number
  lang: Lang
  completed: string[]
  busy: boolean
  onComplete: (l: Lesson) => void
  onNext: () => void
  onSelect: (n: number) => void
  onPractice: () => void
}) {
  const l = course.lessons[index],
    [notesLang, setNotesLang] = useState<Lang>('ru'),
    [tab, setTab] = useState<'notes' | 'practice'>('notes')
  return (
    <>
      <div className="lesson-title">
        <div className="eyebrow">
          {text(lang, `CHAPTER ${index + 1} OF 6`, `ГЛАВА ${index + 1} ИЗ 6`)}
        </div>
        <h1>{l.title[lang]}</h1>
      </div>
      <div className="lesson-workspace">
        <section className="video-panel">
          <div className="panel-heading">
            <span>
              <Play size={16} />
              {text(lang, 'English video', 'Видео на английском')}
            </span>
            <span>{Math.round((l.end - l.start) / 60)} min · EN</span>
          </div>
          <div className="video-container">
            <iframe
              key={l.id}
              src={`https://www.youtube-nocookie.com/embed/${l.video}?start=${l.start}&end=${l.end}&rel=0&cc_load_policy=1&cc_lang_pref=en`}
              title={`${l.title.en} — English chapter`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <div className="video-source">
            <strong>{videoSources[l.video]?.author} · YouTube</strong>
            <p>{videoSources[l.video]?.title}</p>
            <p>
              {text(
                lang,
                'A short public lesson or time-bounded course chapter, embedded with the original player. Source videos are not edited. Some videos cover a subset of the topic; use the companion notes and documentation for the full lesson. Captions depend on the publisher.',
                'Короткий публичный урок или ограниченная по времени глава во встроенном плеере. Исходные видео не изменены. Некоторые видео раскрывают часть темы; конспект и документация дополняют урок. Субтитры зависят от автора.',
              )}
            </p>
            <a
              href={`https://www.youtube.com/watch?v=${l.video}&t=${l.start}s`}
              target="_blank"
              rel="noreferrer"
            >
              {text(lang, 'Open original video', 'Открыть оригинал')}
              <ArrowUpRight size={13} />
            </a>
          </div>
          <div className="lesson-actions">
            <button
              className="primary-button"
              disabled={busy || completed.includes(l.id)}
              onClick={() => onComplete(l)}
            >
              <CheckCircle2 size={17} />
              {completed.includes(l.id)
                ? text(lang, 'Completed', 'Завершён')
                : busy
                  ? text(lang, 'Saving…', 'Сохранение…')
                  : text(lang, 'Mark as complete', 'Отметить завершённым')}
            </button>
            {index < 5 && (
              <button className="secondary-button" onClick={onNext}>
                {text(lang, 'Next chapter', 'Следующая глава')}
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </section>
        <section className="companion-panel">
          <div className="panel-heading">
            <span>
              <BookOpen size={16} />
              {text(lang, 'Your study companion', 'Ваш учебный конспект')}
            </span>
            <div className="language-toggle">
              <button
                className={notesLang === 'en' ? 'selected' : ''}
                onClick={() => setNotesLang('en')}
              >
                EN
              </button>
              <button
                className={notesLang === 'ru' ? 'selected' : ''}
                onClick={() => setNotesLang('ru')}
              >
                RU
              </button>
            </div>
          </div>
          <div className="companion-tabs">
            <button
              className={tab === 'notes' ? 'active' : ''}
              onClick={() => setTab('notes')}
            >
              {text(lang, 'Topic notes', 'Конспект')}
            </button>
            <button
              className={tab === 'practice' ? 'active' : ''}
              onClick={() => setTab('practice')}
            >
              {text(lang, 'Key concepts', 'Ключевые понятия')}
            </button>
          </div>
          <div className="companion-content">
            <span className="eyebrow">
              {notesLang === 'ru'
                ? 'ОБЪЯСНЕНИЕ НА РУССКОМ'
                : 'ENGLISH EXPLANATION'}
            </span>
            <h2>{l.title[notesLang]}</h2>
            {tab === 'notes' ? (
              <>
                {l.notes[notesLang].split(/(?<=\.)\s+/).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                <div className="study-tip">
                  <Sparkles size={18} />
                  <p>
                    {notesLang === 'ru'
                      ? 'Остановите видео и объясните тему своими словами. Затем проверьте понимание в практике. Это самостоятельный конспект, а не дословный перевод видео.'
                      : 'Pause the video and explain the topic in your own words. Then test your understanding with practice. These are independent notes, not a word-for-word video translation.'}
                  </p>
                </div>
              </>
            ) : (
              facts[course.id]
                .filter((f) => f.module === index)
                .map((f) => (
                  <div className="concept-note" key={f.term}>
                    <code>{f.term}</code>
                    <p>{f.meaning[notesLang]}</p>
                  </div>
                ))
            )}
            <a
              className="reading-link"
              href={l.resource}
              target="_blank"
              rel="noreferrer"
            >
              {text(lang, 'Read the documentation', 'Открыть документацию')}
              <ArrowUpRight size={14} />
            </a>
            <button className="secondary-button" onClick={onPractice}>
              {text(lang, 'Practice this topic', 'Практика по теме')}
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>
      <div className="chapter-switcher">
        {course.lessons.map((x, i) => (
          <button
            key={x.id}
            className={index === i ? 'active' : ''}
            onClick={() => onSelect(i)}
          >
            <span>{i + 1}</span>
            {x.title[lang]}
          </button>
        ))}
      </div>
    </>
  )
}
function AuthDialog({
  open,
  onOpenChange,
  mode,
  setMode,
  lang,
  onUser,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  mode: 'login' | 'signup' | 'forgot' | 'reset'
  setMode: (m: 'login' | 'signup' | 'forgot' | 'reset') => void
  lang: Lang
  onUser: (u: User) => void
}) {
  const [pending, setPending] = useState(false),
    [message, setMessage] = useState(''),
    [error, setError] = useState('')
  const tr = (en: string, ru: string) => text(lang, en, ru)
  const title =
    mode === 'login'
      ? tr('Welcome back.', 'С возвращением.')
      : mode === 'signup'
        ? tr('Your next chapter awaits.', 'Ваш новый этап ждёт.')
        : mode === 'forgot'
          ? tr('Let’s get you back in.', 'Восстановим доступ.')
          : tr('Choose a new password.', 'Задайте новый пароль.')
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (pending) return
    const d = new FormData(e.currentTarget),
      email = String(d.get('email') || ''),
      password = String(d.get('password') || '')
    setPending(true)
    setMessage('')
    setError('')
    try {
      if (mode === 'login') onUser(await login(email, password))
      else if (mode === 'signup') {
        const u = await signup(email, password, {
          full_name: String(d.get('name') || ''),
        })
        if (u.confirmedAt) onUser(u)
        else
          setMessage(
            tr(
              'Check your inbox and confirm your email before signing in.',
              'Откройте письмо и подтвердите адрес перед входом.',
            ),
          )
      } else if (mode === 'forgot') {
        await requestPasswordRecovery(email)
        setMessage(
          tr(
            'If an account exists, a password reset link is on its way.',
            'Если учётная запись существует, ссылка для сброса отправлена.',
          ),
        )
      } else {
        const u = await updateUser({ password })
        onUser(u)
      }
    } catch {
      setError(
        tr(
          'Could not complete this request. Check your details, confirm your email, or try again.',
          'Не удалось выполнить запрос. Проверьте данные, подтвердите почту или повторите попытку.',
        ),
      )
    } finally {
      setPending(false)
    }
  }
  function change(m: typeof mode) {
    setMode(m)
    setError('')
    setMessage('')
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="auth-dialog">
        <span className="auth-mark">
          <GraduationCap size={27} />
        </span>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {tr(
            'One email. A home for all your learning.',
            'Один email — всё обучение в одном месте.',
          )}
        </DialogDescription>
        {(mode === 'login' || mode === 'signup') && (
          <div className="auth-tabs">
            <button
              className={mode === 'login' ? 'active' : ''}
              onClick={() => change('login')}
            >
              {tr('Sign in', 'Вход')}
            </button>
            <button
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => change('signup')}
            >
              {tr('Create account', 'Регистрация')}
            </button>
          </div>
        )}
        <form onSubmit={submit}>
          <fieldset disabled={pending}>
            {mode === 'signup' && (
              <label>
                {tr('Your name', 'Ваше имя')}
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                />
              </label>
            )}
            {mode !== 'reset' && (
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </label>
            )}
            {mode !== 'forgot' && (
              <label>
                {tr('Password', 'Пароль')}
                <input
                  name="password"
                  type="password"
                  autoComplete={
                    mode === 'login' ? 'current-password' : 'new-password'
                  }
                  minLength={8}
                  required
                />
                {mode !== 'login' && (
                  <small>
                    {tr('At least 8 characters', 'Минимум 8 символов')}
                  </small>
                )}
              </label>
            )}
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            {message && (
              <p role="status" className="form-success">
                {message}
              </p>
            )}
            <button type="submit" className="primary-button">
              {pending
                ? tr('Please wait…', 'Подождите…')
                : mode === 'login'
                  ? tr('Sign in', 'Войти')
                  : mode === 'signup'
                    ? tr('Create account', 'Создать аккаунт')
                    : mode === 'forgot'
                      ? tr('Send recovery link', 'Отправить ссылку')
                      : tr('Update password', 'Обновить пароль')}
              <ArrowRight size={17} />
            </button>
          </fieldset>
        </form>
        {mode === 'login' ? (
          <button className="text-button" onClick={() => change('forgot')}>
            {tr('Forgot your password?', 'Забыли пароль?')}
          </button>
        ) : (
          mode === 'forgot' && (
            <button className="text-button" onClick={() => change('login')}>
              {tr('Back to sign in', 'Вернуться ко входу')}
            </button>
          )
        )}
        <p className="auth-footer">
          <ShieldCheck size={13} />
          {tr(
            'Your progress is private to your account.',
            'Ваш прогресс доступен только вам.',
          )}
        </p>
      </DialogContent>
    </Dialog>
  )
}
function AnswerFields({
  q,
  answer,
  onChange,
  lang,
  disabled = false,
}: {
  q: Question
  answer: number[]
  onChange: (a: number[]) => void
  lang: Lang
  disabled?: boolean
}) {
  if (q.type === 'matching')
    return (
      <div className="matching-fields">
        {q.labels?.map((label, i) => (
          <label key={label}>
            <code>{label}</code>
            <select
              disabled={disabled}
              aria-label={`${text(lang, 'Description for', 'Описание для')} ${label}`}
              value={answer[i] ?? -1}
              onChange={(e) => {
                const next = Array.from(
                  { length: q.labels!.length },
                  (_, n) => answer[n] ?? -1,
                )
                next[i] = Number(e.target.value)
                onChange(next)
              }}
            >
              <option value={-1}>
                {text(lang, 'Choose a description…', 'Выберите описание…')}
              </option>
              {q.options.map((o, j) => (
                <option key={j} value={j}>
                  {o[lang]}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    )
  return (
    <div className="answer-options">
      {q.options.map((o, i) => (
        <label
          key={i}
          className={`answer-option ${answer.includes(i) ? 'selected' : ''} ${disabled ? 'locked' : ''}`}
        >
          <input
            disabled={disabled}
            type={q.type === 'single' ? 'radio' : 'checkbox'}
            name={q.id}
            checked={answer.includes(i)}
            onChange={() =>
              onChange(
                q.type === 'single'
                  ? [i]
                  : answer.includes(i)
                    ? answer.filter((n) => n !== i)
                    : [...answer, i],
              )
            }
          />
          <span className="answer-letter">{String.fromCharCode(65 + i)}</span>
          <span>{o[lang]}</span>
          {answer.includes(i) && <Check size={18} />}
        </label>
      ))}
    </div>
  )
}
function ResultReview({
  items,
  answers,
  lang,
}: {
  items: Question[]
  answers: Record<string, number[]>
  lang: Lang
}) {
  return (
    <div className="result-review">
      <h2>{text(lang, 'Review & understand', 'Разбор ответов')}</h2>
      {items.map((q, i) => (
        <details key={q.id}>
          <summary>
            <span
              className={
                isCorrect(q, answers[q.id]) ? 'review-correct' : 'review-wrong'
              }
            >
              {isCorrect(q, answers[q.id]) ? (
                <CheckCircle2 size={18} />
              ) : (
                <X size={18} />
              )}
            </span>
            <span>
              {i + 1}. {q.prompt[lang]}
            </span>
            <ChevronDown size={16} />
          </summary>
          <div className="review-detail">
            <strong>{text(lang, 'Your answer', 'Ваш ответ')}</strong>
            <p>
              {answers[q.id]?.length
                ? answers[q.id]
                    .map((a, i) =>
                      q.type === 'matching'
                        ? `${q.labels?.[i]} → ${q.options[a]?.[lang] ?? '—'}`
                        : (q.options[a]?.[lang] ?? '—'),
                    )
                    .join(' • ')
                : text(lang, 'Not answered', 'Нет ответа')}
            </p>
            <strong>{text(lang, 'Correct answer', 'Правильный ответ')}</strong>
            <p>
              {q.correct
                .map((a, i) =>
                  q.type === 'matching'
                    ? `${q.labels?.[i]} → ${q.options[a]?.[lang]}`
                    : q.options[a][lang],
                )
                .join(' • ')}
            </p>
            <p>{q.explanation[lang]}</p>
          </div>
        </details>
      ))}
    </div>
  )
}
function Quiz({
  items,
  lang,
  onExit,
}: {
  items: Question[]
  lang: Lang
  onExit: () => void
}) {
  const [index, setIndex] = useState(0),
    [answers, setAnswers] = useState<Record<string, number[]>>({}),
    [checked, setChecked] = useState(false),
    [finished, setFinished] = useState(false)
  const q = items[index],
    answer = answers[q.id] ?? [],
    valid =
      q.type === 'matching'
        ? answer.length === q.labels?.length &&
          answer.every((x) => x >= 0) &&
          new Set(answer).size === answer.length
        : answer.length > 0
  const correct = items.filter((x) => isCorrect(x, answers[x.id])).length
  if (finished)
    return (
      <>
        <div className="result-card">
          <div className="result-icon">
            <GraduationCap size={36} />
          </div>
          <span className="eyebrow">
            {text(lang, 'PRACTICE COMPLETE', 'ПРАКТИКА ЗАВЕРШЕНА')}
          </span>
          <h2>
            {correct}/{items.length} {text(lang, 'correct', 'верно')}
          </h2>
          <p>
            {text(
              lang,
              'Every answer is a chance to learn. Take a look at the explanations below.',
              'Каждый ответ — возможность узнать новое. Изучите объяснения ниже.',
            )}
          </p>
          <button className="primary-button" onClick={onExit}>
            {text(lang, 'Practice again', 'Ещё практика')}
            <ArrowRight size={16} />
          </button>
        </div>
        <ResultReview items={items} answers={answers} lang={lang} />
      </>
    )
  return (
    <div className="quiz-layout">
      <div className="quiz-main">
        <div className="quiz-topline">
          <span>
            {text(lang, 'Question', 'Вопрос')} {index + 1} / {items.length}
          </span>
          <span className="format-pill">
            {q.type === 'single'
              ? text(lang, 'Single answer', 'Один ответ')
              : q.type === 'multiple'
                ? text(lang, 'Select two', 'Выберите два')
                : text(lang, 'Matching', 'Сопоставление')}
          </span>
        </div>
        <div className="quiz-progress">
          <span style={{ width: `${((index + 1) / items.length) * 100}%` }} />
        </div>
        <h2>{q.prompt[lang]}</h2>
        <AnswerFields
          q={q}
          answer={answer}
          lang={lang}
          disabled={checked}
          onChange={(a) => setAnswers((p) => ({ ...p, [q.id]: a }))}
        />
        {checked && (
          <div
            role="status"
            className={`answer-feedback ${isCorrect(q, answer) ? 'correct' : 'incorrect'}`}
          >
            <strong>
              {isCorrect(q, answer)
                ? text(
                    lang,
                    'That’s right. Nicely done!',
                    'Верно! Отличная работа.',
                  )
                : text(
                    lang,
                    'Not quite. Here’s how it works.',
                    'Не совсем. Вот как это работает.',
                  )}
            </strong>
            <p>{q.explanation[lang]}</p>
            {!isCorrect(q, answer) && (
              <p>
                {text(lang, 'Correct answer: ', 'Правильный ответ: ')}
                {q.correct
                  .map((n, i) =>
                    q.type === 'matching'
                      ? `${q.labels?.[i]} → ${q.options[n][lang]}`
                      : q.options[n][lang],
                  )
                  .join(' • ')}
              </p>
            )}
          </div>
        )}
        <div className="quiz-actions">
          <button className="text-button" onClick={onExit}>
            {text(lang, 'Exit practice', 'Выйти из практики')}
          </button>
          {checked ? (
            <button
              className="primary-button"
              onClick={() => {
                if (index === items.length - 1) setFinished(true)
                else {
                  setIndex((i) => i + 1)
                  setChecked(false)
                }
              }}
            >
              {index === items.length - 1
                ? text(lang, 'See results', 'Результаты')
                : text(lang, 'Next question', 'Следующий вопрос')}
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              className="primary-button"
              disabled={!valid}
              onClick={() => setChecked(true)}
            >
              {text(lang, 'Check answer', 'Проверить ответ')}
              <Check size={16} />
            </button>
          )}
        </div>
      </div>
      <aside className="quiz-aside">
        <Sparkles size={24} />
        <h3>{text(lang, 'Make the connection.', 'Найдите связь.')}</h3>
        <p>
          {text(
            lang,
            'Try explaining why the other options are incorrect. Understanding the difference matters more than memorizing an answer.',
            'Объясните, почему остальные варианты неверны. Понимать различия полезнее, чем запоминать ответ.',
          )}
        </p>
        <span>
          <Clock3 size={15} />
          {text(lang, 'Take your time', 'Не торопитесь')}
        </span>
      </aside>
    </div>
  )
}
function ExamView({
  attempt,
  lang,
  onDone,
}: {
  attempt: Attempt
  lang: Lang
  onDone: () => void
}) {
  const [current, setCurrent] = useState(attempt),
    [index, setIndex] = useState(0),
    [flags, setFlags] = useState<number[]>([]),
    [left, setLeft] = useState(
      Math.max(
        0,
        Math.ceil((new Date(attempt.deadline).getTime() - Date.now()) / 1000),
      ),
    ),
    [pending, setPending] = useState(0),
    [error, setError] = useState(''),
    [confirm, setConfirm] = useState(false),
    [submitting, setSubmitting] = useState(false)
  const queue = useRef<Promise<unknown>>(Promise.resolve()),
    dirty = useRef<Record<string, number[]>>({}),
    finishing = useRef(false)
  const items = current.questionIds
    .map((id) => questions.find((q) => q.id === id))
    .filter((q): q is Question => !!q)
  const q = items[index],
    finished = !!current.finishedAt
  useEffect(() => {
    if (finished) return
    const timer = window.setInterval(
      () =>
        setLeft(
          Math.max(
            0,
            Math.ceil(
              (new Date(attempt.deadline).getTime() - Date.now()) / 1000,
            ),
          ),
        ),
      500,
    )
    return () => window.clearInterval(timer)
  }, [attempt.deadline, finished])
  const finishRef = useRef<() => void>(() => {})
  finishRef.current = () => {
    void finish()
  }
  useEffect(() => {
    if (left === 0 && !finished && !finishing.current) finishRef.current()
  }, [left, finished])
  function save(questionId: string, answer: number[]) {
    dirty.current[questionId] = answer
    setPending((n) => n + 1)
    queue.current = queue.current.then(async () => {
      try {
        await learning({ action: 'answer', id: attempt.id, questionId, answer })
        if (dirty.current[questionId] === answer)
          delete dirty.current[questionId]
        if (Object.keys(dirty.current).length === 0) setError('')
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setPending((n) => n - 1)
      }
    })
  }
  function answer(a: number[]) {
    setCurrent((prev) => ({ ...prev, answers: { ...prev.answers, [q.id]: a } }))
    save(q.id, a)
  }
  async function finish() {
    if (finishing.current) return
    finishing.current = true
    setSubmitting(true)
    setConfirm(false)
    try {
      await queue.current
      if (
        Object.keys(dirty.current).length &&
        Date.now() < new Date(attempt.deadline).getTime()
      ) {
        setError(
          text(
            lang,
            'Some answers are not saved. Retry saving before submitting.',
            'Некоторые ответы не сохранены. Повторите сохранение перед завершением.',
          ),
        )
        return
      }
      const result = await learning({ action: 'finish', id: attempt.id })
      setCurrent(result)
      setError('')
    } catch (e) {
      setError((e as Error).message)
    } finally {
      finishing.current = false
      setSubmitting(false)
    }
  }
  const answered = items.filter((x) => {
    const a = current.answers[x.id]
    return (
      a?.length &&
      (x.type !== 'matching' ||
        (a.length === x.labels?.length &&
          a.every((n) => n >= 0) &&
          new Set(a).size === a.length))
    )
  }).length
  if (finished)
    return (
      <>
        <div className="result-card">
          <div className="result-icon">
            <GraduationCap size={36} />
          </div>
          <span className="eyebrow">
            {text(lang, 'EXAM SIMULATION COMPLETE', 'СИМУЛЯЦИЯ ЗАВЕРШЕНА')}
          </span>
          <h2>{current.score}%</h2>
          <p>
            {(current.score ?? 0) >= 70
              ? text(
                  lang,
                  'Practice goal reached. Keep strengthening the topics below.',
                  'Учебная цель достигнута. Продолжайте закреплять темы.',
                )
              : text(
                  lang,
                  'A useful checkpoint. Review your answers and revisit the tricky topics.',
                  'Полезная проверка. Разберите ответы и повторите сложные темы.',
                )}
          </p>
          <small>
            {text(
              lang,
              'Practice goal: 70% correct. This is not a Certiport scaled score or a certification result.',
              'Учебная цель: 70% верных ответов. Это не шкала Certiport и не результат сертификации.',
            )}
          </small>
          <button className="primary-button" onClick={onDone}>
            {text(lang, 'Back to exams', 'К симуляциям')}
            <ArrowRight size={16} />
          </button>
        </div>
        <ResultReview items={items} answers={current.answers} lang={lang} />
      </>
    )
  return (
    <>
      <div className="exam-toolbar">
        <span>
          <ShieldCheck size={17} />
          IT Specialist ·{' '}
          {courses.find((c) => c.id === attempt.courseId)?.title[lang]}
        </span>
        <span className={`exam-clock ${left < 300 ? 'urgent' : ''}`}>
          <Clock3 size={18} />
          {String(Math.floor(left / 60)).padStart(2, '0')}:
          {String(left % 60).padStart(2, '0')}
        </span>
        <button
          className="text-button"
          disabled={pending > 0 || !!error || submitting}
          onClick={onDone}
        >
          {text(lang, 'Save & exit', 'Сохранить и выйти')}
        </button>
        <span className="save-status">
          {pending
            ? text(lang, 'Saving…', 'Сохранение…')
            : error
              ? text(lang, 'Save needs attention', 'Ошибка сохранения')
              : text(lang, 'Answers saved', 'Ответы сохранены')}
        </span>
      </div>
      {error && (
        <div className="notice" role="alert">
          {error}
          <button
            className="secondary-button"
            disabled={pending > 0 || submitting}
            onClick={() => {
              if (left === 0) {
                void finish()
                return
              }
              for (const [id, a] of Object.entries(dirty.current)) save(id, a)
            }}
          >
            {left === 0
              ? text(lang, 'Retry submission', 'Повторить завершение')
              : text(lang, 'Retry saving', 'Повторить сохранение')}
          </button>
        </div>
      )}
      <div className="quiz-layout">
        <div className="quiz-main">
          <div className="quiz-topline">
            <span>
              {text(lang, 'Question', 'Вопрос')} {index + 1} / {items.length}
            </span>
            <button
              className={`flag-button ${flags.includes(index) ? 'flagged' : ''}`}
              onClick={() =>
                setFlags((p) =>
                  p.includes(index)
                    ? p.filter((n) => n !== index)
                    : [...p, index],
                )
              }
            >
              <Flag size={16} />
              {flags.includes(index)
                ? text(lang, 'Marked for review', 'Отмечен')
                : text(lang, 'Mark for review', 'Отметить для проверки')}
            </button>
          </div>
          <h2>{q.prompt[lang]}</h2>
          <p className="muted">
            {q.type === 'single'
              ? text(lang, 'Choose one answer.', 'Выберите один ответ.')
              : q.type === 'multiple'
                ? text(lang, 'Choose two answers.', 'Выберите два ответа.')
                : text(
                    lang,
                    'Match all three concepts.',
                    'Сопоставьте все три понятия.',
                  )}
          </p>
          <AnswerFields
            q={q}
            answer={current.answers[q.id] ?? []}
            lang={lang}
            onChange={answer}
            disabled={left === 0 || submitting}
          />
          <div className="quiz-actions">
            <button
              className="secondary-button"
              disabled={index === 0}
              onClick={() => setIndex((i) => i - 1)}
            >
              <ChevronLeft size={16} />
              {text(lang, 'Previous', 'Назад')}
            </button>
            {index < items.length - 1 ? (
              <button
                className="primary-button"
                onClick={() => setIndex((i) => i + 1)}
              >
                {text(lang, 'Next question', 'Следующий вопрос')}
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                className="primary-button"
                disabled={pending > 0 || submitting}
                onClick={() => setConfirm(true)}
              >
                {text(lang, 'Review & submit', 'Проверить и завершить')}
                <Check size={16} />
              </button>
            )}
          </div>
        </div>
        <aside className="question-map">
          <h3>{text(lang, 'Your questions', 'Ваши вопросы')}</h3>
          <p>
            {answered}/{items.length} {text(lang, 'answered', 'отвечено')}
          </p>
          <div className="question-buttons">
            {items.map((item, i) => (
              <button
                key={item.id}
                className={`${i === index ? 'current' : ''} ${current.answers[item.id]?.length ? 'answered' : ''} ${flags.includes(i) ? 'flagged' : ''}`}
                aria-label={`${text(lang, 'Question', 'Вопрос')} ${i + 1}${flags.includes(i) ? ' · marked for review' : ''}`}
                aria-current={i === index ? 'step' : undefined}
                onClick={() => setIndex(i)}
              >
                {i + 1}
                {flags.includes(i) && <Flag size={8} />}
              </button>
            ))}
          </div>
          <div className="map-legend">
            <span>
              <i className="answered-key" />
              {text(lang, 'Answered', 'Есть ответ')}
            </span>
            <span>
              <Flag size={11} />
              {text(lang, 'Marked for review', 'Для проверки')}
            </span>
          </div>
          <button
            className="primary-button"
            disabled={pending > 0 || submitting}
            onClick={() => (left === 0 ? void finish() : setConfirm(true))}
          >
            {submitting
              ? text(lang, 'Submitting…', 'Отправка…')
              : text(lang, 'Finish exam', 'Завершить')}
            <Check size={16} />
          </button>
          <small>
            {text(
              lang,
              'You can close this page and resume from My progress. The timer keeps running. Review flags are only kept while this page is open.',
              'Можно закрыть страницу и продолжить в разделе «Мой прогресс». Таймер продолжает идти. Отметки для проверки сохраняются только на открытой странице.',
            )}
          </small>
        </aside>
      </div>
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent className="auth-dialog">
          <DialogTitle>
            {text(lang, 'Ready to submit?', 'Готовы завершить?')}
          </DialogTitle>
          <DialogDescription>
            {text(
              lang,
              `${answered} of ${items.length} questions answered. ${flags.length} marked for review. Unanswered questions count as incorrect.`,
              `${answered} из ${items.length} вопросов отвечено. Отмечено для проверки: ${flags.length}. Вопросы без ответа считаются неверными.`,
            )}
          </DialogDescription>
          <button className="primary-button" onClick={() => void finish()}>
            {text(lang, 'Submit exam', 'Завершить экзамен')}
            <Check size={17} />
          </button>
          <button
            className="secondary-button"
            onClick={() => setConfirm(false)}
          >
            {text(lang, 'Keep reviewing', 'Продолжить проверку')}
          </button>
        </DialogContent>
      </Dialog>
    </>
  )
}
