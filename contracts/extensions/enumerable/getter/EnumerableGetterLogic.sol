//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@violetprotocol/extendable/extensions/InternalExtension.sol";
import { ERC721EnumerableState, ERC721EnumerableStorage } from "../../../storage/ERC721EnumerableStorage.sol";
import { RoleState, Permissions } from "@violetprotocol/extendable/storage/PermissionStorage.sol";
import "../../base/getter/IGetterLogic.sol";
import "./IEnumerableGetterLogic.sol";

// Functional logic extracted from openZeppelin:
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol
contract EnumerableGetterLogic is IEnumerableGetterLogic, InternalExtension {
    /**
     * @dev See {IEnumerableGetterLogic-tokenOfOwnerByIndex}.
     */
    function tokenOfOwnerByIndex(address owner, uint256 index) public virtual override returns (uint256) {
        require(index < IGetterLogic(address(this)).balanceOf(owner), "ERC721Enumerable: owner index out of bounds");
        ERC721EnumerableState storage state = ERC721EnumerableStorage._getState();
        return state._ownedTokens[owner][index];
    }

    /**
     * @dev See {IEnumerableGetterLogic-totalSupply}.
     */
    function totalSupply() public virtual override returns (uint256) {
        ERC721EnumerableState storage state = ERC721EnumerableStorage._getState();
        return state._allTokens.length;
    }

    /**
     * @dev See {IEnumerableGetterLogic-tokenByIndex}.
     */
    function tokenByIndex(uint256 index) public virtual override returns (uint256) {
        require(index < totalSupply(), "ERC721Enumerable: global index out of bounds");
        ERC721EnumerableState storage state = ERC721EnumerableStorage._getState();
        return state._allTokens[index];
    }

    function getInterfaceId() public pure virtual override returns (bytes4) {
        return (type(IEnumerableGetterLogic).interfaceId);
    }

    function getInterface() public pure virtual override returns (string memory) {
        return
            "function tokenOfOwnerByIndex(address owner, uint256 index) external returns (uint256);\n"
            "function totalSupply() external returns (uint256);\n"
            "function tokenByIndex(uint256 index) external returns (uint256);\n";
    }
}
