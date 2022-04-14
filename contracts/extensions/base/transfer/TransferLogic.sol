//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@violetprotocol/extendable/extensions/Extension.sol";
import {ERC721State, ERC721Storage} from "../../../storage/ERC721Storage.sol";
import { RoleState, Permissions } from "@violetprotocol/extendable/storage/PermissionStorage.sol";
import "../getter/IGetterLogic.sol";
import "../receiver/IOnReceiveLogic.sol";
import "../approve/IApproveInternalLogic.sol";
import "../hooks/IBeforeTransferLogic.sol";
import "./ITransferLogic.sol";

// Functional logic extracted from openZeppelin:
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
contract TransferLogic is ITransferLogic, Extension {
    using Address for address;
    using Strings for uint256;

    /**
     * @dev See {ITransferLogic-transferFrom}.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) override public virtual {
        //solhint-disable-next-line max-line-length
        require(IGetterLogic(address(this))._isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, to, tokenId);
    }

    /**
     * @dev See {ITransferLogic-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) override public virtual {
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev See {ITransferLogic-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) override public virtual {
        require(IGetterLogic(address(this))._isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, _data);
    }

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * `_data` is additional data, it has no specified format and it is sent in call to `to`.
     *
     * This internal function is equivalent to {safeTransferFrom}, and can be used to e.g.
     * implement alternative mechanisms to perform token transfer, such as signature-based.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function _safeTransfer(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) internal virtual {
        _transfer(from, to, tokenId);
        require(IOnReceiveLogic(address(this))._checkOnERC721Received(address(0), to, tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer");
    }

    /**
     * @dev Transfers `tokenId` from `from` to `to`.
     *  As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     *
     * Emits a {Transfer} event.
     */
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {
        require(IGetterLogic(address(this)).ownerOf(tokenId) == from, "ERC721: transfer of token that is not own");
        require(to != address(0), "ERC721: transfer to the zero address");

        IBeforeTransferLogic(address(this))._beforeTokenTransfer(from, to, tokenId);

        // Clear approvals from the previous owner
        IApproveInternalLogic(address(this))._approve(address(0), tokenId);

        ERC721State storage erc721Storage = ERC721Storage._getStorage();
        erc721Storage._balances[from] -= 1;
        erc721Storage._balances[to] += 1;
        erc721Storage._owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function getInterfaceId() override virtual public pure returns(bytes4) {
        return(type(IERC721).interfaceId ^ type(IERC721Metadata).interfaceId);
    }

    function getInterface() override virtual public pure returns(string memory) {
        return "function extend(address extension) external;function getCurrentInterface() external returns(string memory);function getExtensions() external returns(address[] memory);";
    }
}