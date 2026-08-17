export type TrainingLevel = "beginner" | "advanced";

export type Exercise = {
  id: string;
  name: string;
  equipment: string;
  muscle: string;
  sets: number;
  reps: string;
  rest: number;
  load: string;
  cue: string;
  videoId: string;
  videoTitle: string;
};

export type TrainingDay = {
  day: number;
  level: TrainingLevel;
  title: string;
  focus: string;
  duration: number;
  note: string;
  exercises: Exercise[];
};

const videos = {
  legPress: ["waAxlYvtCcI", "Leg press 45°: execução correta"],
  extension: ["el3oHblB5DM", "Cadeira extensora: técnica"],
  pulldown: ["hOCkiWXdEYg", "Puxada frente: técnica"],
  row: ["f8AVh4VBbos", "Remada baixa: execução"],
  chestPress: ["WGdi4iTfza8", "Supino máquina: ajuste e execução"],
  legCurl: ["AFG0wxXmTH4", "Cadeira flexora: técnica"],
  shoulder: ["EuQAfhXBEvs", "Desenvolvimento de ombros"],
  treadmill: ["nQdMzvhaSrI", "Como usar a esteira"],
  bike: ["uhqGxNbWTkk", "Aula de bike/spinning"],
  adductor: ["ESHQCLn750E", "Cadeira adutora e abdutora"],
  crossover: ["pdMWt71MPlw", "Crossover: execução"],
} as const;

type VideoKey = keyof typeof videos;

function makeExercise(
  id: string,
  name: string,
  equipment: string,
  muscle: string,
  sets: number,
  reps: string,
  rest: number,
  load: string,
  cue: string,
  video: VideoKey,
): Exercise {
  const [videoId, videoTitle] = videos[video];
  return { id, name, equipment, muscle, sets, reps, rest, load, cue, videoId, videoTitle };
}

export const equipmentLibrary = [
  { name: "Leg press 45°", group: "Pernas", category: "força", video: videos.legPress },
  { name: "Cadeira extensora", group: "Quadríceps", category: "força", video: videos.extension },
  { name: "Cadeira flexora", group: "Posteriores", category: "força", video: videos.legCurl },
  { name: "Puxada frente / pulley", group: "Costas", category: "força", video: videos.pulldown },
  { name: "Remada baixa", group: "Costas", category: "força", video: videos.row },
  { name: "Supino máquina", group: "Peito", category: "força", video: videos.chestPress },
  { name: "Desenvolvimento de ombros", group: "Ombros", category: "força", video: videos.shoulder },
  { name: "Cadeira abdutora/adutora", group: "Quadril", category: "força", video: videos.adductor },
  { name: "Crossover", group: "Peito e braços", category: "força", video: videos.crossover },
  { name: "Esteira", group: "Cardiorrespiratório", category: "cardio", video: videos.treadmill },
  { name: "Bicicleta/spinning", group: "Cardiorrespiratório", category: "cardio", video: videos.bike },
] as const;

