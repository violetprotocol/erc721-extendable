//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IBasicBurnLogic.sol";
import "./BurnLogic.sol";

// Functional logic extracted from openZeppelin:
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
// To follow Extension principles, maybe best to separate each function into a different Extension

contract BasicBurnLogic is IBasicBurnLogic, BurnLogic {
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
    function burn(uint256 tokenId) public virtual override {
        _burn(tokenId);
    }

    function getInterfaceId() public pure virtual override returns (bytes4) {
        return (type(IBasicBurnLogic).interfaceId);
    }

    function getInterface() public pure virtual override returns (string memory) {
        return "function burn(uint256 tokenId) external;\n";
    }
}
