//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@violetprotocol/extendable/extensions/InternalExtension.sol";
import { TokenURIState, TokenURIStorage } from "../../../storage/ERC721TokenURIStorage.sol";
import "./ISetTokenURILogic.sol";
import "../../base/getter/IGetterLogic.sol";

contract SetTokenURILogic is ISetTokenURILogic, Extension {
    /**
     * @dev See {ISetTokenURILogic-_setTokenURI}.
     */
    function setTokenURI(uint256 tokenId, string memory _tokenURI) override public virtual {
        require(IGetterLogic(address(this))._exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");

        TokenURIState storage state = TokenURIStorage._getState();
        state._tokenURIs[tokenId] = _tokenURI;
    }
    /**
     * @dev See {ISetTokenURILogic-_setBaseURI}.
     */
    function setBaseURI(string memory _baseURI) override public virtual {
        TokenURIState storage state = TokenURIStorage._getState();
        state.baseURI = _baseURI;
    }

    function getInterfaceId() override virtual public pure returns(bytes4) {
        return(type(ISetTokenURILogic).interfaceId);
    }

    function getInterface() override virtual public pure returns(string memory) {
        return  "function setTokenURI(uint256 tokenId, string memory _tokenURI) external;\n"
                "function setBaseURI(string memory _tokenURI) external;\n";
    }
}