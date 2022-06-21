//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@violetprotocol/extendable/extensions/InternalExtension.sol";
import "./IERC721Hooks.sol";

contract ERC721HooksLogic is IERC721Hooks, InternalExtension {
    /**
     * @dev See {IERC721Hooks-_beforeTokenTransfer}
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) override public _internal virtual {}

    /**
     * @dev See {IERC721Hooks-_afterTokenTransfer}
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) override public _internal virtual {}

    function getInterfaceId() override virtual public pure returns(bytes4) {
        return(type(IERC721Hooks).interfaceId);
    }

    function getInterface() override virtual public pure returns(string memory) {
        return  "function _beforeTokenTransfer(address from, address to, uint256 tokenId) external;\n"
                "function _afterTokenTransfer(address from, address to, uint256 tokenId) external;\n";
    }
}