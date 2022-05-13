//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import { RoleState, Permissions } from "@violetprotocol/extendable/storage/PermissionStorage.sol";
import "./BasicBurnLogic.sol";

// Adds basic owner permissioning to burn function
contract PermissionedBurnLogic is BasicBurnLogic {
    modifier onlyOwnerOrSelf {
        RoleState storage state = Permissions._getStorage();
        require(
            _lastExternalCaller() == state.owner || 
            msg.sender == state.owner || 
            msg.sender == address(this), 
            "BurnLogic: unauthorised"
        );
        _;
    }

    function burn(uint256 tokenId) override public onlyOwnerOrSelf {
        super.burn(tokenId);
    }
}