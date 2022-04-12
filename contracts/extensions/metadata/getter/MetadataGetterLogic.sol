//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@violetprotocol/extendable/extensions/Extension.sol";
import { ERC721State, ERC721Storage } from "../../../storage/ERC721Storage.sol";
import { TokenURIState, TokenURIStorage } from "../../../storage/ERC721TokenURIStorage.sol";
import "./IMetadataGetterLogic.sol";
import "../../base/getter/IGetterLogic.sol";

// Functional logic extracted from openZeppelin:
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
contract MetadataGetterLogic is IMetadataGetterLogic, Extension {
    /**
     * @dev See {IERC721Metadata-name}.
     */
    function name() override public view virtual returns (string memory) {
        ERC721State storage erc721Storage = ERC721Storage._getStorage();
        return erc721Storage._name;
    }

    /**
     * @dev See {IERC721Metadata-symbol}.
     */
    function symbol() override public view virtual returns (string memory) {
        ERC721State storage erc721Storage = ERC721Storage._getStorage();
        return erc721Storage._symbol;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     *
     * Combines the logic of ERC721-tokenURI function and IERC721URIStorage-tokenURI
     *
     * Original OpenZeppelin implementation breaks its own rules around extensions and implementations
     * so this implementation will not follow that and fixes that here.
     */
    function tokenURI(uint256 tokenId) override public view virtual returns (string memory) {
        // See {IERC721URIStorage-tokenURI}
        require(IGetterLogic(address(this))._exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");

        TokenURIState storage state = TokenURIStorage._getStorage();

        string memory _tokenURI = state._tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        // See {ERC721-tokenURI}
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
    }


    function getInterfaceId() override virtual public pure returns(bytes4) {
        return(type(IMetadataGetterLogic).interfaceId);
    }

    function getInterface() override virtual public pure returns(string memory) {
        return  "function name() external view returns (string memory);\n"
                "function symbol() external view returns (string memory);\n"
                "function tokenURI(uint256 tokenId) external view returns (string memory);\n";
    }
}