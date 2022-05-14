//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IMetadataGetterLogic {
    /**
     * @dev See {IERC721Metadata-name}.
     */
    function name() external returns (string memory);

    /**
     * @dev See {IERC721Metadata-symbol}.
     */
    function symbol() external returns (string memory);

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) external returns (string memory);

    /**
     * @dev Returns the base URI for all tokens.
     */
    function baseURI() external returns (string memory);
}