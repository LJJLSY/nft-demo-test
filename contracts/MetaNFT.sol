// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MetaNFT is ERC721 {
    uint256 private nextid = 1;
    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    function mint(address to,uint256 id) external {
        _mint(to,id);
    }

    function mintnext(address to) external returns (uint256) {
        _mint(to,nextid);
        nextid++;
        return nextid;
    }

    function burn(uint256 id) external {
        require(msg.sender == ownerOf(id),"not owner");
        _burn(id);
    }
}