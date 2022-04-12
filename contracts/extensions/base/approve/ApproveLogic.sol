//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@violetprotocol/extendable/extensions/InternalExtension.sol";
import { ERC721State, ERC721Storage } from "../../../storage/ERC721Storage.sol";
import { RoleState, Permissions } from "@violetprotocol/extendable/storage/PermissionStorage.sol";
import { TokenURIState, TokenURIStorage } from "../../../storage/TokenURIStorage.sol";
import "./IApproveLogic.sol";
import "./IApproveInternalLogic.sol";
import "../getter/IGetterLogic.sol";

// Functional logic extracted from openZeppelin:
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
// To follow Extension principles, maybe best to separate each function into a different Extension
contract ApproveLogic is IApproveLogic, IApproveInternalLogic, InternalExtension {
    using Address for address;
    using Strings for uint256;

    /**
     * @dev See {IERC721-approve}.
     */
    function approve(address to, uint256 tokenId) override public virtual {
        address owner = IGetterLogic(address(this)).ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");

        require(
            msg.sender == owner || IGetterLogic(address(this)).isApprovedForAll(owner, msg.sender),
            "ERC721: approve caller is not owner nor approved for all"
        );

        _approve(to, tokenId);
    }

    /**
     * @dev Approve `to` to operate on `tokenId`
     *
     * Emits a {Approval} event.
     */
    function _approve(address to, uint256 tokenId) override public _internal virtual {
        ERC721State storage erc721Storage = ERC721Storage._getStorage();
        erc721Storage._tokenApprovals[tokenId] = to;
        emit Approval(IGetterLogic(address(this)).ownerOf(tokenId), to, tokenId);
    }

    function getInterfaceId() override virtual public pure returns(bytes4) {
        return(type(IApproveLogic).interfaceId);
    }

    function getInterface() override virtual public pure returns(string memory) {
        return "function approve(address to, uint256 tokenId) external;\n";
    }
}