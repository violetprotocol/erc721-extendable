//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

interface IApproveLogic {
    /**
     * @dev See {IERC721-Approval}.
     */
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

    /**
     * @dev See {IERC721-approve}.
     */
    function approve(address to, uint256 tokenId) external;
}