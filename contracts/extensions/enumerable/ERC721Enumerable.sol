//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../base/ERC721.sol";

/**
 * @dev ERC721Enumerable Extendable contract
 *
 * Constructor arguments take usual `name` and `symbol` arguments for the token
 * with additional extension addresses specifying where the functional logic
 * for each of the token features live which is passed to the Base ERC721 contract
 *
 * Enumerable requires:
 * - `beforeTransferLogic` must be the EnumerableBeforeTransferLogic extension address
 * - `enumerableGetterLogic` must be the EnumerableGetterLogic extension address
 *
 */
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