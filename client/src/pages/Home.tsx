import { useEffect, useMemo, useRef, useState } from "react";
import { consumeSiteRedirect, normalizeSiteBase } from "@/lib/siteRouting";
import {
  Activity,
  AlertTriangle,
  Award,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Dumbbell,
  Flame,
  Info,
  Utensils,
  LockKeyhole,
  LogOut,
  Maximize2,
  Minimize2,
  Menu,
  Play,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset,
  Trophy,
  UserRound,
  Video,
  Weight,
  X,
  Zap,
} from "lucide-react";
import {
  appCopy,
  appName,
  dataVersion,
  defaultProfile,
  editorialSources,
  completeTrainingDay,
  estimateDayXp,
  getCalendarDayState,
  getCurrentLevel,
  getDay,
  getDayKey,
  getLevelProgress,
  getNextDay,
  getStreakAfterCompletion,
  isAdvancedUnlocked,
  porcaoRecipes,
  type Exercise,
  type TrainingDay,
  type TrainingLevel,
  type TrainingProfile,
} from "@shared/trainingData";
import {
  loadStoredDay,
  loadStoredLevel,
  loadStoredProfile,
  resetStoredProgress,
  saveStoredDay,
  saveStoredLevel,
  saveStoredProfile,
  type StoredProfile,
} from "@/lib/localProfileStorage";

type Tab = "today" | "calendar" | "portion" | "profile";

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  }).replace(" de ", " ");
}

function levelLabel(level: TrainingLevel) {
  return level === "beginner" ? "Iniciante" : "Avançado";
}


function ProgressRing({ value, label }: { value: number; label: string }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-ring" style={{ "--progress": `${safeValue * 3.6}deg` } as React.CSSProperties}>
      <div className="progress-ring__inner">
        <strong>{safeValue}%</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "lime" | "orange" | "violet" }) {
  return <span className={`pf-pill pf-pill--${tone}`}>{children}</span>;
}

function StatCard({ icon, label, value, detail, tone }: { icon: React.ReactNode; label: string; value: string; detail: string; tone: string }) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__icon">{icon}</div>
      <div>
        <span className="eyebrow">{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}

function ExerciseRow({ exercise, completed, onToggle, onOpenVideo }: { exercise: Exercise; completed: boolean; onToggle: () => void; onOpenVideo: () => void }) {
  return (
    <article className={`exercise-row ${completed ? "is-complete" : ""}`}>
      <button type="button" className="exercise-check" aria-label={completed ? `Desmarcar ${exercise.name}` : `Concluir ${exercise.name}`} onClick={onToggle}>
        {completed ? <Check size={17} strokeWidth={3} /> : <span />}
      </button>
      <div className="exercise-row__main">
        <div className="exercise-row__title">
          <div>
            <span className="exercise-number">{exercise.id.split("-")[0].slice(0, 2).toUpperCase()}</span>
            <h3>{exercise.name}</h3>
          </div>
          <button type="button" className="video-link" onClick={onOpenVideo}><Video size={14} /> Ver técnica</button>
        </div>
        <div className="exercise-meta">
          <span><Dumbbell size={14} /> {exercise.equipment}</span>
          <span><Target size={14} /> {exercise.muscle}</span>
        </div>
        <div className="exercise-prescription">
          <div><span>Séries</span><strong>{exercise.sets}</strong></div>
          <div><span>Reps / tempo</span><strong>{exercise.reps}</strong></div>
          <div><span>Descanso</span><strong>{exercise.rest ? `${exercise.rest}s` : "—"}</strong></div>
          <div><span>Carga sugerida</span><strong>{exercise.load}</strong></div>
        </div>
        <p className="exercise-cue"><Info size={14} /> {exercise.cue}</p>
      </div>
    </article>
  );
}

