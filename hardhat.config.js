require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.19",
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache",
  },
  networks: {
    // This is the internal network used for 'npx hardhat node'
    hardhat: {
      chainId: 1337,
      blockGasLimit: 100000000, // High limit for ZK Verifier
    },
    // This is the network used for 'npx hardhat run --network localhost'
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
  },
};
