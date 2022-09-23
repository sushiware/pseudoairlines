import { Goerli, Mainnet, Chain } from "@usedapp/core";

type Network = "homestead" | "mainnet" | "goerli" | "";

const load = () => {
  let networkName: Network = "";
  switch (process.env.NETWORK) {
    case "homestead":
    case "mainnet":
      networkName = "homestead";
    case "goerli":
      networkName = "goerli";
  }

  console.log("networkName", networkName, process.env.NETWORK);

  const url = {
    "": "http://127.0.0.1:8545",
    homestead: process.env.MAINNET_RPC_URL || "",
    goerli: process.env.GOERLI_RPC_URL || "",
  }[networkName];

  const contracts = {
    airticket: {
      "": "0x5fbdb2315678afecb367f032d93f642f64180aa3",
      homestead: "",
      goerli: "0x79E4f1353741f2a8bC558285fB39326C4a6f6f9f",
    }[networkName],
  };

  const network = {
    "": Localhost,
    homestead: Mainnet,
    goerli: Goerli,
  }[networkName];

  return {
    network,
    url,
    contracts,
  };
};

const Localhost: Chain = {
  chainId: 31337,
  chainName: "Localhost",
  isTestChain: true,
  isLocalChain: true,
  multicallAddress: "",
  multicall2Address: "",
  blockExplorerUrl: "",
  getExplorerAddressLink: () => "",
  getExplorerTransactionLink: () => "",
};

export const AppConfig = load();
