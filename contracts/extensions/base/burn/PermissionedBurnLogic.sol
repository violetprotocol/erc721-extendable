//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import { RoleState, Permissions } from "@violetprotocol/extendable/storage/PermissionStorage.sol";
import "./BasicBurnLogic.sol";

/**
 * @title PermissionedBurnLogic Extension
 *
 * Uses PermissioningLogic to restrict `burn` caller to only `owner` or the current contract
 */
contract PermissionedBurnLogic is BasicBurnLogic {
    modifier onlyOwnerOrSelf virtual {
        RoleState storage state = Permissions._getStorage();
        require(
            _lastExternalCaller() == state.owner || 
            msg.sender == state.owner || 
            msg.sender == address(this), 
            "BurnLogic: unauthorised"
        );
        _;
    }

    function burn(uint256 tokenId) override public virtual onlyOwnerOrSelf {
        super.burn(tokenId);
    }
}