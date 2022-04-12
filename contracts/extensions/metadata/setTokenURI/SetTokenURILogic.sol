//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

import "@violetprotocol/extendable/extensions/InternalExtension.sol";
import "./ISetTokenURILogic.sol";
import "../../base/getter/IGetterLogic.sol";

contract SetTokenURILogic is ISetTokenURILogic, InternalExtension {
    /**
     * @dev See {ISetTokenURILogic-_setTokenURI}.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) public _internal virtual {
        require(IGetterLogic(address(this))._exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");

        TokenURIState storage state = TokenURIStorage._getStorage();
        state._tokenURIs[tokenId] = _tokenURI;
    }

    function getInterfaceId() override virtual public pure returns(bytes4) {
        return(type(ISetTokenURILogic).interfaceId);
    }

    function getInterface() override virtual public pure returns(string memory) {
        return  "function _setTokenURI(uint256 tokenId, string memory _tokenURI) external;\n";
    }
}