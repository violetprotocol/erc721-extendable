//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

import "@violetprotocol/extendable/extensions/InternalExtension.sol";
import "./IBeforeTransferLogic.sol";

contract BeforeTransferLogic is IBeforeTransferLogic, InternalExtension {
    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
     *
     * Calling conditions:
     *
     * - When `from` and `to` are both non-zero, ``from``'s `tokenId` will be
     * transferred to `to`.
     * - When `from` is zero, `tokenId` will be minted for `to`.
     * - When `to` is zero, ``from``'s `tokenId` will be burned.
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) override public _internal virtual {}

    function getInterfaceId() override virtual public pure returns(bytes4) {
        return(type(IBeforeTransferLogic).interfaceId);
    }

    function getInterface() override virtual public pure returns(string memory) {
        return  "function _beforeTokenTransfer(address from, address to, uint256 tokenId) external;\n";
    }
}