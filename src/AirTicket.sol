// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {ERC721A} from "erc721a/contracts/ERC721A.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";

contract Airticket is ERC721A {
    error AmountIsZero();
    error SoldOut();
    error LackOfFee();

    uint256 public constant MAX_SUPPLY = 100;

    constructor() ERC721A("Airticket", "AIRTICKET") {}

    function mint(uint256 amount) external payable {
        if (amount == 0) {
            revert AmountIsZero();
        }

        uint256 startTokenId = _nextTokenId();
        uint256 endTokenId = startTokenId + amount - 1;
        if (endTokenId >= MAX_SUPPLY) {
            revert SoldOut();
        }

        uint256 fee = _fee(startTokenId, endTokenId);
        if (msg.value < fee) {
            revert LackOfFee();
        }

        if (msg.value > fee) {
            Address.sendValue(payable(msg.sender), msg.value - fee);
        }

        _mint(msg.sender, amount);
    }

    function currentFee(uint256 amount) external view returns (uint256) {
        uint256 startTokenId = _nextTokenId();
        return _fee(startTokenId, startTokenId + amount - 1);
    }

    function _fee(uint256 startTokenId, uint256 endTokenId)
        private
        pure
        returns (uint256)
    {
        unchecked {
            // prettier-ignore
            return ((_price(endTokenId) * (endTokenId + 1)) - (_price(startTokenId - 1) * startTokenId)) / 2;
        }
    }

    function _price(uint256 tokenId) private pure returns (uint256) {
        unchecked {
            return 0.001 ether * tokenId;
        }
    }
}
