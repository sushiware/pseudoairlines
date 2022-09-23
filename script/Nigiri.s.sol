// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "forge-std/Script.sol";
import "../src/Nigiri.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Nigiri nigiri = new Nigiri();

        console.log("nigiri", address(nigiri));

        vm.stopBroadcast();
    }
}
