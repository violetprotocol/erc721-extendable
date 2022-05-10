//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../base/ERC721.sol";

// Functional logic extracted from openZeppelin:
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol
contract ERC721Enumerable is ERC721 {
    constructor(string memory name_, string memory symbol_, 
        address extendLogic,
        address approveLogic,
        address getterLogic,
        address onReceiveLogic,
        address transferLogic,
        address beforeTransferLogic,
        address enumerableGetterLogic) 
    ERC721(name_, symbol_, extendLogic, approveLogic, getterLogic, onReceiveLogic, transferLogic, beforeTransferLogic) {
        (bool extendGetterSuccess, ) = extendLogic.delegatecall(abi.encodeWithSignature("extend(address)", enumerableGetterLogic));
        require(extendGetterSuccess, "failed to initialise enumerable getter");
    }
}