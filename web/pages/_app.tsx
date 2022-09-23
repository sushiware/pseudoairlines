import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AppConfig } from "../app.config";
import { DAppProvider } from "@usedapp/core";
import { JsonRpcProvider } from "@ethersproject/providers";

const config = {
  readOnlyChainId: AppConfig.network.chainId,
  readOnlyUrls: {
    [AppConfig.network.chainId]: new JsonRpcProvider(AppConfig.url),
  },
  networks: [AppConfig.network],
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DAppProvider config={config}>
      <Component {...pageProps} />
    </DAppProvider>
  );
}

export default MyApp;
