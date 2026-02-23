import type { ConfessionData } from "../utils/contract";

interface ConfessionFeedProps {
  confessions: ConfessionData[];
  loading: boolean;
  error: string | null;
  account: string | null;
  onUpvote: (id: number) => Promise<void>;
  onDownvote: (id: number) => Promise<void>;
}

function shortenAddress(addr: string): string {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function timeAgo(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(timestamp * 1000).toLocaleDateString();
}

function ConfessionCard({
  confession,
  account,
  onUpvote,
  onDownvote,
}: {
  confession: ConfessionData;
  account: string | null;
  onUpvote: (id: number) => Promise<void>;
  onDownvote: (id: number) => Promise<void>;
}) {
  const handleVote = async (dir: "up" | "down") => {
    try {
      if (dir === "up") await onUpvote(confession.id);
      else await onDownvote(confession.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Vote failed");
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200">
      <p className="text-white text-base leading-relaxed mb-4">{confession.text}</p>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3 text-gray-400">
          <span className="font-mono bg-white/10 px-2 py-0.5 rounded-lg text-xs">
            {shortenAddress(confession.wallet)}
          </span>
          <span>{timeAgo(confession.timestamp)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote("up")}
            disabled={!account}
            className="flex items-center gap-1 text-green-400 hover:bg-green-400/20 disabled:opacity-30 disabled:cursor-not-allowed px-2 py-1 rounded-lg transition-all"
            title={account ? "Upvote" : "Connect wallet to vote"}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <span
            className={`font-bold min-w-[2rem] text-center ${
              confession.votes > 0
                ? "text-green-400"
                : confession.votes < 0
                ? "text-red-400"
                : "text-gray-400"
            }`}
          >
            {confession.votes}
          </span>
          <button
            onClick={() => handleVote("down")}
            disabled={!account}
            className="flex items-center gap-1 text-red-400 hover:bg-red-400/20 disabled:opacity-30 disabled:cursor-not-allowed px-2 py-1 rounded-lg transition-all"
            title={account ? "Downvote" : "Connect wallet to vote"}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConfessionFeed({
  confessions,
  loading,
  error,
  account,
  onUpvote,
  onDownvote,
}: ConfessionFeedProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-gray-400">
        <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p>Loading confessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-yellow-400 mb-2">{error}</p>
        <p className="text-gray-500 text-sm">
          You can still explore the UI. Connect a wallet and deploy the contract to get started.
        </p>
      </div>
    );
  }

  if (confessions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-2xl mb-2">No confessions yet</p>
        <p className="text-sm">Be the first to confess anonymously on-chain.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl space-y-4">
      <p className="text-gray-400 text-sm mb-2">{confessions.length} confession{confessions.length !== 1 ? "s" : ""}</p>
      {confessions.map((confession) => (
        <ConfessionCard
          key={confession.id}
          confession={confession}
          account={account}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
        />
      ))}
    </div>
  );
}
