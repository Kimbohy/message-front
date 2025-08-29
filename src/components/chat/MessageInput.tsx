import { useRef } from "react";
import { AttachIcon, EmojiIcon, SendIcon } from "./Icons";

interface MessageInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function MessageInput({
  input,
  onInputChange,
  onSend,
  onKeyDown,
}: MessageInputProps) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <form
      onSubmit={onSend}
      className="p-4 bg-wp-header-bg border-t border-wp-border"
    >
      <div className="flex items-end gap-3">
        <button
          type="button"
          className="p-2.5 rounded-full hover:bg-wp-hover transition-all duration-200 text-wp-text-secondary hover:text-wp-text-primary"
        >
          <AttachIcon />
        </button>
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message"
            rows={1}
            className="w-full resize-none rounded-lg px-4 py-3 pr-12 outline-none text-sm bg-wp-input-bg border border-wp-border focus:border-wp-green text-wp-text-primary placeholder-wp-text-muted transition-all duration-200"
            style={{ maxHeight: "120px" }}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full hover:bg-wp-hover transition-all duration-200 text-wp-text-secondary hover:text-wp-text-primary"
          >
            <EmojiIcon />
          </button>
        </div>
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-3 rounded-full bg-wp-green hover:bg-wp-green-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-white"
        >
          <SendIcon />
        </button>
      </div>
    </form>
  );
}
