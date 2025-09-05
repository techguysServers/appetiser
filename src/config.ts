export type SubStep = {
  title: string;
  hours: number;
  complexity: "Faible" | "Moyenne" | "Élevée";
  description: string;
};

export type Step = {
  id: number;
  name: string;
  // Detailed estimation inputs
  hours?: number; // minimal hours when no subSteps
  // complexity is intentionally omitted; derived from subSteps mean
  complexity?: number;
  color: string;
  subSteps?: SubStep[];
  backendNotes?: string[];
  tablesRequired?: string[];
  // When true, disable max range multiplier; display hoursMax as 1h and set costMax to 0
  disableMaxMultiplier?: boolean;
};

export type ProjectMonth = {
  name: string;
  percent: number; // 0..1 portion of the total budget
};

// Compute global step complexity as the mean of sub-steps (linear, not rounded)
export const COMPLEXITY_SCORE: Record<SubStep["complexity"], number> = {
  Faible: 1,
  Moyenne: 3,
  Élevée: 7,
};

export const SIGN_LINK =
  "https://app.pandadoc.com/p/1f3795134854bb7adbc5bdeca8423cfd9b2c30f7?openingSource=fillAndSign";
export const COST_PER_HOUR = 125;
export const HOURS_MAX_MULTIPLIER = 1.2;

// Configure project duration and monthly budget allocation
export const PROJECT_SCHEDULE: ProjectMonth[] = [
  { name: "Mois 1", percent: 0.1 },
  { name: "Mois 2", percent: 0.2 },
  { name: "Mois 3", percent: 0.2 },
  { name: "Mois 4", percent: 0.2 },
  { name: "Mois 5", percent: 0.3 },
];

