//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IOnReceiveLogic {
    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) external returns (bool);
}
