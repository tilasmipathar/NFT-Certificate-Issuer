# Blockchain Based Digital Certificate Locker Using NFTs

## Technology Stack & Tools

- Solidity (Writing Smart Contract)
- Javascript (React)
- [Ethers](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ipfs](https://ipfs.io/) (Metadata storage)
- [React routers](https://v5.reactrouter.com/) (Navigational components)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/), should work with any node version below 16.5.0
- Install [Hardhat](https://hardhat.org/)

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
```
$ npm install
```
### 3. Deploy on polygon mumbai testnet blockchain
```
$ npx hardhat run src/backend/scripts/deploy.js --network matic
```

### 4. Connect development blockchain accounts to Metamask
- Copy private key of the addresses and import to Metamask
- Add a new network to metamask using the following details -
  
  Network Name: Mumbai Testnet

  New RPC URL: https://rpc-mumbai.maticvigil.com

  Chain ID: 80001

  Currency Symbol: MATIC

  Block Explorer URL: https://polygonscan.com/

### 5. Launch Frontend
`$ npm run start`

### 6. Open Mainindex.html in /public Directory

