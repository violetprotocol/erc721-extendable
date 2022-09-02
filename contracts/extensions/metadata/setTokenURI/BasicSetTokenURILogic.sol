//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IBasicSetTokenURILogic.sol";
import "./SetTokenURILogic.sol";

// Functional logic extracted from openZeppelin:
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
contract BasicSetTokenURILogic is BasicSetTokenURIExtension {
    /**
     * @dev See {ISetTokenURILogic-_setTokenURI}.
     */
    function setTokenURI(uint256 tokenId, string memory _tokenURI) public virtual override {
        ISetTokenURILogic(address(this))._setTokenURI(tokenId, _tokenURI);
    }

    /**
     * @dev See {ISetTokenURILogic-_setBaseURI}.
     */
    function setBaseURI(string memory _baseURI) public virtual override {
        ISetTokenURILogic(address(this))._setBaseURI(_baseURI);
    }
}
