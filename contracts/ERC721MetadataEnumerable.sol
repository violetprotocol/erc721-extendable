//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./extensions/metadata/ERC721Metadata.sol";

contract ERC721MetadataEnumerable is ERC721Metadata {
    constructor(string memory name_, string memory symbol_, 
        address extendLogic,
        address approveLogic,
        address getterLogic,
        address onReceiveLogic,
        address transferLogic,
        address beforeTransferLogic,
        address metadataGetterLogic,
        address setTokenURILogic,
        address burnLogic,
        address enumerableGetterLogic
    ) ERC721Metadata(name_, symbol_,  extendLogic, approveLogic, getterLogic, onReceiveLogic, transferLogic, beforeTransferLogic, metadataGetterLogic, setTokenURILogic, burnLogic) {
        IExtendLogic(address(this)).extend(enumerableGetterLogic);
    }
}