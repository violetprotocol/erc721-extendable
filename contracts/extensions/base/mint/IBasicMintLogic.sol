//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Functional logic extracted from openZeppelin:
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol

// This contract should be inherited by your own custom `mint` logic which makes a call to `_mint` or `_safeMint`
interface IBasicMintLogic {
    function mint(address to, uint256 amount) external;
}