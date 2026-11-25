# Anom

Anom appears to be an anonymous on-chain confessions app — post a confession without attaching your identity to it, with the confession stored via a smart contract instead of a regular database.

## Features

- Appears to let users submit anonymous confessions through a web interface
- `Confessions.sol` smart contract appears to handle storing/retrieving confessions on-chain
- Wallet/blockchain interaction via ethers.js

## Tech Stack

- Vite, React 19, TypeScript
- Tailwind CSS 4
- ethers.js
- Solidity (`Confessions.sol`)

## Getting Started

Prerequisites: Node.js and npm, and a wallet / RPC setup for the network the contract is deployed to.

```bash
npm install
npm run dev
```

Create a `.env` file based on `.env.example` and fill in your own values before running — the app needs them to talk to the contract/network.

## Notes

- This README is based on the project's structure and contract; the confession flow appears to work as described above, but end-to-end behaviour against a live deployment hasn't been documented here.
