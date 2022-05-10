//SPDX-License-Identifier: MIT
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
        address beforeTransferLogic) 
    ERC721(name_, symbol_, extendLogic, approveLogic, getterLogic, onReceiveLogic, transferLogic, beforeTransferLogic) {}

    function finaliseERC721MetadataExtending(
        address metadataGetterLogic,
        address setTokenURILogic,
        address mintLogic,
        address burnLogic
    ) public {
        IExtendLogic self = IExtendLogic(address(this));

        self.extend(metadataGetterLogic);
        self.extend(setTokenURILogic);
        self.extend(mintLogic);
        self.extend(burnLogic);
    }
}