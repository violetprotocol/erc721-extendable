//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import { RoleState, Permissions } from "@violetprotocol/extendable/storage/PermissionStorage.sol";
import "./BurnLogic.sol";

/**
 * @title PermissionedBurnLogic Extension
 *
 * Uses PermissioningLogic to restrict `burn` caller to only `owner` or the current contract
 */
contract PermissionedBurnLogic is BurnLogic {
    modifier onlyOwnerOrSelf() virtual {
        RoleState storage state = Permissions._getState();
        require(
            _lastExternalCaller() == state.owner || msg.sender == state.owner || msg.sender == address(this),
            "BurnLogic: unauthorised"
        );
        _;
    }

    function burn(uint256 tokenId) public virtual override onlyOwnerOrSelf {
        super.burn(tokenId);
    }
}
