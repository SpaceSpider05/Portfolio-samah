import { getApiBaseUrl } from "@/services/api/client";

export type AiChatResult = {
  sessionId: string;
  reply: string;
  lead: Record<string, unknown> | null;
  bookingCreated: boolean;
  suggestions: string[];
};

export type AiSuggestionsResult = {
  assistant: string;
  enabled: boolean;
  suggestions: string[];
};

type StreamHandlers = {
  onMeta?: (data: { sessionId: string; suggestions: string[] }) => void;
  onToken?: (text: string) => void;
  onDone?: (data: AiChatResult) => void;
};

function stripLeadMarkers(text: string): string {
  return text
    .replace(/\[\[(PROFILE|LEAD|MEMORY):\{[\s\S]*?\}\]\]/g, "")
    .trim();
}

export async function fetchAiSuggestions(locale = "en"): Promise<AiSuggestionsResult> {
  const base = getApiBaseUrl();
  const response = await fetch(
    `${base}/api/v1/ai/suggestions?locale=${encodeURIComponent(locale)}`,
    { headers: { Accept: "application/json" }, cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Could not load AI suggestions.");
  }

  return response.json() as Promise<AiSuggestionsResult>;
}

export async function sendAiChat(input: {
  message: string;
  sessionId?: string | null;
  locale?: string;
  stream?: boolean;
  onMeta?: StreamHandlers["onMeta"];
  onToken?: StreamHandlers["onToken"];
  onDone?: StreamHandlers["onDone"];
}): Promise<AiChatResult> {
  const base = getApiBaseUrl();
  const stream = input.stream ?? true;

  const response = await fetch(`${base}/api/v1/ai/chat`, {
    method: "POST",
    headers: {
      Accept: stream ? "text/event-stream" : "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: input.message,
      sessionId: input.sessionId || undefined,
      locale: input.locale ?? "en",
      stream,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Samah AI could not reply right now.";
    try {
      const payload = (await response.json()) as { message?: string };
      if (payload.message) {
        message = payload.message;
      }
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  if (!stream) {
    const result = (await response.json()) as AiChatResult;
    result.reply = stripLeadMarkers(result.reply);
    input.onDone?.(result);
    return result;
  }

  if (!response.body) {
    throw new Error("Streaming is not supported in this browser.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalResult: AiChatResult | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      const lines = part.split("\n");
      let event = "message";
      let data = "";

      for (const line of lines) {
        if (line.startsWith("event:")) {
          event = line.slice(6).trim();
        }
        if (line.startsWith("data:")) {
          data += line.slice(5).trim();
        }
      }

      if (!data) {
        continue;
      }

      const parsed = JSON.parse(data) as Record<string, unknown>;

      if (event === "meta") {
        input.onMeta?.(parsed as { sessionId: string; suggestions: string[] });
      }

      if (event === "token" && typeof parsed.text === "string") {
        input.onToken?.(parsed.text);
      }

      if (event === "done") {
        finalResult = {
          sessionId: String(parsed.sessionId ?? ""),
          reply: stripLeadMarkers(String(parsed.reply ?? "")),
          lead: (parsed.lead as Record<string, unknown> | null) ?? null,
          bookingCreated: Boolean(parsed.bookingCreated),
          suggestions: Array.isArray(parsed.suggestions)
            ? (parsed.suggestions as string[])
            : [],
        };
        input.onDone?.(finalResult);
      }
    }
  }

  if (!finalResult) {
    throw new Error("The AI stream ended unexpectedly.");
  }

  return finalResult;
}
