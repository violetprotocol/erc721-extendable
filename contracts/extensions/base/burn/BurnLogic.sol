//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "../transfer/ITransferLogic.sol";
import "@violetprotocol/extendable/extensions/Extension.sol";
import {ERC721State, ERC721Storage} from "../../../storage/ERC721Storage.sol";
import "../getter/IGetterLogic.sol";
import "../hooks/IBeforeTransferLogic.sol";
import "../approve/IApproveInternalLogic.sol";

// Functional logic extracted from openZeppelin:
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
// To follow Extension principles, maybe best to separate each function into a different Extension

// This contract should be inherited by your own custom `burn` logic which makes a call to `_burn`
abstract contract BurnLogic is Extension {
    // Problem is non-reusable event definitions
    event Transfer(address from, address to, uint256 tokenId);

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
    function _burn(uint256 tokenId) internal virtual {
        address owner = IGetterLogic(address(this)).ownerOf(tokenId);

        IBeforeTransferLogic(address(this))._beforeTokenTransfer(owner, address(0), tokenId);

        // Clear approvals
        IApproveInternalLogic(address(this))._approve(address(0), tokenId);

        ERC721State storage erc721Storage = ERC721Storage._getStorage();
        erc721Storage._balances[owner] -= 1;
        delete erc721Storage._owners[tokenId];

        emit Transfer(owner, address(0), tokenId);
    }
}