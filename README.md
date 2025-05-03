# 🌐 Blockchain Data Sharing Platform

A decentralized application (dApp) for secure, transparent, and user-controlled data sharing using **NFTs** and **IPFS**. Built with React, Solidity, and Hardhat.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.26-green)](https://docs.soliditylang.org/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)

---

## ✨ Features
- **Mint NFTs** to represent ownership of shared data/files.
- **IPFS Integration** for decentralized file storage.
- **Transfer/Burn NFTs** to manage data access rights.
- **Wallet Connect** (MetaMask support).
- **Responsive UI** with toast notifications.

---

## 🛠 Tech Stack
| Component       | Technology |
|-----------------|------------|
| Frontend        | React, Ethers.js, TailwindCSS |
| Smart Contracts | Solidity (ERC721, OpenZeppelin) |
| Storage         | IPFS (via kubo-rpc-client) |
| Wallet          | MetaMask/Web3 Provider |
| Testing         | Hardhat, Manual React Testing|

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MetaMask (or compatible wallet)
- IPFS node (local)
- 
### Installation
1. Clone the repo:
```bash
git clone https://olympus.ntu.ac.uk/N1357876/FYP/main
cd blockchain-data-sharing
```
2 . Install dependencies:
```bash
npm install
cd client && npm install
```
### Running the App:
1. Enusre that ports 4/5001, 8545 and 3000 are available

2. Start a local Hardhat node (in contracts dir):
```bash
cd contracts
npx hardhat node
``` 
3. Deploy contracts (in a new terminal):
```bash
cd contracts
npx hardhat ignition deploy ignition/modules/DataToken.ts --network localhost
```
4. Start IPFS daemon(in root dir):
```bash
ipfs daemon
```
5. Launch the frontend(in frontend dir):

```bash
cd frontend
npm run start
```

📜 Smart Contracts
| Components      | Description |
|---------------|------------|
DataToken.sol|	ERC721 NFT with mint/burn/transfer functionality.
Key Functions |	mint(), burnToken(), transferToken(), tokensOfOwner()
Deployed Addresses| Dynamically updated on Deployment: Symblink in frontend/NodeModules/chain to Contract ABI and Address json files


🌍 IPFS Setup

Files are pinned to IPFS via:

Local node (default: http://localhost:5001)

bash
```
ipfs daemon
```
## Running Tests
- Contract testing is done using the Mocha and Chai libraries
- They consist of assertions and expectations.
- To run tests, navigate to the contract directory and then run the following command

```bash
  cd contracts
  npx hardhat test test/DataToken.ts
```

📄 License
Distributed under the MIT License. See LICENSE for details.

🙏 Acknowledgments

OpenZeppelin Contracts

Hardhat

React
