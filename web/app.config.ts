type Network = "homestead" | "goerli" | "";

const load = () => {
  let network: Network = "";
  switch (process.env.NETWORK) {
    case "homestead":
      network = "homestead";
    case "goerli":
      network = "goerli";
  }

  const url = {
    "": "http://127.0.0.1:8545",
    homestead: process.env.MAINNET_RPC_URL || "",
    goerli: process.env.GOERLI_URL || "",
  }[network];

  const chainId: number = {
    "": 31337,
    homestead: 1,
    goerli: 5,
  }[network];

  const contracts = {
    nigiri: {
      "": "0x5fbdb2315678afecb367f032d93f642f64180aa3",
      homestead: "",
      goerli: "",
    }[network],
  };

  return {
    network,
    chainId,
    url,
    contracts,
  };
};

export const AppConfig = load();
