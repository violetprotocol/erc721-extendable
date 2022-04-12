//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

import "../base/ERC721.sol";

// TokenLogic Extension inherits from ERC721 to add mint function
contract ERC721Metadata is ERC721 {
    constructor(string memory name_, string memory symbol_, 
        address extendLogic,
        address approveLogic,
        address getterLogic,
        address onReceiveLogic,
        address transferLogic,
        address beforeTransferLogic,
        address metadataGetterLogic,
        address setTokenURILogic,
        address burnLogic) 
    ERC721(name_, symbol_, extendLogic, approveLogic, getterLogic, onReceiveLogic, transferLogic, beforeTransferLogic) {
        IExtendLogic(address(this)).extend(metadataGetterLogic);
        IExtendLogic(address(this)).extend(setTokenURILogic);
        IExtendLogic(address(this)).extend(burnLogic);
    }
}