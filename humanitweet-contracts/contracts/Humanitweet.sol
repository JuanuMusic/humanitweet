// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Humanitweet is ERC721 {

    uint256 public tokenCounter;
    constructor() public ERC721("Humaniwteet", "HTW") {
        tokenCounter = 0;
    }
}