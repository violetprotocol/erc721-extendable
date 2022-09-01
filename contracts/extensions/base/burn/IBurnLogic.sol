//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@violetprotocol/extendable/extensions/Extension.sol";

interface IBurnLogic {
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
    function burn(uint256 tokenId) external;
}

abstract contract BurnExtension is IBurnLogic, Extension {
    /**
     * @dev see {IExtension-getSolidityInterface}
     */
    function getSolidityInterface() public pure virtual override returns (string memory) {
        return "function burn(uint256 tokenId) external;\n";
    }

    /**
     * @dev see {IExtension-getInterface}
     */
    function getInterface() public virtual override returns (Interface[] memory interfaces) {
        interfaces = new Interface[](1);

        bytes4[] memory functions = new bytes4[](1);
        functions[0] = IBurnLogic.burn.selector;

        interfaces[0] = Interface(type(IBurnLogic).interfaceId, functions);
    }
}
