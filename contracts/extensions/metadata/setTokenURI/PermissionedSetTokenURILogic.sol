//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import { RoleState, Permissions } from "@violetprotocol/extendable/storage/PermissionStorage.sol";
import "./BasicSetTokenURILogic.sol";

/**
 * @title PermissionedSetTokenURILogic Extension
 *
 * Uses PermissioningLogic to restrict `setTokenURI` caller to only `owner` or the current contract
 */
contract PermissionedSetTokenURILogic is BasicSetTokenURILogic {
    modifier onlyOwnerOrSelf virtual {
        RoleState storage state = Permissions._getStorage();
        require(
            _lastExternalCaller() == state.owner || 
            msg.sender == state.owner || 
            msg.sender == address(this), 
            "SetTokenURI: unauthorised"
        );
        _;
    }

    /**
     * @dev See {ISetTokenURILogic-_setTokenURI}.
     */
    function setTokenURI(uint256 tokenId, string memory _tokenURI) override public virtual onlyOwnerOrSelf {
        super.setTokenURI(tokenId, _tokenURI);
    }
    /**
     * @dev See {ISetTokenURILogic-_setBaseURI}.
     */
    function setBaseURI(string memory _baseURI) override public virtual onlyOwnerOrSelf {
        super.setBaseURI(_baseURI);
    }
}