interface WalletButtonProps {
  account: string | null;
  connecting: boolean;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

function shortenAddress(addr: string): string {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export default function WalletButton({
  account,
  connecting,
  error,
  onConnect,
  onDisconnect,
}: WalletButtonProps) {
  if (account) {
    return (
      <div className="flex items-center gap-3">
        <span className="bg-green-500/20 text-green-400 px-3 py-1.5 rounded-xl text-sm font-mono">
          {shortenAddress(account)}
        </span>
        <button
          onClick={onDisconnect}
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onConnect}
        disabled={connecting}
        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2"
      >
        {connecting ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Connecting...
          </>
        ) : (
          "Connect Wallet"
        )}
      </button>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
