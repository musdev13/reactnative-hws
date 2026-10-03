export type LanguageLevel = "A2" | "B1" | "B2";

export type AIModelTier = "free" | "budget" | "mid" | "flagship";

export interface RoleplayScenario {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  partnerRole: string;
  description: string;
  initialPromptHint: string;
  levelRecommendations: Record<LanguageLevel, string>;
}

export interface FeedbackData {
  hasCorrection: boolean;
  correction: string;
  betterPhrasing: string;
}

export interface RoleplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  feedback?: FeedbackData;
  timestamp: number;
}

export interface AIModelOption {
  id: string;
  name: string;
  description: string;
  isFree: boolean;
  pricing?: string;
  tier?: AIModelTier;
}

export interface VocabularyItem {
  id?: string;
  original: string;
  better: string;
  tip?: string;
  timestamp?: number;
}