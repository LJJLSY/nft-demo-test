// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract MetaTest {
    uint256 public num = 2;

    function getNum() public view returns (uint256) {
        return num;
    }
}