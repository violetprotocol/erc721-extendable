//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

interface IApproveInternalLogic {
    /**
     * @dev See {IERC721-approve}.
     */
    function _approve(address to, uint256 tokenId) external;
}