import { OpenRouter } from "@openrouter/sdk";
import * as FileSystem from "expo-file-system/legacy";
import { getApiKey, getSelectedModel } from "./storage";
import { AVAILABLE_MODELS, DEFAULT_MODEL } from "@/constants/models";
import { FeedbackData } from "@/types";

export interface SendRoleplayOptions {
  systemPrompt: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
  userMessage?: string;
}

export interface ParsedRoleplayResponse {
  reply: string;
  feedback: FeedbackData;
}

export async function sendRoleplayMessage({
  systemPrompt,
  history,
  userMessage,
}: SendRoleplayOptions): Promise<ParsedRoleplayResponse> {
  const apiKey = await getApiKey();
  if (!apiKey) {
    throw new Error(
      "API-ключ OpenRouter відсутній. Вкажіть ключ у налаштуваннях."
    );
  }

  const savedModel = await getSelectedModel();
  const validModelIds = AVAILABLE_MODELS.map((m) => m.id);
  const model =
    savedModel && validModelIds.includes(savedModel) ? savedModel : DEFAULT_MODEL;

  const client = new OpenRouter({
    apiKey: apiKey,
    httpReferer:
      "https://github.com/react-native-lessons/ai-language-coach",
    appTitle: "AI Language Roleplay Coach",
  });

  const messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }> = [{ role: "system", content: systemPrompt }, ...history];

  if (userMessage) {
    messages.push({ role: "user", content: userMessage });
  }

  try {
    const response = await client.chat.send({
      chatRequest: {
        model: model,
        messages: messages,
        temperature: 0.7,
        maxTokens: 1000,
        stream: false,
        reasoning: { effort: "none" },
      },
    });

    if (
      !("choices" in response) ||
      !response.choices ||
      response.choices.length === 0
    ) {
      throw new Error("Модель повернула порожню відповідь.");
    }

    const choice = response.choices[0];
    let rawContent = "";

    if (typeof choice.message?.content === "string") {
      rawContent = choice.message.content;
    } else if (Array.isArray(choice.message?.content)) {
      rawContent = (choice.message.content as Array<{ text?: string }>)
        .map((i) => i.text || "")
        .join("");
    }

    return cleanAndParseRoleplayResponse(rawContent);
  } catch (error: any) {
    if (error?.status === 401 || error?.statusCode === 401) {
      throw new Error(
        "Невірний API-ключ OpenRouter. Перевірте його у вкладці Налаштування."
      );
    }
    if (error?.status === 429 || error?.statusCode === 429) {
      throw new Error(
        "Перевищено ліміт запитів до моделі. Спробуйте через хвилину або оберіть іншу модель."
      );
    }
    throw new Error(error?.message || "Помилка зв'язку з AI-сервісом.");
  }
}

/**
 * Очищає відповідь AI від тегів роздумів (<think>, <thought>, Thinking Process: ...)
 * та надійно витягує репліку й аналіз помилок
 */
