//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IBasicSetTokenURILogic {
    /**
     * @dev See {ERC721URIStorage-_setTokenURI}.
     */
    function setTokenURI(uint256 tokenId, string memory _tokenURI) external;

    /**
     * @dev See {ERC721URIStorageMock-_setBaseURI}.
     */
    function setBaseURI(string memory _tokenURI) external;
}