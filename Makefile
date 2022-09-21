.PHONY: script-mainnet check-env


-include .env

script-mainnet: check-env
	forge script script/Tmp.s.sol:Tmp --rpc-url ${MAINNET_RPC_URL} --private-key ${MAINNET_PRIVATE_KEY} --broadcast --verify --etherscan-api-key ${ETHERSCAN_KEY} -vvvv

check-env:
ifndef MAINNET_PRIVATE_KEY
	$(error MAINNET_PRIVATE_KEY is undefined)
endif
ifndef MAINNET_RPC_URL
	$(error MAINNET_RPC_URL is undefined)
endif
ifndef ETHERSCAN_KEY
	$(error ETHERSCAN_KEY is undefined)
endif

