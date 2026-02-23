import { ethers } from "ethers";

// Replace with your deployed contract address on Base Mainnet
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS ?? "";

// ABI matching the fixed Confessions.sol contract
export const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "string", name: "text", type: "string" }],
    name: "postConfession",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "upvote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "downvote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getConfessionCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "getConfession",
    outputs: [
      {
        components: [
          { internalType: "string", name: "text", type: "string" },
          { internalType: "address", name: "wallet", type: "address" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "int256", name: "votes", type: "int256" },
        ],
        internalType: "struct Confessions.ConfessionView",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getConfessions",
    outputs: [
      {
        components: [
          { internalType: "string", name: "text", type: "string" },
          { internalType: "address", name: "wallet", type: "address" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "int256", name: "votes", type: "int256" },
        ],
        internalType: "struct Confessions.ConfessionView[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "address", name: "voter", type: "address" },
    ],
    name: "hasVoted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
      { indexed: false, internalType: "string", name: "text", type: "string" },
      { indexed: true, internalType: "address", name: "wallet", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "ConfessionPosted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
      { indexed: true, internalType: "address", name: "voter", type: "address" },
      { indexed: false, internalType: "int256", name: "votes", type: "int256" },
    ],
    name: "Voted",
    type: "event",
  },
] as const;

// Base Mainnet chain config
export const BASE_CHAIN_ID = 8453;
export const BASE_RPC_URL = "https://mainnet.base.org";

export interface ConfessionData {
  id: number;
  text: string;
  wallet: string;
  timestamp: number;
  votes: number;
}

/** Get a read-only provider for Base Mainnet */
export function getReadProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(BASE_RPC_URL);
}

/** Get a read-only contract instance */
export function getReadContract(): ethers.Contract {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, getReadProvider());
}

/** Get a browser-wallet provider (MetaMask, etc.) */
export function getBrowserProvider(): ethers.BrowserProvider | null {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
}

/** Get a contract instance connected to the browser wallet signer */
export async function getSignerContract(): Promise<ethers.Contract> {
  const provider = getBrowserProvider();
  if (!provider) throw new Error("No wallet detected");
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

/** Ensure the user is on Base Mainnet, prompt to switch if not */
export async function ensureBaseNetwork(): Promise<void> {
  if (!window.ethereum) throw new Error("No wallet detected");

  const chainId = (await window.ethereum.request({ method: "eth_chainId" })) as string;
  if (parseInt(chainId, 16) !== BASE_CHAIN_ID) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + BASE_CHAIN_ID.toString(16) }],
      });
    } catch (switchError: unknown) {
      // Chain not added yet — add it
      if (
        typeof switchError === "object" &&
        switchError !== null &&
        "code" in switchError &&
        (switchError as { code: number }).code === 4902
      ) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x" + BASE_CHAIN_ID.toString(16),
              chainName: "Base Mainnet",
              nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
              rpcUrls: [BASE_RPC_URL],
              blockExplorerUrls: ["https://basescan.org"],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  }
}
