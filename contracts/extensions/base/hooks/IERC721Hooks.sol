//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IERC721Hooks {
    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
     *
     * Calling conditions:
     *
     * - When `from` and `to` are both non-zero, ``from``'s `tokenId` will be
     * transferred to `to`.
     * - When `from` is zero, `tokenId` will be minted for `to`.
     * - When `to` is zero, ``from``'s `tokenId` will be burned.
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     *
     * To learn more about hooks, head to https://docs.openzeppelin.com/contracts/3.x/extending-contracts#using-hooks.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) external;

    /**
     * @dev Hook that is called after any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to https://docs.openzeppelin.com/contracts/3.x/extending-contracts#using-hooks.
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) external;
}
