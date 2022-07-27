//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IMetadataBurnLogic.sol";
import "../../base/burn/BurnLogic.sol";
import { TokenURIState, TokenURIStorage } from "../../../storage/ERC721TokenURIStorage.sol";

// Functional logic extracted from openZeppelin:
// solhint-disable-next-line max-line-length
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Metadata.sol
// To follow Extension principles, maybe best to separate each function into a different Extension

contract MetadataBurnLogic is IMetadataBurnLogic, BurnLogic {
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

        TokenURIState storage state = TokenURIStorage._getState();
        if (bytes(state._tokenURIs[tokenId]).length != 0) {
            delete state._tokenURIs[tokenId];
        }
    }

    function getInterfaceId() public pure virtual override returns (bytes4) {
        return (type(IMetadataBurnLogic).interfaceId);
    }

    function getInterface() public pure virtual override returns (string memory) {
        return "function burn(uint256 tokenId) external;\n";
    }
}
