import React, { useState, useEffect } from 'react';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { ethers } from 'ethers';
import ConfessionForm from './components/ConfessionForm';
import ConfessionFeed from './components/ConfessionFeed';
import { getContract } from './utils/contract';

const { chains, provider } = configureChains(
  [
    { id: 8453, name: 'Base Mainnet', rpcUrls: ['https://mainnet.base.org'] },
  ],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
});

function App() {
  const [confessions, setConfessions] = useState([]);

  const fetchConfessions = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = getContract(provider);
      const data = await contract.getConfessions();
      setConfessions(data.map((confession) => ({
        text: confession.text,
        wallet: confession.wallet,
        timestamp: confession.timestamp.toNumber(),
        votes: confession.votes.toNumber(),
      })));
    } catch (error) {
      console.error('Error fetching confessions:', error);
    }
  };

  const handlePostConfession = async (text) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = getContract(signer);
      const tx = await contract.postConfession(text);
      await tx.wait();
      fetchConfessions();
    } catch (error) {
      console.error('Error posting confession:', error);
    }
  };

  const handleUpvote = async (index) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = getContract(signer);
      const tx = await contract.upvote(index);
      await tx.wait();
      fetchConfessions();
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const handleDownvote = async (index) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = getContract(signer);
      const tx = await contract.downvote(index);
      await tx.wait();
      fetchConfessions();
    } catch (error) {
      console.error('Error downvoting:', error);
    }
  };

  useEffect(() => {
    fetchConfessions();
  }, []);

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <h1 className="text-2xl font-bold mb-4">On-Chain Pseudonymous Confessions</h1>
          <ConnectButton />
          <ConfessionForm onSubmit={handlePostConfession} />
          <ConfessionFeed
            confessions={confessions}
            onUpvote={handleUpvote}
            onDownvote={handleDownvote}
          />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
