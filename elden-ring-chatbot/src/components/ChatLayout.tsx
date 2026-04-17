import { useState } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import SlideshowCard from "./SlideshowCard";
import { mockMessages } from "../data/mockMessages";
import { bosses } from "../data/bosses";
import { locations } from "../data/locations";
import { sendChatMessage } from "../services/chatApi";
import type { Message } from "../types/Message";
import backgroundImage from "../images/background.jpg";

function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: trimmed,
    };

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    const answer = await sendChatMessage(trimmed);

    const botMessage: Message = {
      id: crypto.randomUUID(),
      sender: "bot",
      text: answer,
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  return (
    <main
      className="page-shell"
      style={{
        backgroundImage: `linear-gradient(rgba(9, 8, 6, 0.8), rgba(9, 8, 6, 0.94)), url(${backgroundImage})`,
      }}
    >
      <div className="page-overlay" />

      <section className="chat-stage">
        <SlideshowCard data={bosses} align="left" />
        <SlideshowCard data={locations} align="right" />

        <div className="chat-core">
          <ChatWindow messages={messages} isLoading={isLoading} />
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            disabled={isLoading}
          />
        </div>
      </section>
    </main>
  );
}

export default ChatLayout;