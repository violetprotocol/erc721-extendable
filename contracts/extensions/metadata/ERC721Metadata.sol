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
        address beforeTransferLogic,
        address metadataGetterLogic,
        address setTokenURILogic,
        address burnLogic) 
    ERC721(name_, symbol_, extendLogic, approveLogic, getterLogic, onReceiveLogic, transferLogic, beforeTransferLogic) {
        (bool extendGetterSuccess, ) = extendLogic.delegatecall(abi.encodeWithSignature("extend(address)", metadataGetterLogic));
        require(extendGetterSuccess, "failed to initialise metadata getter");

        (bool extendTokenURISuccess, ) = extendLogic.delegatecall(abi.encodeWithSignature("extend(address)", setTokenURILogic));
        require(extendTokenURISuccess, "failed to initialise setTokenURI logic");

        (bool extendBurnSuccess, ) = extendLogic.delegatecall(abi.encodeWithSignature("extend(address)", burnLogic));
        require(extendBurnSuccess, "failed to initialise burn logic");
    }
}