//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @dev Common Events interface, to be inherited by extensions that share events
 */
interface Events {
    /**
     * @dev See {IERC721-Transfer}.
     */
    event Transfer(address from, address to, uint256 tokenId);
}