.PHONY: script-mainnet check-env

-include web/.env

deploy-airticket-anvil: build
	PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 forge script script/Airticket.s.sol:Deploy --fork-url http://127.0.0.1:8545 --broadcast -vvvv

deploy-airticket-goerli: check-env build
	forge script script/Airticket.s.sol:Deploy --rpc-url ${MAINNET_RPC_URL} --broadcast --verify --etherscan-api-key ${ETHERSCAN_KEY} -vvvv

build:
	forge build --force

anvil:
	anvil --block-time 5

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

