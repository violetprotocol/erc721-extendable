//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@violetprotocol/extendable/extensions/InternalExtension.sol";
import { TokenURIState, TokenURIStorage } from "../../../storage/ERC721TokenURIStorage.sol";
import "./ISetTokenURILogic.sol";
import "../../base/getter/IGetterLogic.sol";

// This contract should be inherited by your own custom `setTokenURI` logic
// which makes a call to `_setTokenURI` or `_setBaseURI`
contract SetTokenURILogic is ISetTokenURILogic, InternalExtension {
    /**
     * @dev See {ISetTokenURILogic-_setTokenURI}.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) public virtual override _internal {
        require(IGetterLogic(address(this))._exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");

        TokenURIState storage state = TokenURIStorage._getState();
        state._tokenURIs[tokenId] = _tokenURI;
    }

    /**
     * @dev See {ISetTokenURILogic-_setBaseURI}.
     */
    function _setBaseURI(string memory _baseURI) public virtual override _internal {
        TokenURIState storage state = TokenURIStorage._getState();
        state.baseURI = _baseURI;
    }

    function getInterfaceId() public pure virtual override returns (bytes4) {
        return (type(ISetTokenURILogic).interfaceId);
    }

    function getInterface() public pure virtual override returns (string memory) {
        return
            "function _setTokenURI(uint256 tokenId, string memory _tokenURI) external;\n"
            "function _setBaseURI(string memory _tokenURI) external;\n";
    }
}
