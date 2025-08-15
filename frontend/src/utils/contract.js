import { ethers } from 'ethers';

// Replace with your deployed contract address
const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';

// Replace with your contract's ABI
const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "text", "type": "string" }
    ],
    "name": "postConfession",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "upvote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "downvote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getConfessions",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "text", "type": "string" },
          { "internalType": "address", "name": "wallet", "type": "address" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "int256", "name": "votes", "type": "int256" }
        ],
        "internalType": "struct Confessions.Confession[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const getContract = (providerOrSigner) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, providerOrSigner);
};
