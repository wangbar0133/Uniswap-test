require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.16",
      },
      {
        version: "0.6.6",
        settings: {},
      },
    ],
  },
  networks: {
    hardhat: {
      gasPrice: 875000000,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
  
    },
  }
};