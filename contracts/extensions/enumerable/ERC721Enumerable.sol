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
 * - `hooksLogic` must be the EnumerableHooksLogic extension address
 * - `enumerableGetterLogic` must be the EnumerableGetterLogic extension address
 *
 */
bytes4 constant ERC721EnumerableInterfaceId = 0x780e9d63;

contract ERC721Enumerable is ERC721 {
    constructor(
        string memory name_,
        string memory symbol_,
        address extendLogic,
        address approveLogic,
        address getterLogic,
        address onReceiveLogic,
        address transferLogic,
        address hooksLogic,
        address enumerableGetterLogic
    ) ERC721(name_, symbol_, extendLogic, approveLogic, getterLogic, onReceiveLogic, transferLogic, hooksLogic) {
        (bool extendGetterSuccess, ) = extendLogic.delegatecall(
            abi.encodeWithSignature("extend(address)", enumerableGetterLogic)
        );
        require(extendGetterSuccess, "failed to initialise enumerable getter");

        (bool registerEnumerableInterfaceSuccess, ) = extendLogic.delegatecall(
            abi.encodeWithSignature("registerInterface(bytes4)", ERC721EnumerableInterfaceId)
        );
        require(registerEnumerableInterfaceSuccess, "failed to register IERC721Enumerable interface");
    }
}
