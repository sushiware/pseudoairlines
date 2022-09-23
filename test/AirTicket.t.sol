// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "../src/Airticket.sol";

contract TestAirTicket is Test {
    Airticket airticket;

    function setUp() public {
        airticket = new Airticket();
    }

    function testMint(uint256 amount) public {
        vm.assume(amount > 0);
        vm.assume(airticket.MAX_SUPPLY() >= amount);

        uint256 fee = airticket.currentFee(amount);
        airticket.mint{value: fee}(amount);
    }

    function testMint_One() public {
        for (uint256 i = 0; i < airticket.MAX_SUPPLY(); i++) {
            uint256 fee = airticket.currentFee(1);
            assertEq(fee, 0.001 ether * i);
            airticket.mint{value: fee}(1);
        }
    }

    function testMint_Five() public {
        for (uint256 i = 0; i < airticket.MAX_SUPPLY() / 5; i++) {
            uint256 fee = airticket.currentFee(5);
            assertEq(fee, 0.025 ether * i + 0.01 ether);
            airticket.mint{value: 0.025 ether * i + 0.01 ether}(5);
        }
    }

    function testCannotMint_AmountIsZero() public {
        vm.expectRevert(Airticket.AmountIsZero.selector);
        airticket.mint(0);
    }

    function testCannotMint_SoldOut() public {
        for (uint256 i = 0; i < airticket.MAX_SUPPLY(); i++) {
            uint256 fee = airticket.currentFee(1);
            airticket.mint{value: fee}(1);
        }

        vm.expectRevert(Airticket.SoldOut.selector);
        airticket.mint{value: 1 ether}(1);
    }

    function testCannotMint_LackOfFee() public {
        airticket.mint(1);

        vm.expectRevert(Airticket.LackOfFee.selector);
        airticket.mint(1);
    }
}