function VideoModal({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await modalRef.current?.requestFullscreen();
      }
    } catch {
      // Some embedded browsers do not allow native fullscreen; the viewport modal remains immersive.
    }
  }

  return (
    <div className="modal-backdrop modal-backdrop--video" role="presentation" onClick={onClose}>
      <div ref={modalRef} className="video-modal video-modal--immersive" role="dialog" aria-modal="true" aria-label={`Técnica: ${exercise.name}`} onClick={(event) => event.stopPropagation()}>
        <div className="video-modal__head">
          <div><span className="eyebrow">TUTORIAL EMBUTIDO · TELA CHEIA</span><h2>{exercise.name}</h2></div>
          <div className="video-modal__actions">
            <button type="button" className="icon-button" onClick={() => { void toggleFullscreen(); }} aria-label="Expandir vídeo para tela cheia"><Maximize2 size={18} /></button>
            <button type="button" className="icon-button" onClick={onClose} aria-label="Fechar tutorial"><X size={19} /></button>
          </div>
        </div>
        <div className="video-frame video-frame--immersive"><iframe src={`https://www.youtube.com/embed/${exercise.videoId}?rel=0&modestbranding=1`} title={exercise.videoTitle} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen /></div>
        <p className="modal-note"><ShieldCheck size={16} /> Vídeo público de referência. Confirme o ajuste e a disponibilidade do aparelho com o professor da sua unidade.</p>
      </div>
    </div>
  );
}

