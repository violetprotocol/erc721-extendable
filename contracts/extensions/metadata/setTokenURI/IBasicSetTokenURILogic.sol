//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@violetprotocol/extendable/extensions/InternalExtension.sol";

interface IBasicSetTokenURILogic {
    /**
     * @dev See {ERC721URIStorage-_setTokenURI}.
     */
    function setTokenURI(uint256 tokenId, string memory _tokenURI) external;

    /**
     * @dev See {ERC721URIStorageMock-_setBaseURI}.
     */
    function setBaseURI(string memory _tokenURI) external;
}

abstract contract BasicSetTokenURIExtension is IBasicSetTokenURILogic, Extension {
    /**
     * @dev see {IExtension-getSolidityInterface}
     */
    function getSolidityInterface() public pure virtual override returns (string memory) {
        return
            "function setTokenURI(uint256 tokenId, string memory _tokenURI) external;\n"
            "function setBaseURI(string memory _tokenURI) external;\n";
    }

    /**
     * @dev see {IExtension-getInterface}
     */
    function getInterface() public virtual override returns (Interface[] memory interfaces) {
        interfaces = new Interface[](1);

        bytes4[] memory functions = new bytes4[](2);
        functions[0] = IBasicSetTokenURILogic.setTokenURI.selector;
        functions[1] = IBasicSetTokenURILogic.setBaseURI.selector;

        interfaces[0] = Interface(type(IBasicSetTokenURILogic).interfaceId, functions);
    }
}