export function cleanAndParseRoleplayResponse(
  rawContent: string
): ParsedRoleplayResponse {
  let text = (rawContent || "").trim();

  // 1. Очищення тегів роздумів
  text = text.replace(
    /<(?:think|thought|reasoning|reflection|thought-process)>[\s\S]*?<\/(?:think|thought|reasoning|reflection|thought-process)>/gi,
    ""
  );
  text = text.replace(
    /<(?:think|thought|reasoning|reflection|thought-process)>[\s\S]*$/gi,
    ""
  );
  text = text.replace(
    /(?:^|\n)(?:\*{0,2}Thinking Process:?\*{0,2}|\*{0,2}Thought:?\*{0,2}|\*{0,2}Reasoning:?\*{0,2})[\s\S]*?(?=\n\{|\n\n\{|\n```|$)/gi,
    ""
  );
  text = text.trim();

  // 2. Очищення markdown-блоків ```json ... ```
  if (text.includes("```")) {
    const mdMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (mdMatch && mdMatch[1]) text = mdMatch[1].trim();
  }

  // 3. Спроба прямого парсингу JSON
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  const jsonCandidate =
    firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace
      ? text.substring(firstBrace, lastBrace + 1)
      : text;

  try {
    const parsed = JSON.parse(jsonCandidate);
    if (
      parsed &&
      typeof parsed.reply === "string" &&
      parsed.reply.trim().length > 0
    ) {
      return {
        reply: sanitizeReply(parsed.reply),
        feedback: {
          hasCorrection: Boolean(parsed.hasCorrection),
          correction: String(parsed.correction || "").trim(),
          betterPhrasing: String(parsed.betterPhrasing || "").trim(),
        },
      };
    }
  } catch {}

  // 4. Резервний витяг полів через регулярні вирази
  const reply = extractField(text, "reply");
  const correction = extractField(text, "correction") || "";
  const betterPhrasing = extractField(text, "betterPhrasing") || "";
  const hasCorrectionMatch = text.match(/"hasCorrection"\s*:\s*(true|false)/i);
  const hasCorrection = hasCorrectionMatch
    ? hasCorrectionMatch[1].toLowerCase() === "true"
    : Boolean(correction.trim());

  if (reply && reply.trim().length > 0) {
    return {
      reply: sanitizeReply(reply),
      feedback: {
        hasCorrection,
        correction: correction.trim(),
        betterPhrasing: betterPhrasing.trim(),
      },
    };
  }

  // 5. Резервний варіант: чистий текст
  const plainReply = text
    .replace(/\{[\s\S]*?"reply"\s*:\s*"?/i, "")
    .replace(/"?,?\s*"hasCorrection"[\s\S]*/i, "")
    .replace(/[{}"]/g, "")
    .trim();

  return {
    reply:
      sanitizeReply(plainReply) ||
      "I understand. Let's continue our conversation!",
    feedback: {
      hasCorrection: false,
      correction: "",
      betterPhrasing: "",
    },
  };
}

function extractField(src: string, key: string): string | null {
  const r = new RegExp('"' + key + '"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"', "i");
  const m = src.match(r);
  if (m && m[1] !== undefined) {
    try {
      return JSON.parse('"' + m[1] + '"');
    } catch {
      return m[1].replace(/\\"/g, '"').replace(/\\n/g, "\n");
    }
  }
  return null;
}

function sanitizeReply(text: string): string {
  return String(text || "")
    .replace(
      /<(?:think|thought|reasoning|reflection|thought-process)>[\s\S]*?<\/(?:think|thought|reasoning|reflection|thought-process)>/gi,
      ""
    )
    .replace(
      /<(?:think|thought|reasoning|reflection|thought-process)>[\s\S]*$/gi,
      ""
    )
    .replace(
      /(?:^|\n)(?:\*{0,2}Thinking Process:?\*{0,2}|\*{0,2}Thought:?\*{0,2}|\*{0,2}Reasoning:?\*{0,2})[\s\S]*?(?=\n|$)/gi,
      ""
    )
    .trim();
}

/**
 * Транскрипція аудіо через OpenAI Whisper на OpenRouter
 */
export async function transcribeAudio(audioUri: string): Promise<string> {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error("API-ключ OpenRouter відсутній.");

  const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const format = audioUri.endsWith(".wav") ? "wav" : "m4a";

  const response = await fetch(
    "https://openrouter.ai/api/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          "https://github.com/react-native-lessons/ai-language-coach",
        "X-Title": "AI Language Roleplay Coach",
      },
      body: JSON.stringify({
        model: "openai/whisper-large-v3",
        input_audio: {
          data: base64Audio,
          format: format,
        },
        language: "en",
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Помилка розпізнавання голосу через Whisper AI.");
  }

  const data = await response.json();
  return (data.text || "").trim();
}