//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IApproveLogic {
    /**
     * @dev See {IERC721-Approval}.
     */
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

    /**
     * @dev See {IERC721-ApprovalForAll}.
     */
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    /**
     * @dev See {IERC721-setApprovalForAll}.
     */
    function setApprovalForAll(address operator, bool approved) external;

    /**
     * @dev See {IERC721-approve}.
     */
    function approve(address to, uint256 tokenId) external;

    /**
     * @dev See {IERC721-approve}.
     */
    function _approve(address to, uint256 tokenId) external;
}
