//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@violetprotocol/extendable/extensions/Extension.sol";
import {ERC721State, ERC721Storage} from "../../../storage/ERC721Storage.sol";
import { RoleState, Permissions } from "@violetprotocol/extendable/storage/PermissionStorage.sol";
import {TokenURIState, TokenURIStorage} from "../../../storage/TokenURIStorage.sol";
import "./IApproveAllLogic.sol";

// Functional logic extracted from openZeppelin:
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
// To follow Extension principles, maybe best to separate each function into a different Extension
contract ApproveAllLogic is IApproveAllLogic, Extension {
    using Address for address;
    using Strings for uint256;

    /**
     * @dev See {IERC721-setApprovalForAll}.
     */
    function setApprovalForAll(address operator, bool approved) public virtual override {
        _setApprovalForAll(msg.sender, operator, approved);
    }

    /**
     * @dev Approve `operator` to operate on all of `owner` tokens
     *
     * Emits a {ApprovalForAll} event.
     */
    function _setApprovalForAll(
        address owner,
        address operator,
        bool approved
    ) internal virtual {
        require(owner != operator, "ERC721: approve to caller");
        ERC721State storage erc721Storage = ERC721Storage._getStorage();
        erc721Storage._operatorApprovals[owner][operator] = approved;
        emit ApprovalForAll(owner, operator, approved);
    }
    

    function getInterfaceId() override virtual public pure returns(bytes4) {
        return(type(IERC721).interfaceId ^ type(IERC721Metadata).interfaceId);
    }

    function getInterface() override virtual public pure returns(string memory) {
        return "function approve(address to, uint256 tokenId) external;\n";
    }
}