//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@violetprotocol/extendable/extensions/InternalExtension.sol";

// Functional logic extracted from openZeppelin:
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
// To follow Extension principles, maybe best to separate each function into a different Extension
interface IEnumerableGetterLogic {
    /**
     * @dev See {IERC721Enumerable-tokenOfOwnerByIndex}.
     */
    function tokenOfOwnerByIndex(address owner, uint256 index) external returns (uint256);

    /**
     * @dev See {IERC721Enumerable-totalSupply}.
     */
    function totalSupply() external returns (uint256);

    /**
     * @dev See {IERC721Enumerable-tokenByIndex}.
     */
    function tokenByIndex(uint256 index) external returns (uint256);
}

abstract contract EnumerableGetterExtension is IEnumerableGetterLogic, InternalExtension {
    /**
     * @dev see {IExtension-getSolidityInterface}
     */
    function getSolidityInterface() public pure virtual override returns (string memory) {
        return
            "function tokenOfOwnerByIndex(address owner, uint256 index) external returns (uint256);\n"
            "function totalSupply() external returns (uint256);\n"
            "function tokenByIndex(uint256 index) external returns (uint256);\n";
    }

    /**
     * @dev see {IExtension-getInterface}
     */
    function getInterface() public virtual override returns (Interface[] memory interfaces) {
        interfaces = new Interface[](1);

        bytes4[] memory functions = new bytes4[](3);
        functions[0] = IEnumerableGetterLogic.tokenOfOwnerByIndex.selector;
        functions[1] = IEnumerableGetterLogic.totalSupply.selector;
        functions[2] = IEnumerableGetterLogic.tokenByIndex.selector;

        interfaces[0] = Interface(type(IEnumerableGetterLogic).interfaceId, functions);
    }
}
