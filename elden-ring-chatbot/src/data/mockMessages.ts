import type { Message } from "../types/Message";

export const mockMessages: Message[] = [
  {
    id: "1",
    sender: "bot",
    text: "Willkommen. Du kannst Fragen zu Bossen, Waffen, Gebieten, Charakteren oder zur allgemeinen Lore von Elden Ring stellen.",
  },
  {
    id: "2",
    sender: "user",
    text: "Wer ist Radahn?",
  },
  {
    id: "3",
    sender: "bot",
    text: "Radahn ist einer der bekanntesten Halbgötter in Elden Ring. Er ist vor allem für seine enorme Kampfkraft und seine Verbindung zur Gravitationsmagie bekannt.",
  },
];