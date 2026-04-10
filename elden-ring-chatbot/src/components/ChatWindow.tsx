import { useEffect, useRef } from "react";
import type { Message } from "../types/Message";
import ChatMessage from "./ChatMessage";

type ChatWindowProps = {
  messages: Message[];
};

function ChatWindow({ messages }: ChatWindowProps) {
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!bodyRef.current) return;
    bodyRef.current.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <section className="chat-window">
      <div className="chat-window-header">
        <div>
          <p className="chat-kicker">ELDEN RING WISSENSARCHIV</p>
          <h1>Elden Ring Bot</h1>
        </div>
        <div className="chat-status">
          <span className="chat-status-dot" />
          <span>Online</span>
        </div>
      </div>

      <div className="chat-window-body" ref={bodyRef}>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
    </section>
  );
}

export default ChatWindow;