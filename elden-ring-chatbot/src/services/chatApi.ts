import { CHAT_ENDPOINT } from "../config/api";
import type { Message } from "../types/Message";

type ChatApiRequest = {
  message: string;
  history: Message[];
};

type ChatApiResponse = {
  answer: string;
};

export async function sendChatMessage(
  message: string,
  history: Message[]
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15000);

  try {
    const payload: ChatApiRequest = {
      message,
      history,
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

    const data = (await response.json()) as Partial<ChatApiResponse>;

    if (!data.answer || typeof data.answer !== "string") {
      throw new Error("Ungültige Backend-Antwort");
    }

    return data.answer;
  } catch (error) {
    console.error("Fehler beim Chat-Request:", error);
    return "Das Backend ist aktuell nicht erreichbar oder liefert keine gültige Antwort.";
  } finally {
    window.clearTimeout(timeoutId);
  }
}