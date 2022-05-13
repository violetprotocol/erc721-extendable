//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import { RoleState, Permissions } from "@violetprotocol/extendable/storage/PermissionStorage.sol";
import "./BasicMintLogic.sol";

// Adds basic owner permissioning to mint function
contract PermissionedMintLogic is BasicMintLogic {
    modifier onlyOwnerOrSelf {
        RoleState storage state = Permissions._getStorage();
        require(
            _lastExternalCaller() == state.owner || 
            msg.sender == state.owner || 
            msg.sender == address(this), 
            "MintLogic: unauthorised"
        );
        _;
    }

    function mint(address to, uint256 tokenId) override public onlyOwnerOrSelf {
        super.mint(to, tokenId);
    }
}