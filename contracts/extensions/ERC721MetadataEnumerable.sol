//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./metadata/ERC721Metadata.sol";
import "./enumerable/ERC721Enumerable.sol";

/**
 * @dev ERC721MetadataEnumerable Extendable contract
 *
 * Constructor arguments take usual `name` and `symbol` arguments for the token
 * with additional extension addresses specifying where the functional logic
 * for each of the token features live which is passed to the ERC721Metadata contract
 *
 * Metadata-specific extensions must be extended immediately after deployment by
 * calling the `finaliseERC721MetadataExtending` function.
 *
 * Ensure that the hooksLogic used implements EnumerableHooksLogic
 */
contract ERC721MetadataEnumerable is ERC721Metadata {
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
    )
        ERC721Metadata(
            name_,
            symbol_,
            extendLogic,
            approveLogic,
            getterLogic,
            onReceiveLogic,
            transferLogic,
            hooksLogic
        )
    {
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
