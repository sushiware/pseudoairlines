// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "src/Nigiri.sol";

contract TestContract is Test {
    Nigiri nigiri;

    function setUp() public {
        nigiri = new Nigiri();
    }

    function testMint(uint256 amount) public {
        vm.assume(amount > 0);
        vm.assume(nigiri.MAX_SUPPLY() >= amount);

        uint256 fee = nigiri.currentFee(amount);
        nigiri.mint{value: fee}(amount);
    }

    function testMint_One() public {
        for (uint256 i = 0; i < nigiri.MAX_SUPPLY(); i++) {
            uint256 fee = nigiri.currentFee(1);
            assertEq(fee, 0.001 ether * i);
            nigiri.mint{value: fee}(1);
        }
    }

    function testMint_Five() public {
        for (uint256 i = 0; i < nigiri.MAX_SUPPLY() / 5; i++) {
            uint256 fee = nigiri.currentFee(5);
            assertEq(fee, 0.025 ether * i + 0.01 ether);
            nigiri.mint{value: 0.025 ether * i + 0.01 ether}(5);
        }
    }

    function testCannotMint_AmountIsZero() public {
        vm.expectRevert(Nigiri.AmountIsZero.selector);
        nigiri.mint(0);
    }

    function testCannotMint_SoldOut() public {
        for (uint256 i = 0; i < nigiri.MAX_SUPPLY(); i++) {
            uint256 fee = nigiri.currentFee(1);
            nigiri.mint{value: fee}(1);
        }

        vm.expectRevert(Nigiri.SoldOut.selector);
        nigiri.mint{value: 1 ether}(1);
    }

    function testCannotMint_LackOfFee() public {
        nigiri.mint(1);

        vm.expectRevert(Nigiri.LackOfFee.selector);
        nigiri.mint(1);
    }
}
