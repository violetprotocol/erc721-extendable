//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import { RoleState, Permissions } from "@violetprotocol/extendable/storage/PermissionStorage.sol";
import "./MetadataBurnLogic.sol";

/**
 * @title PermissionedMetadataBurnLogic Extension
 *
 * Uses PermissioningLogic to restrict metadata `burn` caller to only `owner` or the current contract
 */
contract PermissionedMetadataBurnLogic is MetadataBurnLogic {
    modifier onlyOwnerOrSelf virtual {
        RoleState storage state = Permissions._getStorage();
        require(
            _lastExternalCaller() == state.owner || 
            msg.sender == state.owner || 
            msg.sender == address(this), 
            "MetadataBurnLogic: unauthorised"
        );
        _;
    }
    
    function burn(uint256 tokenId) override public virtual onlyOwnerOrSelf {
        super.burn(tokenId);
    }
}