function PortionView() {
  const [category, setCategory] = useState<"Todas" | "Pré-treino" | "Pós-treino">("Todas");
  const visibleRecipes = category === "Todas" ? porcaoRecipes : porcaoRecipes.filter((recipe) => recipe.category === category);

  return (
    <section className="portion-page">
      <div className="portion-hero">
        <div>
          <span className="eyebrow">PORÇÃO · COMBUSTÍVEL REAL</span>
          <h1>Coma simples.<br /><span>Treine melhor.</span></h1>
          <p>Receitas acessíveis com ingredientes naturais para acompanhar a sua rotina — sem promessas mágicas e sem complicar o prato.</p>
        </div>
        <div className="portion-hero__badge"><Utensils size={24} /><span>4 receitas<br /><strong>naturais</strong></span></div>
      </div>
      <div className="portion-filters" role="tablist" aria-label="Filtrar receitas">
        {(["Todas", "Pré-treino", "Pós-treino"] as const).map((item) => <button key={item} type="button" role="tab" aria-selected={category === item} className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <div className="portion-grid">
        {visibleRecipes.map((recipe) => <article className="recipe-card" key={recipe.id}>
          <div className={`recipe-card__top recipe-card__top--${recipe.category === "Pré-treino" ? "pre" : "post"}`}><span>{recipe.category}</span><span>{recipe.timing}</span></div>
          <div className="recipe-card__body"><div className="recipe-card__title"><h2>{recipe.title}</h2><Utensils size={18} /></div><div className="recipe-ingredients"><span className="eyebrow">INGREDIENTES</span>{recipe.ingredients.map((ingredient) => <span key={ingredient}><Check size={13} /> {ingredient}</span>)}</div><div className="recipe-preparation"><span className="eyebrow">COMO PREPARAR</span><p>{recipe.preparation}</p></div><div className="recipe-benefit"><Sparkles size={15} /><span>{recipe.benefits}</span></div></div>
        </article>)}
      </div>
      <div className="portion-safety"><ShieldCheck size={22} /><div><strong>Segurança primeiro</strong><p>Guaraná em pó e gengibre não são obrigatórios. O guaraná contém cafeína: não combine com café, energéticos ou pré-treinos estimulantes. Evite se você tem hipertensão, arritmia, ansiedade, sensibilidade à cafeína, está grávida/amamentando ou usa medicamentos sem antes falar com um profissional. O PanoFlow não substitui nutricionista ou médico.</p></div></div>
    </section>
  );
}

function CalendarView({ profile, selectedLevel, selectedDay, onSelectLevel, onSelectDay }: { profile: TrainingProfile; selectedLevel: TrainingLevel; selectedDay: number; onSelectLevel: (level: TrainingLevel) => void; onSelectDay: (day: number) => void }) {
  const progress = getLevelProgress(profile);
  const completed = selectedLevel === "beginner" ? profile.completedBeginnerDays : profile.completedAdvancedDays;
  return (
    <section className="calendar-panel">
      <div className="section-heading">
        <div><span className="eyebrow">RITMO DE EVOLUÇÃO</span><h2>Seu calendário</h2><p>Conclua o dia atual para liberar o próximo. Sem atalhos: consistência é o superpoder.</p></div>
        <div className="calendar-progress"><ProgressRing value={progress[selectedLevel]} label={selectedLevel === "beginner" ? "iniciante" : "avançado"} /></div>
      </div>
      <div className="level-tabs" role="tablist" aria-label="Nível do treino">
        {(["beginner", "advanced"] as TrainingLevel[]).map((level) => {
          const locked = level === "advanced" && !isAdvancedUnlocked(profile);
          return <button type="button" key={level} role="tab" aria-selected={selectedLevel === level} className={`level-tab ${selectedLevel === level ? "is-active" : ""} ${locked ? "is-locked" : ""}`} onClick={() => onSelectLevel(level)}><span>{locked ? <LockKeyhole size={15} /> : <Zap size={15} />}</span><div><strong>{levelLabel(level)}</strong><small>{progress[level]}% completo</small></div>{locked && <em>libera no dia 30</em>}</button>;
        })}
      </div>
      <div className="calendar-grid">
        {Array.from({ length: 30 }, (_, index) => {
          const day = index + 1;
          const dayState = getCalendarDayState(profile, selectedLevel, day);
          const unlocked = dayState.unlocked;
          const done = dayState.completed;
          return <button type="button" key={day} className={`calendar-day ${day === selectedDay ? "is-selected" : ""} ${done ? "is-done" : ""} ${!unlocked ? "is-locked" : ""}`} onClick={() => unlocked && onSelectDay(day)} disabled={!unlocked}><span>{done ? <Check size={15} strokeWidth={3} /> : unlocked ? day : <LockKeyhole size={14} />}</span><small>DIA</small><strong>{day}</strong></button>;
        })}
      </div>
      <div className="calendar-legend"><span><i className="legend-dot legend-dot--done" /> concluído</span><span><i className="legend-dot legend-dot--active" /> próximo</span><span><i className="legend-dot legend-dot--locked" /> bloqueado</span></div>
    </section>
  );
}

export default function Home() {
  const [profile, setProfile] = useState<StoredProfile>(() => loadStoredProfile());
  const [tab, setTab] = useState<Tab>("today");
  const [selectedLevel, setSelectedLevel] = useState<TrainingLevel>(() => {
    const savedProfile = loadStoredProfile();
    return loadStoredLevel(getCurrentLevel(savedProfile));
  });
  const [selectedDay, setSelectedDay] = useState(() => loadStoredDay());
  const [activeVideo, setActiveVideo] = useState<Exercise | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("saved");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [resetNotice, setResetNotice] = useState<string | null>(null);

  useEffect(() => {
    consumeSiteRedirect(
      normalizeSiteBase(import.meta.env.BASE_URL),
      window.location,
      (path) => window.history.replaceState(window.history.state, "", path),
    );
  }, []);

  const day = useMemo(() => getDay(selectedLevel, selectedDay), [selectedLevel, selectedDay]);
  const dayKey = getDayKey(selectedLevel, selectedDay);
  const completedExercises = profile.completedExercises[dayKey] ?? [];
  const completedCount = day.exercises.filter((exercise) => completedExercises.includes(exercise.id)).length;
  const dayComplete = completedCount === day.exercises.length;
  const currentLevel = getCurrentLevel(profile);
  const progress = getLevelProgress(profile);
  const totalCompleted = profile.completedBeginnerDays.length + profile.completedAdvancedDays.length;
  const nextDay = getNextDay(profile, currentLevel);

  useEffect(() => {
    setSaveState("saving");
    setSaveError(null);
    const saved = saveStoredProfile(profile);
    if (!saved) {
      setSaveState("error");
      setSaveError("Não foi possível salvar neste navegador.");
      return;
    }
    setSaveState("saved");
  }, [profile]);

  useEffect(() => {
    saveStoredDay(selectedDay);
  }, [selectedDay]);

  useEffect(() => {
    saveStoredLevel(selectedLevel);
  }, [selectedLevel]);

  useEffect(() => {
    if (!restSeconds) return;
    const timer = window.setInterval(() => setRestSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [restSeconds]);

  function toggleExercise(exerciseId: string) {
    if (profile.completedExercises[dayKey]?.includes(exerciseId)) {
      setProfile((current) => ({ ...current, completedExercises: { ...current.completedExercises, [dayKey]: current.completedExercises[dayKey].filter((id) => id !== exerciseId) } }));
      return;
    }
    const nextExercises = [...(profile.completedExercises[dayKey] ?? []), exerciseId];
    setProfile((current) => ({ ...current, completedExercises: { ...current.completedExercises, [dayKey]: nextExercises } }));
    setRestSeconds(day.exercises.find((exercise) => exercise.id === exerciseId)?.rest ?? 0);
  }

  function completeDay() {
    if (!dayComplete) return;
    const result = completeTrainingDay(profile, selectedLevel, selectedDay, completedExercises, Date.now());
    if (!result.completed) return;
    setProfile(result.profile);
    setCelebrate(true);
    window.setTimeout(() => setCelebrate(false), 1800);
    if (selectedDay < 30) setSelectedDay(selectedDay + 1);
  }

  function resetDemo() {
    if (typeof window !== "undefined" && !window.confirm("Resetar todo o progresso salvo neste dispositivo? Essa ação não pode ser desfeita.")) return;
    resetStoredProgress();
    setProfile({ ...defaultProfile });
    setSelectedDay(1);
    setSelectedLevel("beginner");
    setRestSeconds(0);
    setTab("today");
    setSaveState("idle");
    setSaveError(null);
    setResetNotice("Dados locais resetados. O app voltou ao início.");
    window.setTimeout(() => setResetNotice(null), 4500);
  }

  const displayName = "Atleta";
  const avatar = "A";

  return (
    <div className="pf-app-shell">
      <aside className={`pf-sidebar ${showMenu ? "is-open" : ""}`}>
        <div className="brand-lockup"><div className="brand-mark"><Dumbbell size={20} /></div><div><strong>PANOFLOW</strong><span>PERSONAL TRAINER</span></div></div>
        <button type="button" className="mobile-close" onClick={() => setShowMenu(false)} aria-label="Fechar menu"><X size={20} /></button>
        <nav className="side-nav" aria-label="Navegação principal">
          <button type="button" className={tab === "today" ? "is-active" : ""} onClick={() => { setTab("today"); setShowMenu(false); }}><Activity size={18} /> Treino de hoje</button>
          <button type="button" className={tab === "calendar" ? "is-active" : ""} onClick={() => { setTab("calendar"); setShowMenu(false); }}><CalendarDays size={18} /> Calendário <span className="nav-count">{totalCompleted}/60</span></button>
          <button type="button" className={tab === "portion" ? "is-active" : ""} onClick={() => { setTab("portion"); setShowMenu(false); }}><Utensils size={18} /> Porção</button>
          <button type="button" className={tab === "profile" ? "is-active" : ""} onClick={() => { setTab("profile"); setShowMenu(false); }}><UserRound size={18} /> Meu perfil</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="source-note"><Sparkles size={16} /><div><strong>Treino com contexto</strong><span>Ciência + prática + consistência.</span></div></div>
          <button type="button" className="source-button" onClick={() => setShowSources(true)}><CircleHelp size={16} /> Fontes e segurança</button>
          <button type="button" className="source-button reset-button" onClick={resetDemo}><RotateCcw size={16} /> Resetar dados locais</button>
          {resetNotice && <span className="reset-notice" role="status">{resetNotice}</span>}
          <div className="sidebar-footer"><span>{dataVersion}</span><span>Panobianco</span></div>
        </div>
      </aside>
      {showMenu && <button type="button" className="sidebar-scrim" onClick={() => setShowMenu(false)} aria-label="Fechar navegação" />}
      <main className="app-main">
        <header className="topbar"><button type="button" className="mobile-menu" onClick={() => setShowMenu(true)} aria-label="Abrir menu"><Menu size={21} /></button><div className="mobile-brand">PANO<span>FLOW</span></div><div className="topbar-actions"><span className={`save-status save-status--${saveState}`} title={saveError ?? "Progresso salvo neste navegador"}>{saveState === "error" ? "ERRO AO SALVAR" : saveState === "saving" ? "SALVANDO" : "SALVO LOCAL"}</span><div className="topbar-streak"><Flame size={17} /><strong>{profile.streak}</strong><span>streak</span></div><div className="topbar-xp"><Zap size={16} /><strong>{profile.xp.toLocaleString("pt-BR")}</strong><span>XP</span></div><div className="avatar" title="Progresso local">{avatar}</div></div></header>
        <div className="page-wrap">
          {tab === "today" && <>
            <section className="hero-row"><div><span className="eyebrow">{currentLevel === "beginner" ? "CICLO 01 · FUNDAMENTO" : "CICLO 02 · EVOLUÇÃO"}</span><h1>Hoje você treina<br /><em>por você.</em></h1><p className="hero-copy">Foco em um treino claro, seguro e repetível. A sessão de hoje é o seu próximo ponto de evolução.</p></div><div className="hero-badge"><div className="hero-badge__top"><Trophy size={18} /><span>OBJETIVO DO CICLO</span></div><strong>{currentLevel === "beginner" ? "Construir base" : "Subir o nível"}</strong><div className="mini-progress"><span style={{ width: `${progress[currentLevel]}%` }} /></div><small>{progress[currentLevel]}% do ciclo completo</small></div></section>
            <section className="stats-grid"><StatCard icon={<Flame size={20} />} label="Streak atual" value={`${profile.streak} dias`} detail="Consistência vence pressa" tone="orange" /><StatCard icon={<Zap size={20} />} label="XP acumulado" value={profile.xp.toLocaleString("pt-BR")} detail={`+${estimateDayXp(day)} XP neste treino`} tone="lime" /><StatCard icon={<Award size={20} />} label="Treinos feitos" value={`${totalCompleted}/60`} detail={`${progress.beginner}% iniciante · ${progress.advanced}% avançado`} tone="violet" /></section>
            <section className="today-layout"><div className="workout-card"><div className="workout-card__head"><div><div className="day-kicker"><span className="day-number">{String(selectedDay).padStart(2, "0")}</span><span><span className="eyebrow">TREINO DO DIA</span><strong>{day.title}</strong></span></div><p>{day.focus} <span className="dot-separator">•</span> {day.duration} min <span className="dot-separator">•</span> {day.exercises.length} blocos</p></div><Pill tone={dayComplete ? "lime" : "orange"}>{dayComplete ? "Concluído" : `${completedCount}/${day.exercises.length}`}</Pill></div><div className="workout-tip"><Sparkles size={16} /><span>{day.note}</span></div><div className="exercise-list">{day.exercises.map((exercise) => <ExerciseRow key={exercise.id} exercise={exercise} completed={completedExercises.includes(exercise.id)} onToggle={() => toggleExercise(exercise.id)} onOpenVideo={() => setActiveVideo(exercise)} />)}</div><div className="workout-footer"><div className="completion-track"><div className="completion-track__label"><span>Progresso do treino</span><strong>{Math.round((completedCount / day.exercises.length) * 100)}%</strong></div><div className="track"><span style={{ width: `${(completedCount / day.exercises.length) * 100}%` }} /></div></div><button type="button" className="primary-cta" disabled={!dayComplete || (selectedLevel === "beginner" ? profile.completedBeginnerDays : profile.completedAdvancedDays).includes(selectedDay)} onClick={completeDay}>{(selectedLevel === "beginner" ? profile.completedBeginnerDays : profile.completedAdvancedDays).includes(selectedDay) ? <><Check size={18} /> Dia salvo</> : <>Concluir treino <ChevronRight size={18} /></>}</button></div></div><aside className="right-rail"><div className="next-card"><div className="next-card__head"><span className="eyebrow">PRÓXIMO PASSO</span><ChevronRight size={17} /></div><div className="next-day-number">{String(Math.min(30, selectedDay + 1)).padStart(2, "0")}</div><strong>{selectedDay === 30 ? "Ciclo completo" : "Amanhã, de novo"}</strong><p>{selectedDay === 30 ? "O próximo ciclo será liberado quando você concluir os 30 dias." : "O próximo treino desbloqueia quando o checklist de hoje estiver completo."}</p></div><div className="rest-card"><div className="rest-card__icon"><TimerReset size={20} /></div><div><span className="eyebrow">CRONÔMETRO</span><strong>{restSeconds ? `${Math.floor(restSeconds / 60)}:${String(restSeconds % 60).padStart(2, "0")}` : "Pronto para o próximo set"}</strong><small>{restSeconds ? "Respire. Controle. Volte forte." : "O descanso da série aparece aqui."}</small></div>{restSeconds > 0 && <button type="button" className="icon-button icon-button--small" onClick={() => setRestSeconds(0)} aria-label="Pular descanso"><Plus size={15} /></button>}</div><div className="safety-card"><ShieldCheck size={18} /><div><strong>Regra PanoFlow</strong><p>Sem dor aguda, sem pressa e sem ego. Se o aparelho variar na unidade, peça uma adaptação ao professor.</p></div></div></aside></section>
          </>}
          {tab === "calendar" && <CalendarView profile={profile} selectedLevel={selectedLevel} selectedDay={selectedDay} onSelectLevel={(level) => { setSelectedLevel(level); setSelectedDay(getNextDay(profile, level)); setTab("today"); }} onSelectDay={(dayNumber) => { setSelectedDay(dayNumber); setTab("today"); }} />}
          {tab === "portion" && <PortionView />}
          {tab === "profile" && <section className="profile-page"><div className="profile-heading"><div className="profile-avatar">{avatar}</div><div><span className="eyebrow">PERFIL DO ATLETA</span><h1>{displayName}, vamos construir.</h1><p>Seus dados ficam salvos neste navegador, sem conta ou servidor.</p></div></div><div className="profile-grid"><div className="profile-card"><div className="section-heading section-heading--compact"><div><span className="eyebrow">DADOS BASE</span><h2>Seu ponto de partida</h2></div><UserRound size={20} /></div><div className="body-metrics"><div><span>Altura</span><strong>{profile.heightCm} <small>cm</small></strong></div><div><span>Peso inicial</span><strong>{profile.weightKg} <small>kg</small></strong></div><div><span>Nível</span><strong>{levelLabel(currentLevel)}</strong></div></div><div className="profile-disclaimer"><Info size={15} /> Ajuste estes dados com um profissional. O PanoFlow não diagnostica nem prescreve.</div></div><div className="profile-card history-card"><div className="section-heading section-heading--compact"><div><span className="eyebrow">HISTÓRICO</span><h2>Últimas vitórias</h2></div><Trophy size={20} /></div>{profile.history.length ? <div className="history-list">{profile.history.slice(-5).reverse().map((entry, index) => <div className="history-item" key={`${entry.level}-${entry.day}-${entry.completedAt}`}><div className="history-icon"><Check size={15} /></div><div><strong>Dia {entry.day} · {levelLabel(entry.level)}</strong><span>{formatDate(entry.completedAt)} · +{entry.xp} XP</span></div><span className="history-index">#{profile.history.length - index}</span></div>)}</div> : <div className="empty-history"><Award size={28} /><p>Seu histórico começa no primeiro treino concluído.</p></div>}</div></div><div className="profile-actions"><div className="profile-actions__left"><button type="button" className="text-button" onClick={resetDemo}><RotateCcw size={15} /> Resetar progresso local</button></div><div className="profile-actions__right">{saveError && <span className="save-error"><AlertTriangle size={13} /> {saveError}</span>}<span className="local-only-note">Modo offline · dados neste navegador</span></div></div></section>}
        </div>
      </main>
      <nav className="bottom-nav" aria-label="Navegação móvel"><button type="button" className={tab === "today" ? "is-active" : ""} onClick={() => setTab("today")}><Activity size={19} /><span>Hoje</span></button><button type="button" className={tab === "calendar" ? "is-active" : ""} onClick={() => setTab("calendar")}><CalendarDays size={19} /><span>Calendário</span></button><button type="button" className={tab === "portion" ? "is-active" : ""} onClick={() => setTab("portion")}><Utensils size={19} /><span>Porção</span></button><button type="button" className={tab === "profile" ? "is-active" : ""} onClick={() => setTab("profile")}><UserRound size={19} /><span>Perfil</span></button></nav>
      {activeVideo && <VideoModal exercise={activeVideo} onClose={() => setActiveVideo(null)} />}
      {showSources && <div className="modal-backdrop" role="presentation" onClick={() => setShowSources(false)}><div className="sources-modal" role="dialog" aria-modal="true" aria-label="Fontes e segurança" onClick={(event) => event.stopPropagation()}><div className="video-modal__head"><div><span className="eyebrow">EDITORIAL</span><h2>Treino com contexto</h2></div><button type="button" className="icon-button" onClick={() => setShowSources(false)} aria-label="Fechar fontes"><X size={19} /></button></div><p>O catálogo combina princípios de progressão no treino resistido, atividade física e referências de comunidades. As discussões de fórum ajudam a entender dúvidas reais, mas não substituem avaliação profissional.</p><div className="sources-list">{editorialSources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><span>{source.label}</span><ChevronRight size={16} /></a>)}</div><div className="source-warning"><ShieldCheck size={17} /><span>{appCopy.equipmentNote}</span></div></div></div>}
      {celebrate && <div className="celebration" role="status"><div className="celebration__burst"><Sparkles size={25} /></div><strong>Treino salvo!</strong><span>+{estimateDayXp(day)} XP · próximo dia liberado</span></div>}

    </div>
  );
}
