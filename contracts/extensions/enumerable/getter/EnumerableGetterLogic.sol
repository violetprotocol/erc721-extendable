//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import { ERC721EnumerableState, ERC721EnumerableStorage } from "../../../storage/ERC721EnumerableStorage.sol";
import "../../base/getter/IGetterLogic.sol";
import "./IEnumerableGetterLogic.sol";

// Functional logic extracted from openZeppelin:
// solhint-disable-next-line max-line-length
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol
contract EnumerableGetterLogic is EnumerableGetterExtension {
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
}
