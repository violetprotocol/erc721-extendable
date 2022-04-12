//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

struct ERC721EnumerableState {
    // Mapping from owner to list of owned token IDs
    mapping(address => mapping(uint256 => uint256)) _ownedTokens;

    // Mapping from token ID to index of the owner tokens list
    mapping(uint256 => uint256) _ownedTokensIndex;

    // Array with all token ids, used for enumeration
    uint256[] _allTokens;

    // Mapping from token id to position in the allTokens array
    mapping(uint256 => uint256) _allTokensIndex;
}

library ERC721EnumerableStorage {
    bytes32 constant STORAGE_NAME = keccak256("extendable:erc721:enumerable");

    function _getStorage()
        internal 
        view
        returns (ERC721EnumerableState storage erc721EnumberableStorage) 
    {
        bytes32 position = keccak256(abi.encodePacked(address(this), STORAGE_NAME));
        assembly {
            erc721EnumberableStorage.slot := position
        }
    }
}