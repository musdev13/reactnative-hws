import { AIModelOption } from "@/types";

export const AVAILABLE_MODELS: AIModelOption[] = [
  {
    id: "openrouter/free",
    name: "OpenRouter Free Router (Auto)",
    description: "Автоматичний розумний вибір вільної безкоштовної моделі.",
    isFree: true,
    pricing: "Безкоштовно",
    tier: "free",
  },
  {
    id: "nvidia/nemotron-3-ultra-550b-a55b:free",
    name: "NVIDIA Nemotron 3 Ultra 550B",
    description: "Потужна безкоштовна модель для глибоких мовних діалогів.",
    isFree: true,
    pricing: "Безкоштовно",
    tier: "free",
  },
  {
    id: "openai/gpt-4o-mini",
    name: "OpenAI: GPT-4o-mini",
    description:
      "Еталон швидкості та точного мовного аналізу від OpenAI (~$0.15/1M токенів).",
    isFree: false,
    pricing: "~$0.15 / 1M",
    tier: "budget",
  },
  {
    id: "anthropic/claude-haiku-4.5",
    name: "Anthropic: Claude Haiku 4.5",
    description: "Неймовірно жива, природна мова від Anthropic.",
    isFree: false,
    pricing: "~$1.00 / 1M",
    tier: "mid",
  },
];

export const DEFAULT_MODEL = "openrouter/free";