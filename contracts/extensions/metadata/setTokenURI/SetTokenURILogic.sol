//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@violetprotocol/extendable/extensions/InternalExtension.sol";
import { TokenURIState, TokenURIStorage } from "../../../storage/ERC721TokenURIStorage.sol";
import "./ISetTokenURILogic.sol";
import "../../base/getter/IGetterLogic.sol";

contract SetTokenURILogic is ISetTokenURILogic, InternalExtension {
    /**
     * @dev See {ISetTokenURILogic-_setTokenURI}.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) override public _internal virtual {
        require(IGetterLogic(address(this))._exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");

        TokenURIState storage state = TokenURIStorage._getState();
        state._tokenURIs[tokenId] = _tokenURI;
    }
    /**
     * @dev See {ISetTokenURILogic-_setBaseURI}.
     */
    function _setBaseURI(string memory _baseURI) override public _internal virtual {
        TokenURIState storage state = TokenURIStorage._getState();
        state.baseURI = _baseURI;
    }

    function getInterfaceId() override virtual public pure returns(bytes4) {
        return(type(ISetTokenURILogic).interfaceId);
    }

    function getInterface() override virtual public pure returns(string memory) {
        return  "function _setTokenURI(uint256 tokenId, string memory _tokenURI) external;\n"
                "function _setBaseURI(string memory _tokenURI) external;\n";
    }
}