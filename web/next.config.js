/** @type {import('next').NextConfig} */

require("dotenv").config();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    MAINNET_RPC_URL: process.env.MAINNET_RPC_URL,
    GOERLI_RPC_URL: process.env.GOERLI_RPC_URL,
    NETWORK: process.env.NETWORK,
  },
};

module.exports = nextConfig;