export const STEPS: Step[] = [
  {
    id: 1,
    name: "Authentification et intégration",
    disableMaxMultiplier: true,
    color: "#0EA5E9",
    subSteps: [
      {
        title: "Écran de connexion",
        hours: 3,
        complexity: "Faible",
        description: "Login email/mot de passe, validation",
      },
      {
        title: "Écran d'inscription",
        hours: 5,
        complexity: "Moyenne",
        description: "Formulaire complet avec validation",
      },
      {
        title: "Récupération mot de passe",
        hours: 4,
        complexity: "Faible",
        description: "Flow de reset password",
      },
    ],
  },
  {
    id: 2,
    name: "Design et UI/UX",
    color: "#10B981",
    disableMaxMultiplier: true,
    subSteps: [
      {
        title: "Wireframes toutes vues",
        hours: 12,
        complexity: "Moyenne",
        description: "Structures basiques écrans",
      },
    ],
  },
  {
    id: 3,
    name: "Navigation et interface principale",
    color: "#6366F1",
    subSteps: [
      {
        title: "Dashboard principal",
        hours: 13,
        complexity: "Élevée",
        description: "Vue d'ensemble, stats, accès rapide",
      },
      {
        title: "Navigation (tabs/drawer)",
        hours: 5,
        complexity: "Moyenne",
        description: "Menu principal de l'app",
      },
      {
        title: "Profil utilisateur",
        hours: 10,
        complexity: "Moyenne",
        description: "Infos personnelles, stats, badges",
      },
      {
        title: "Paramètres",
        hours: 7,
        complexity: "Faible",
        description: "Préférences, notifications, langue",
      },
    ],
  },
  {
    id: 4,
    name: "Système de quiz",
    color: "#F43F5E",
    subSteps: [
      {
        title: "Sélection catégorie médicale",
        hours: 2,
        complexity: "Faible",
        description: "Cardiologie, neurologie, etc.",
      },
      {
        title: "Sélection niveau",
        hours: 2,
        complexity: "Faible",
        description: "Pré-clinique, clinique, examens",
      },
      {
        title: "Interface quiz (QCM)",
        hours: 20,
        complexity: "Élevée",
        description: "Questions, timer, progression",
      },
      {
        title: "Résultats + explications",
        hours: 10,
        complexity: "Élevée",
        description: "Score, corrections détaillées",
      },
      {
        title: "Historique quiz",
        hours: 5,
        complexity: "Moyenne",
        description: "Performance passée, simple",
      },
    ],
  },
  {
    id: 5,
    name: "Gamification",
    color: "#A855F7",
    subSteps: [
      {
        title: "Système de points",
        hours: 13,
        complexity: "Élevée",
        description: "Calcul scores, progression",
      },
      {
        title: "Badges et récompenses",
        hours: 10,
        complexity: "Moyenne",
        description: "Collection badges, animations",
      },
      {
        title: "Niveaux et paliers",
        hours: 8,
        complexity: "Moyenne",
        description: "Système de niveaux utilisateur",
      },
      {
        title: "Classements",
        hours: 15,
        complexity: "Élevée",
        description: "Global, université, amis",
      },
      {
        title: "Statistiques détaillées",
        hours: 8,
        complexity: "Moyenne",
        description: "Graphiques performance",
      },
    ],
  },
  {
    id: 6,
    name: "Aspect social",
    color: "#F59E0B",
    disableMaxMultiplier: true,
    subSteps: [
      {
        title: "Liste d'amis",
        hours: 10,
        complexity: "Moyenne",
        description: "Recherche, ajout amis",
      },
    ],
  },
  {
    id: 7,
    name: "Administration",
    color: "#14B8A6",
    subSteps: [
      {
        title: "Dashboard admin",
        hours: 12,
        complexity: "Élevée",
        description: "Vue d'ensemble système basique",
      },
      {
        title: "Gestion contenu (CRUD)",
        hours: 12,
        complexity: "Élevée",
        description: "Créer/modifier quiz",
      },
      {
        title: "Gestion utilisateurs",
        hours: 6,
        complexity: "Moyenne",
        description: "Modération, support",
      },
    ],
  },
  {
    id: 8,
    name: "Internationalisation",
    color: "#22C55E",
    disableMaxMultiplier: true,
    subSteps: [
      {
        title: "Sélection pays/langue",
        hours: 2,
        complexity: "Faible",
        description: "Interface de sélection Canada/US, FR/EN",
      },
      {
        title: "Configuration i18n",
        hours: 4,
        complexity: "Moyenne",
        description: "Setup React Native i18n",
      },
      {
        title: "Traduction textes",
        hours: 6,
        complexity: "Faible",
        description: "Traduction FR/EN interface",
      },
    ],
  },
  {
    id: 9,
    name: "Système d'abonnement",
    color: "#3B82F6",
    subSteps: [
      {
        title: "Écran plans d'abonnement",
        hours: 11,
        complexity: "Élevée",
        description: "Interface choix mensuel/annuel",
      },
      {
        title: "Paywall/upgrade prompts",
        hours: 6,
        complexity: "Moyenne",
        description: "Incitations à s'abonner",
      },
      {
        title: "Gestion abonnement utilisateur",
        hours: 9,
        complexity: "Moyenne",
        description: "Voir/modifier/annuler abonnement",
      },
      {
        title: "États premium/gratuit",
        hours: 10,
        complexity: "Élevée",
        description: "Logique d'accès aux fonctionnalités",
      },
      {
        title: "Écrans de confirmation paiement",
        hours: 4,
        complexity: "Moyenne",
        description: "Success/erreur paiement",
      },
    ],
  },
  {
    id: 10,
    name: "Tests et qualité",
    color: "#EF4444",
    subSteps: [
      {
        title: "Tests intégration",
        hours: 8,
        complexity: "Moyenne",
        description: "Tests flux complets",
      },
      {
        title: "Tests performance",
        hours: 8,
        complexity: "Moyenne",
        description: "Optimisation vitesse",
      },
      {
        title: "Debugging",
        hours: 9,
        complexity: "Moyenne",
        description: "Correction bugs",
      },
    ],
  },
  {
    id: 11,
    name: "Déploiement",
    color: "#8B5CF6",
    disableMaxMultiplier: true,
    subSteps: [
      {
        title: "Config stores (iOS/Android)",
        hours: 6,
        complexity: "Moyenne",
        description: "Publication App Store/Play Store basique",
      },
    ],
  },
];

export const TIMELINE_DATA = [
  {
    month: "Mois 1",
    planning: 30,
    development: 0,
    testing: 0,
    deployment: 0,
  },
  {
    month: "Mois 2",
    planning: 60,
    development: 20,
    testing: 0,
    deployment: 0,
  },
  {
    month: "Mois 3",
    planning: 100,
    development: 50,
    testing: 10,
    deployment: 0,
  },
  {
    month: "Mois 4",
    planning: 100,
    development: 80,
    testing: 40,
    deployment: 10,
  },
  {
    month: "Mois 5",
    planning: 100,
    development: 100,
    testing: 100,
    deployment: 100,
  },
];
