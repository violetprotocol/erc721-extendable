//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

struct TokenURIState {
    // Mapping from token ID to token uri
    mapping(uint256 => string) _tokenURIs;
    string baseURI;
}

library TokenURIStorage {
    bytes32 constant STORAGE_NAME = keccak256("extendable:erc721:token_uri");

    function _getStorage()
        internal 
        view
        returns (TokenURIState storage tokenURIStorage) 
    {
        bytes32 position = keccak256(abi.encodePacked(address(this), STORAGE_NAME));
        assembly {
            tokenURIStorage.slot := position
        }
    }
}