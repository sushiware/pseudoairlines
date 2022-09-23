import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Airticket__factory } from "../typechain/factories/Airticket__factory";
import { AppConfig } from "../app.config";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useEtherBalance, useEthers, useContractFunction } from "@usedapp/core";

const Home: NextPage = () => {
  type State =
    | "connect_wallet"
    | "connected"
    | "invalid_network"
    | "non_enough_ether"
    | "mintable"
    | "minting"
    | "success"
    | "fail"
    | "exception";

  const [amount, setAmount] = useState(1);
  const [currentFee, setCurrentFee] = useState(ethers.constants.Zero);
  const [supply, setSupply] = useState({ max: 0, total: 0 });
  const [buttonState, setButtonState] = useState({
    message: "",
    color: "",
    disabled: false,
  });
  const [state, setState] = useState<State>("connect_wallet");

  const {
    library,
    activateBrowserWallet,
    account,
    deactivate,
    chainId,
    switchNetwork,
    error,
  } = useEthers();
  const etherBalance = useEtherBalance(account);

  const airticket = Airticket__factory.connect(
    AppConfig.contracts.airticket,
    library || new JsonRpcProvider(AppConfig.url)
  );

  const { state: mintState, send: mint } = useContractFunction(
    airticket,
    "mint"
  );

  useEffect(() => {
    if (!error) {
      return setState("connect_wallet");
    }

    switch (error.name) {
      case "ChainIdError":
        return setState("invalid_network");
    }
  }, [error]);

  useEffect(() => {
    // export type TransactionState = 'None' | 'PendingSignature' | 'Mining' | 'Success' | 'Fail' | 'Exception'
    switch (mintState.status) {
      case "Mining":
        return setState("minting");
      case "Success":
        return setState("success");
      case "Fail":
        return setState("fail");
      case "Exception":
        return setState("exception");
    }
  }, [mintState]);

  useEffect(() => {
    const handle = async () => {
      if (!!error) {
        return;
      }

      const maxSupply = await airticket.callStatic.MAX_SUPPLY();
      const totalSupply = await airticket.callStatic.totalSupply();
      const max = maxSupply.toNumber();
      const total = totalSupply.toNumber();
      setSupply({ max, total });
    };

    handle();
  }, [state]);

  useEffect(() => {
    const handle = async () => {
      if (!!error) {
        return;
      }

      const fee = await airticket.callStatic.currentFee(amount);
      setCurrentFee(fee);
    };

    handle();
  }, [amount, state]);

  useEffect(() => {
    const handle = async () => {
      switch (state) {
        case "invalid_network":
        case "minting":
        case "fail":
        case "exception":
        case "success":
          return;
      }

      if (etherBalance === undefined) {
        return;
      }

      if (etherBalance.lt(currentFee)) {
        setState("non_enough_ether");

        return;
      }

      setState("mintable");
    };

    handle();
  }, [etherBalance, currentFee]);

  useEffect(() => {
    const handleConnect = async () => {
      if (!!account) {
        setState("connected");

        return;
      }

      setState("connect_wallet");
    };

    handleConnect();
  }, [account]);

  useEffect(() => {
    const handleButtonState = async () => {
      switch (state) {
        case "connect_wallet":
          return setButtonState({
            message: "Connect wallet",
            color: "bg-white",
            disabled: false,
          });
        case "connected":
          return;
        case "invalid_network":
          return setButtonState({
            message: "Invalid network",
            color: "bg-red-200",
            disabled: false,
          });
        case "non_enough_ether":
          return setButtonState({
            message: "Non Ehough Ether",
            color: "bg-slate-200",
            disabled: true,
          });
        case "mintable":
          return setButtonState({
            message: "Mint",
            color: "bg-white",
            disabled: false,
          });
        case "minting":
          return setButtonState({
            message: "Minting",
            color: "bg-orange-200",
            disabled: false,
          });
        case "success":
          return setButtonState({
            message: "Success",
            color: "bg-green-200",
            disabled: false,
          });
        case "fail":
          return setButtonState({
            message: "Fail",
            color: "bg-red-200",
            disabled: false,
          });
        case "exception":
          return setState("connected");
      }
    };

    handleButtonState();
  }, [state]);

  const updateAmount = (a: number) => {
    if (a + supply.total > supply.max) return;
    if (a < 1) return;
    setAmount(a);
  };

  const handleButton = async () => {
    switch (state) {
      case "connect_wallet":
        activateBrowserWallet();
      case "connected":
        return;
      case "invalid_network":
        return switchNetwork(AppConfig.network.chainId);
      case "non_enough_ether":
        return;
      case "mintable":
        return mint(amount, { value: currentFee });
      case "minting":
        return;
      case "success":
        return setState("connected");
      case "fail":
        return setState("connected");
      case "exception":
        return setState("connected");
    }
  };

  return (
    <div>
      <Head>
        <title></title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <div className="bg-white px-4 py-6 grid grid-cols-7 gap-0 border-black border-b-4">
          <div className="text-4xl col-span-5">
            pseudo
            <br />
            airlines
          </div>
          <button
            className="text-2xl col-span-2"
            onClick={() => {
              deactivate();
            }}
            disabled={!account}
          >
            {!!account ? (
              <>
                {account.slice(0, 3)}...{account.slice(-2)}
              </>
            ) : (
              ""
            )}
          </button>
        </div>
        <div className="container mx-auto h-full sm:w-128">
          <div className="container px-4">
            <div className="square box-border my-4 p-8 bg-white border-black border-4"></div>
            <div className="text-4xl bg-white border-black border-4 text-center py-4 mb-4">
              {supply.total}/{supply.max}
            </div>
            <div className="text-4xl grid grid-cols-12 gap-4 mb-4">
              <div className="grid place-items-center bg-white border-black border-4 col-span-6 py-4">
                E {ethers.utils.formatEther(currentFee)}
              </div>
              <div className="grid place-items-center bg-white border-black border-4 col-span-4 py-4">
                {amount}
              </div>
              <div className="text-2xl grid bg-white border-black border-4 col-span-2">
                <button
                  className="col-span-1"
                  onClick={() => {
                    updateAmount(amount + 1);
                  }}
                  disabled={!!error}
                >
                  {!error ? "▲" : " "}
                </button>
                <button
                  className="col-span-1"
                  onClick={() => {
                    updateAmount(amount - 1);
                  }}
                  disabled={!!error}
                >
                  {!error ? "▼" : " "}
                </button>
              </div>
            </div>
            <button
              className={`container text-4xl border-black border-4 text-center py-4 block ${buttonState.color}`}
              onClick={handleButton}
              disabled={buttonState.disabled}
            >
              {buttonState.message}
            </button>
          </div>
        </div>
        <div className="bottom-0 p-2"></div>
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;
