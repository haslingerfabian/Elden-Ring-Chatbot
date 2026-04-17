import { CHAT_ENDPOINT } from "../config/api";

type ChatApiRequest = {
  message: string;
};

type ChatApiResponse = {
  question?: string;
  response?: string;
  sources?: Array<{
    datei?: string;
    seite?: number;
    auszug?: string;
  }>;
};

export async function sendChatMessage(message: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15000);

  try {
    const payload: ChatApiRequest = {
      message,
    };

    const response = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = (await response.json()) as ChatApiResponse;

    if (!data.response || typeof data.response !== "string") {
      throw new Error("Ungültige Backend-Antwort");
    }

    return data.response;
  } catch (error) {
    console.error("Fehler beim Chat-Request:", error);
    return "Das Backend ist aktuell nicht erreichbar oder liefert keine gültige Antwort.";
  } finally {
    window.clearTimeout(timeoutId);
  }
}