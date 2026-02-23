import { useState } from "react";

interface ConfessionFormProps {
  onSubmit: (text: string) => Promise<void>;
  disabled: boolean;
}

export default function ConfessionForm({ onSubmit, disabled }: ConfessionFormProps) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const charCount = text.length;
  const isValid = charCount > 0 && charCount <= 280;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(text);
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post confession");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mb-8">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your anonymous confession..."
          className="w-full bg-transparent text-white placeholder-gray-400 border border-white/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          rows={4}
          maxLength={280}
          disabled={disabled || submitting}
        />
        <div className="flex items-center justify-between mt-3">
          <span
            className={`text-sm ${
              charCount > 260
                ? charCount > 280
                  ? "text-red-400"
                  : "text-yellow-400"
                : "text-gray-400"
            }`}
          >
            {charCount}/280
          </span>
          <button
            type="submit"
            disabled={!isValid || disabled || submitting}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-xl transition-all duration-200"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Posting...
              </span>
            ) : (
              "Confess"
            )}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>
    </form>
  );
}
