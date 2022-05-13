//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import { RoleState, Permissions } from "@violetprotocol/extendable/storage/PermissionStorage.sol";
import "./BasicSetTokenURILogic.sol";

// Functional logic extracted from openZeppelin:
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol

// This contract should be inherited by your own custom `mint` logic which makes a call to `_mint` or `_safeMint`
contract PermissionedSetTokenURILogic is BasicSetTokenURILogic {
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