const beginnerPatterns: Exercise[][] = [
  [
    makeExercise("legpress", "Leg press 45°", "Leg press 45°", "Quadríceps e glúteos", 3, "10–12", 90, "40 kg", "Pé inteiro apoiado; joelhos acompanham a linha dos pés.", "legPress"),
    makeExercise("chestpress", "Supino máquina", "Supino máquina", "Peito e tríceps", 3, "10–12", 90, "20 kg", "Ajuste o banco; mantenha escápulas estáveis e não trave os cotovelos.", "chestPress"),
    makeExercise("pulldown", "Puxada frente", "Pulley", "Costas e bíceps", 3, "10–12", 90, "25 kg", "Puxe até a parte alta do peito sem balançar o tronco.", "pulldown"),
    makeExercise("treadmill", "Caminhada inclinada", "Esteira", "Cardio", 1, "12 min", 0, "velocidade 5 km/h", "Comece sem segurar nas barras; ajuste a velocidade com segurança.", "treadmill"),
  ],
  [
    makeExercise("legcurl", "Cadeira flexora", "Cadeira flexora", "Posteriores", 3, "10–12", 75, "20 kg", "Alinhe o eixo da máquina ao joelho e controle a volta.", "legCurl"),
    makeExercise("row", "Remada baixa", "Remada baixa", "Costas", 3, "10–12", 90, "25 kg", "Puxe com cotovelos e evite compensar com o tronco.", "row"),
    makeExercise("shoulder", "Desenvolvimento sentado", "Máquina de ombros", "Ombros", 2, "10–12", 75, "15 kg", "Punhos alinhados e amplitude confortável, sem dor.", "shoulder"),
    makeExercise("bike", "Bike moderada", "Bicicleta", "Cardio", 1, "12 min", 0, "carga leve 2", "Mantenha cadência estável e ajuste o selim antes de começar.", "bike"),
  ],
  [
    makeExercise("extension", "Cadeira extensora", "Cadeira extensora", "Quadríceps", 3, "12–15", 75, "25 kg", "Suba com controle e não bata o peso no final.", "extension"),
    makeExercise("adductor", "Abdutora/adutora", "Cadeira abdutora/adutora", "Quadril", 2, "12–15", 60, "25 kg", "Movimente sem impulso e faça pausa curta na contração.", "adductor"),
    makeExercise("crossover", "Crossover alto", "Crossover", "Peito", 2, "12–15", 60, "15 kg", "Costelas baixas e ombros longe das orelhas.", "crossover"),
    makeExercise("treadmill", "Caminhada leve", "Esteira", "Cardio", 1, "15 min", 0, "velocidade 4.5 km/h", "Use o clipe de segurança e progrida apenas se estiver confortável.", "treadmill"),
  ],
  [
    makeExercise("legpress", "Leg press 45°", "Leg press 45°", "Pernas", 3, "8–10", 105, "60 kg", "Pare antes de perder a posição lombar; sem pressa na descida.", "legPress"),
    makeExercise("row", "Remada baixa", "Remada baixa", "Costas", 3, "8–10", 105, "35 kg", "Mantenha o peito aberto e controle a fase excêntrica.", "row"),
    makeExercise("chestpress", "Supino máquina", "Supino máquina", "Peito", 3, "8–10", 105, "30 kg", "Não transforme a série em teste de carga; técnica vem primeiro.", "chestPress"),
    makeExercise("bike", "Bike intervalada leve", "Bicicleta", "Cardio", 1, "10 min", 0, "carga 3", "Recupere se faltar ar; o objetivo é consistência.", "bike"),
  ],
];

const patternNames = ["Base de pernas", "Empurrar e puxar", "Quadril e peito", "Força controlada"];

const advancedPatterns = beginnerPatterns.map((pattern) => pattern.map((item) => ({
  ...item,
  sets: Math.min(item.sets + 1, 4),
  rest: item.rest ? item.rest + 15 : item.rest,
  load: item.load.includes("kg") ? `${parseInt(item.load, 10) + 15} kg` : item.load,
  cue: `${item.cue} Só aumente a carga quando completar o topo da faixa com técnica.`,
})));

export function getPlanDays(level: TrainingLevel): TrainingDay[] {
  const patterns = level === "beginner" ? beginnerPatterns : advancedPatterns;
  return Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const recovery = index % 7 === 6;
    const patternIndex = index % patterns.length;
    const exercises = recovery
      ? [makeExercise(`walk-${level}-${day}`, "Caminhada de recuperação", "Esteira", "Cardio leve", 1, "20 min", 0, "ritmo confortável", "Finalize sentindo que poderia continuar.", "treadmill")]
      : patterns[patternIndex].map((item) => ({ ...item, id: `${item.id}-${level}-${day}` }));

    return {
      day,
      level,
      title: recovery ? "Recuperação ativa" : patternNames[patternIndex],
      focus: recovery ? "Mobilidade + cardio leve" : patternIndex === 0 ? "Corpo inteiro" : patternIndex === 1 ? "Tronco" : patternIndex === 2 ? "Pernas e postura" : "Técnica e condicionamento",
      duration: recovery ? 20 : 42 + patternIndex * 4,
      note: level === "beginner"
        ? "Pare 2–3 repetições antes da falha. Aprenda a máquina e registre como se sentiu."
        : "Mantenha 1–2 repetições em reserva e registre carga, repetições e qualidade do movimento.",
      exercises,
    };
  });
}

