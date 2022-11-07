require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  networks:{
    matic:{
      url:"https://rpc-mumbai.maticvigil.com",
      accounts: ["06e4ddbbbf43430c3094acd951017d0b5bc836d88a14fa1e6c3b4d540b5c3176"] //Enter your private key here
    }
  },
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
};
