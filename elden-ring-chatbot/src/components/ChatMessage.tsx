import type { Message } from "../types/Message";

type ChatMessageProps = {
  message: Message;
};

function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";

  return (
    <div className={`message-row ${isUser ? "user" : "bot"}`}>
      <div className={`message-bubble ${isUser ? "user" : "bot"}`}>
        <div className="message-label">{isUser ? "Du" : "Chatbot"}</div>
        <p>{message.text}</p>
      </div>
    </div>
  );
}

export default ChatMessage;