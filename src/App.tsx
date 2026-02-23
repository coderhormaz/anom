import { useWallet } from "./hooks/useWallet";
import { useConfessions } from "./hooks/useConfessions";
import WalletButton from "./components/WalletButton";
import ConfessionForm from "./components/ConfessionForm";
import ConfessionFeed from "./components/ConfessionFeed";

function App() {
  const wallet = useWallet();
  const { confessions, loading, error, postConfession, upvote, downvote } =
    useConfessions(wallet.account);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/40 to-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔮</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Anom
            </h1>
          </div>
          <WalletButton
            account={wallet.account}
            connecting={wallet.connecting}
            error={wallet.error}
            onConnect={wallet.connect}
            onDisconnect={wallet.disconnect}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Anonymous Confessions</h2>
          <p className="text-gray-400">
            On-chain, pseudonymous, and uncensorable. Powered by Base.
          </p>
        </div>

        {!wallet.account && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 text-yellow-400 text-sm mb-6 text-center w-full max-w-xl">
            Connect your wallet to post confessions and vote.
          </div>
        )}

        <ConfessionForm
          onSubmit={postConfession}
          disabled={!wallet.account}
        />

        <ConfessionFeed
          confessions={confessions}
          loading={loading}
          error={error}
          account={wallet.account}
          onUpvote={upvote}
          onDownvote={downvote}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12 py-6 text-center text-gray-500 text-sm">
        Built on Base · Confessions are stored on-chain forever
      </footer>
    </div>
  );
}

export default App;

