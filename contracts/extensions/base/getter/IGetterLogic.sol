//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IGetterLogic {
    /**
     * @dev See {IERC721-balanceOf}.
     */
    function balanceOf(address owner) external view returns (uint256);

    /**
     * @dev See {IERC721-ownerOf}.
     */
    function ownerOf(uint256 tokenId) external view returns (address);

    /**
     * @dev See {IERC721-getApproved}.
     */
    function getApproved(uint256 tokenId) external view returns (address);

    /**
     * @dev See {IERC721-isApprovedForAll}.
     */
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    
    /**
     * @dev Returns whether `tokenId` exists.
     *
     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
     *
     * Tokens start existing when they are minted (`_mint`),
     * and stop existing when they are burned (`_burn`).
     *
     * Requirements:
     *
     * - Must be modified with `public _internal`.
     */
    function _exists(uint256 tokenId) external view returns (bool);

    /**
     * @dev Returns whether `spender` is allowed to manage `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     * - Must be modified with `public _internal`.
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) external view returns (bool);
}