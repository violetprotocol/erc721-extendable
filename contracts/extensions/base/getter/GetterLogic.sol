//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@violetprotocol/extendable/extensions/InternalExtension.sol";
import {ERC721State, ERC721Storage} from "../../../storage/ERC721Storage.sol";
import { RoleState, Permissions } from "@violetprotocol/extendable/storage/PermissionStorage.sol";
import "./IGetterLogic.sol";

// Functional logic extracted from openZeppelin:
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
// To follow Extension principles, maybe best to separate each function into a different Extension
contract GetterLogic is IGetterLogic, InternalExtension {
    using Address for address;
    using Strings for uint256;

    /**
     * @dev See {IERC721-balanceOf}.
     */
    function balanceOf(address owner) public view virtual override returns (uint256) {
        require(owner != address(0), "ERC721: balance query for the zero address");
        ERC721State storage erc721Storage = ERC721Storage._getStorage();
        return erc721Storage._balances[owner];
    }

    /**
     * @dev See {IERC721-ownerOf}.
     */
    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        ERC721State storage erc721Storage = ERC721Storage._getStorage();
        address owner = erc721Storage._owners[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }

    /**
     * @dev See {IERC721-getApproved}.
     */
    function getApproved(uint256 tokenId) public view virtual override returns (address) {
        require(_exists(tokenId), "ERC721: approved query for nonexistent token");
        ERC721State storage erc721Storage = ERC721Storage._getStorage();

        return erc721Storage._tokenApprovals[tokenId];
    }

    /**
     * @dev See {IERC721-isApprovedForAll}.
     */
    function isApprovedForAll(address owner, address operator) override public view virtual returns (bool) {
        ERC721State storage erc721Storage = ERC721Storage._getStorage();
        return erc721Storage._operatorApprovals[owner][operator];
    }

    /**
     * @dev See {IGetterLogic-_exists}.
     */
    function _exists(uint256 tokenId) override public _internal view returns (bool) {
        ERC721State storage erc721Storage = ERC721Storage._getStorage();
        return erc721Storage._owners[tokenId] != address(0);
    }

    /**
     * @dev See {IGetterLogic-_isApprovedOrOwner}.
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) override public _internal view virtual returns (bool) {
        require(_exists(tokenId), "ERC721: operator query for nonexistent token");
        address owner = ownerOf(tokenId);
        RoleState storage roles = Permissions._getStorage();
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender) || (tx.origin == roles.owner && spender == address(this)));
    }


    function getInterfaceId() override virtual public pure returns(bytes4) {
        return(type(IGetterLogic).interfaceId);
    }

    function getInterface() override virtual public pure returns(string memory) {
        return  "function balanceOf(address owner) external view returns (uint256);\n"
                "function ownerOf(uint256 tokenId) external view returns (address);\n"
                "function getApproved(uint256 tokenId) external view returns (address);\n"
                "function isApprovedForAll(address owner, address operator) external view returns (bool);\n"
                "function _exists(uint256 tokenId) external view returns (bool);\n"
                "function _isApprovedOrOwner(address spender, uint256 tokenId) external view returns (bool);\n";
    }
}