export function getDay(level: TrainingLevel, day: number) {
  return getPlanDays(level)[Math.max(0, Math.min(29, day - 1))];
}

export function getExerciseVideoUrl(videoId: string) {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

export function getDayKey(level: TrainingLevel, day: number) {
  return `${level}-${day}`;
}

export const editorialSources = [
  { label: "ACSM · progressão no treinamento resistido", url: "https://pubmed.ncbi.nlm.nih.gov/19204579/" },
  { label: "OMS · atividade física e fortalecimento", url: "https://pubmed.ncbi.nlm.nih.gov/33239350/" },
  { label: "Revisão sobre treino resistido e composição corporal", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9285060/" },
  { label: "Hipertrofia.org · carga e repetições", url: "https://www.hipertrofia.org/forum/topic/241444-muita-carga-e-pouco-repeti%C3%A7%C3%A3o-vs-pouca-carga-e-muita-repeti%C3%A7%C3%A3o/" },
  { label: "Reddit Maromba · comunidade", url: "https://www.reddit.com/r/Maromba/" },
];

export type TrainingProfile = {
  heightCm: number;
  weightKg: number;
  level: TrainingLevel;
  xp: number;
  streak: number;
  completedBeginnerDays: number[];
  completedAdvancedDays: number[];
  completedExercises: Record<string, string[]>;
  history: { day: number; level: TrainingLevel; completedAt: number; xp: number }[];
  lastCompletedAt?: number;
};

export const defaultProfile: TrainingProfile = {
  heightCm: 184,
  weightKg: 106,
  level: "beginner",
  xp: 0,
  streak: 0,
  completedBeginnerDays: [],
  completedAdvancedDays: [],
  completedExercises: {},
  history: [],
};

export function isAdvancedUnlocked(profile: TrainingProfile) {
  return profile.completedBeginnerDays.length >= 30;
}

export function getCurrentLevel(profile: TrainingProfile): TrainingLevel {
  return isAdvancedUnlocked(profile) ? "advanced" : "beginner";
}

export function getCompletedDays(profile: TrainingProfile, level: TrainingLevel) {
  return level === "beginner" ? profile.completedBeginnerDays : profile.completedAdvancedDays;
}
export function isDayUnlocked(profile: TrainingProfile, level: TrainingLevel, day: number) {
  if (level === "advanced" && !isAdvancedUnlocked(profile)) return false;
  if (day === 1) return true;
  return getCompletedDays(profile, level).includes(day - 1);
}
export function getCalendarDayState(profile: TrainingProfile, level: TrainingLevel, day: number) {
  const completed = getCompletedDays(profile, level).includes(day);
  return { unlocked: isDayUnlocked(profile, level, day), completed };
}
export function getNextDay(profile: TrainingProfile, level: TrainingLevel) {
  const completed = getCompletedDays(profile, level);
  return Math.min(30, completed.length ? Math.max(...completed) + 1 : 1);
}

export function getLevelProgress(profile: TrainingProfile) {
  return {
    beginner: Math.round((profile.completedBeginnerDays.length / 30) * 100),
    advanced: Math.round((profile.completedAdvancedDays.length / 30) * 100),
  };
}

export function estimateDayXp(day: TrainingDay) {
  return 80 + day.exercises.length * 20;
}

function utcDayNumber(timestamp: number) {
  return Math.floor(timestamp / 86_400_000);
}

export function getStreakAfterCompletion(profile: TrainingProfile, completedAt: number) {
  if (!profile.lastCompletedAt) return 1;
  const dayGap = utcDayNumber(completedAt) - utcDayNumber(profile.lastCompletedAt);
  if (dayGap === 0) return profile.streak;
  if (dayGap === 1) return profile.streak + 1;
  return 1;
}

export function completeTrainingDay(
  profile: TrainingProfile,
  level: TrainingLevel,
  dayNumber: number,
  completedExerciseIds: string[],
  completedAt: number,
) {
  const day = getDay(level, dayNumber);
  const completedAll = day.exercises.every((exercise) => completedExerciseIds.includes(exercise.id));
  const completedDays = level === "beginner" ? profile.completedBeginnerDays : profile.completedAdvancedDays;
  if (!completedAll || completedDays.includes(dayNumber)) {
    return { completed: false as const, profile, xpGain: 0 };
  }

  const xpGain = estimateDayXp(day);
  const nextProfile: TrainingProfile = {
    ...profile,
    level: level === "beginner" && dayNumber === 30 ? "advanced" : level,
    xp: profile.xp + xpGain,
    streak: getStreakAfterCompletion(profile, completedAt),
    lastCompletedAt: completedAt,
    completedBeginnerDays: level === "beginner" ? [...profile.completedBeginnerDays, dayNumber] : profile.completedBeginnerDays,
    completedAdvancedDays: level === "advanced" ? [...profile.completedAdvancedDays, dayNumber] : profile.completedAdvancedDays,
    history: [...profile.history, { day: dayNumber, level, completedAt, xp: xpGain }],
  };
  return { completed: true as const, profile: nextProfile, xpGain };
}

export const appCopy = {
  disclaimer: "PanoFlow organiza sua rotina, mas não substitui uma avaliação individual. Confirme a disponibilidade do aparelho e peça orientação ao professor da unidade.",
  equipmentNote: "Os equipamentos podem variar por unidade Panobianco. Confirme a máquina local antes de começar.",
  results: "Resultados variam conforme treino, alimentação, sono, recuperação e saúde individual.",
};

export const plans = {
  beginner: getPlanDays("beginner"),
  advanced: getPlanDays("advanced"),
};

export const appName = "PanoFlow";
export const appTagline = "Um treino por vez. Um corpo em construção.";
export const dataVersion = "PF-1.0";
export const unitLookupUrl = "https://www.panobiancoacademia.com.br/academias";
export const researchUpdatedAt = "2026-08-17";
export const maxPlanDays = 30;
export const cycleCount = 2;
export const sourceCount = editorialSources.length;
export const equipmentCount = equipmentLibrary.length;
export const finalDisclaimer = "Consulte um profissional antes de iniciar se tiver condição de saúde, dor ou histórico de lesão.";
export const safeProgressionNote = "A carga sobe somente quando o movimento e a faixa de repetições forem confortáveis.";
export const videoPolicy = "Vídeos públicos são exibidos em iframe; não são vídeos oficiais da Panobianco.";
export const productScope = "Acompanhamento de treino, não prescrição médica.";
export const noFabricatedReviews = true;
export const supportedLocale = "pt-BR";
export const versionLabel = "v1.0 · protótipo funcional";
export const isValidLevel = (level: string): level is TrainingLevel => level === "beginner" || level === "advanced";
export const isValidDay = (day: number) => Number.isInteger(day) && day >= 1 && day <= 30;
export const researchTrail = ["ACSM", "OMS", "PubMed", "Hipertrofia.org", "Reddit Maromba"];
export const trainingMode = "machines-first";
export const productPromise = "clareza e consistência, não garantia de resultado";
export const unitAvailabilityNote = "Disponibilidade: confirme na sua unidade Panobianco";
export const streakRule = "streak conta dias completos consecutivos";
export const xpRule = "XP é métrica de produto, não performance fisiológica";
export const dataQuality = "dataset editorial compacto para 60 dias";
export const appFooter = "PanoFlow · conteúdo educativo · sem depoimentos fabricados";
export const lastUpdated = "17/08/2026";

export const appMetadata = {
  name: appName,
  tagline: appTagline,
  version: dataVersion,
  researchUpdatedAt,
  equipmentCount,
  sourceCount,
};

export default plans;

type FinalExport = {
  getPlanDays: typeof getPlanDays;
  getDay: typeof getDay;
  equipmentLibrary: typeof equipmentLibrary;
  editorialSources: typeof editorialSources;
  defaultProfile: typeof defaultProfile;
  appCopy: typeof appCopy;
};

export const finalExport: FinalExport = {
  getPlanDays,
  getDay,
  equipmentLibrary,
  editorialSources,
  defaultProfile,
  appCopy,
};

export const complete = true;
export const ready = true;
export const endOfModule = "PanoFlow";
export const endOfFile = true;

export type PorcaoRecipe = {
  id: string;
  title: string;
  category: "Pré-treino" | "Pós-treino";
  timing: string;
  ingredients: string[];
  preparation: string;
  benefits: string;
};

export const porcaoRecipes: PorcaoRecipe[] = [
  {
    id: "pre-guarana-gengibre",
    title: "Shot Energético Natural (Guaraná & Gengibre)",
    category: "Pré-treino",
    timing: "30 minutos antes do treino",
    ingredients: [
      "1/4 colher de chá de guaraná em pó (opcional)",
      "1/2 colher de chá de gengibre em pó",
      "200 ml de água gelada ou água de coco",
      "Gotas de limão a gosto",
    ],
    preparation: "Misture vigorosamente o guaraná em pó e o gengibre em pó na água até dissolver por completo. Adicione limão para suavizar o sabor.",
    benefits: "Pode oferecer estímulo por conter cafeína; a resposta varia entre pessoas e não é necessário usar para treinar bem.",
  },
  {
    id: "pre-banana-cacau",
    title: "Vitamina Energética de Banana com Cacau",
    category: "Pré-treino",
    timing: "45 a 60 minutos antes do treino",
    ingredients: [
      "1 banana madura",
      "1 colher de sopa de cacau 100% em pó",
      "200 ml de leite (ou bebida vegetal)",
      "1 colher de sopa de aveia em flocos",
    ],
    preparation: "Bata todos os ingredientes no liquidificador até obter uma textura homogênea e cremosa.",
    benefits: "Combina carboidratos e potássio em uma opção simples; ajuste a quantidade ao seu objetivo e à sua tolerância.",
  },
  {
    id: "pos-ovos-aveia",
    title: "Panqueca Proteica de Banana e Aveia",
    category: "Pós-treino",
    timing: "Até 1 hora após o treino",
    ingredients: [
      "2 ovos inteiros",
      "1 banana amassada",
      "3 colheres de sopa de aveia em flocos",
      "Pitada de canela em pó",
    ],
    preparation: "Amasse a banana, misture com os ovos, a aveia e a canela. Despeje em frigideira antiaderente untada e doure dos dois lados.",
    benefits: "Combina proteína e carboidratos em uma refeição prática para apoiar a recuperação após o treino.",
  },
  {
    id: "pos-frango-mandioca",
    title: "Refeição Sólida Pós-Treino (Frango & Mandioca)",
    category: "Pós-treino",
    timing: "No almoço ou jantar pós-treino",
    ingredients: [
      "120g de peito de frango grelhado desfiado",
      "100g de mandioca (aipim) cozida",
      "Salada verde a vontade com azeite de oliva extra virgem",
    ],
    preparation: "Grele o frango com temperos naturais, sirva acompanhado da mandioca cozida e regue a salada com azeite.",
    benefits: "Combina proteína, carboidratos e vegetais em uma refeição completa; as quantidades devem ser individualizadas.",
  },
];
