//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import { RoleState, Permissions } from "@violetprotocol/extendable/storage/PermissionStorage.sol";
import "./BasicMintLogic.sol";

/**
 * @title PermissionedMintLogic Extension
 *
 * Uses PermissioningLogic to restrict `mint` caller to only `owner` or the current contract
 */
contract PermissionedMintLogic is BasicMintLogic {
    modifier onlyOwnerOrSelf() virtual {
        RoleState storage state = Permissions._getStorage();
        require(
            _lastExternalCaller() == state.owner || msg.sender == state.owner || msg.sender == address(this),
            "MintLogic: unauthorised"
        );
        _;
    }

    function mint(address to, uint256 tokenId) public virtual override onlyOwnerOrSelf {
        super.mint(to, tokenId);
    }
}
