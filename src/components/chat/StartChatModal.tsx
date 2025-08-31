import { useState } from "react";
import { Button } from "../auth/Button";
import { Input } from "../auth/Input";

interface StartChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, message?: string) => Promise<void>;
  isLoading?: boolean;
}

export function StartChatModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: StartChatModalProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      await onSubmit(email.trim(), message.trim() || undefined);
      setEmail("");
      setMessage("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to start chat");
    }
  };

  const handleClose = () => {
    setEmail("");
    setMessage("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-wp-header-bg rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-wp-text-primary mb-4">
            Start New Chat
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter recipient's email"
                value={email}
                onChange={setEmail}
                disabled={isLoading}
              />
            </div>

            <div>
              <textarea
                placeholder="Optional: Type your first message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-wp-border bg-wp-input-bg text-wp-text-primary placeholder-wp-text-secondary focus:outline-none focus:ring-2 focus:ring-wp-green resize-none"
              />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="flex-1"
              >
                {isLoading ? "Starting..." : "Start Chat"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
