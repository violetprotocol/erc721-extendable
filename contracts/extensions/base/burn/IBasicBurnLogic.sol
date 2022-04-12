//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

interface IBasicBurnLogic {
    /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Transfer} event.
     */
    function burn(uint256 tokenId) external;
}