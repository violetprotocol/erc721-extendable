//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

interface IApproveAllLogic {
    /**
     * @dev See {IERC721-ApprovalForAll}.
     */
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    /**
     * @dev See {IERC721-setApprovalForAll}.
     */
    function setApprovalForAll(address operator, bool approved) external;
}