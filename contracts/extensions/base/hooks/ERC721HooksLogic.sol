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
    ) public virtual override _internal {}

    /**
     * @dev See {IERC721Hooks-_afterTokenTransfer}
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override _internal {}

    function getInterfaceId() public pure virtual override returns (bytes4) {
        return (type(IERC721Hooks).interfaceId);
    }

    function getInterface() public pure virtual override returns (string memory) {
        return
            "function _beforeTokenTransfer(address from, address to, uint256 tokenId) external;\n"
            "function _afterTokenTransfer(address from, address to, uint256 tokenId) external;\n";
    }
}
