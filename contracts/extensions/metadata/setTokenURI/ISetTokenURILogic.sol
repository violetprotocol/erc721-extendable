//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ISetTokenURILogic {
    /**
     * @dev See {ERC721URIStorage-_setTokenURI}.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) external;
}