type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
}: ChatInputProps) {
  return (
    <div className="chat-input-shell">
      <input
        type="text"
        className="chat-input"
        placeholder="Frage nach Bossen, Gebieten oder Lore ..."
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !disabled) {
            onSend();
          }
        }}
      />
      <button
        className="chat-send-button"
        onClick={onSend}
        disabled={disabled}
      >
        {disabled ? "..." : "Senden"}
      </button>
    </div>
  );
}

export default ChatInput;