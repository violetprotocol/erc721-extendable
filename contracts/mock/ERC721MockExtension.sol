// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "../extensions/base/ERC721.sol";
import "../extensions/base/getter/IGetterLogic.sol";
import "../extensions/base/mint/MintLogic.sol";
import "../extensions/base/mint/PermissionedMintLogic.sol";
import "../extensions/base/burn/BurnLogic.sol";
import "../extensions/base/burn/PermissionedBurnLogic.sol";

interface IERC721MockExtension {
    function baseURI() external returns (string memory);

    function exists(uint256 tokenId) external returns (bool);

    function mint(address to, uint256 tokenId) external;

    function safeMint(address to, uint256 tokenId) external;

    function safeMint(
        address to,
        uint256 tokenId,
        bytes memory _data
    ) external;

    function burn(uint256 tokenId) external;
}

/**
 * @title ERC721Mock
 * This mock just provides a public safeMint, mint, and burn functions for testing purposes
 */
contract ERC721MockExtension is MintLogic, BurnLogic {
    function baseURI() public view returns (string memory) {
        return "";
    }

    function exists(uint256 tokenId) public returns (bool) {
        return IGetterLogic(address(this))._exists(tokenId);
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function safeMint(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }

    function safeMint(
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public {
        console.log("safe mint");
        _safeMint(to, tokenId, _data);
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }

    function getInterfaceId() public pure virtual override returns (bytes4) {
        return (type(IERC721MockExtension).interfaceId);
    }

    function getInterface() public pure virtual override returns (string memory) {
        return
            "function baseURI() external returns (string memory);\n"
            "function exists(uint256 tokenId) external returns (bool);\n"
            "function mint(address to, uint256 tokenId) external;\n"
            "function safeMint(address to, uint256 tokenId) external;\n"
            "function safeMint(address to, uint256 tokenId, bytes memory _data) external;\n"
            "function burn(uint256 tokenId) external;\n";
    }
}

/**
 * @title PermissionedERC721Mock
 * This mock just provides a permissioned safeMint, mint, and burn functions for testing purposes
 */
contract PermissionedERC721MockExtension is PermissionedMintLogic, PermissionedBurnLogic {
    // Copied from PermissionedMintLogic/PermissionedBurnLogic
    modifier onlyOwnerOrSelf() override(PermissionedMintLogic, PermissionedBurnLogic) {
        RoleState storage state = Permissions._getStorage();
        require(
            _lastExternalCaller() == state.owner || msg.sender == state.owner || msg.sender == address(this),
            "Logic: unauthorised"
        );
        _;
    }

    // shadowed by ERC721Metadata_baseURI if extended first
    function baseURI() public view returns (string memory) {
        return "";
    }

    function exists(uint256 tokenId) public returns (bool) {
        return IGetterLogic(address(this))._exists(tokenId);
    }

    function mint(address to, uint256 tokenId) public override {
        super.mint(to, tokenId);
    }

    function safeMint(address to, uint256 tokenId) public onlyOwnerOrSelf {
        _safeMint(to, tokenId);
    }

    function safeMint(
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public onlyOwnerOrSelf {
        console.log("permissioned safe mint");
        _safeMint(to, tokenId, _data);
    }

    function burn(uint256 tokenId) public override {
        super.burn(tokenId);
    }

    function getInterfaceId() public pure virtual override(BasicMintLogic, BasicBurnLogic) returns (bytes4) {
        return (type(IERC721MockExtension).interfaceId);
    }

    function getInterface() public pure virtual override(BasicMintLogic, BasicBurnLogic) returns (string memory) {
        return
            "function baseURI() external returns (string memory);\n"
            "function exists(uint256 tokenId) external returns (bool);\n"
            "function mint(address to, uint256 tokenId) external;\n"
            "function safeMint(address to, uint256 tokenId) external;\n"
            "function safeMint(address to, uint256 tokenId, bytes memory _data) external;\n"
            "function burn(uint256 tokenId) external;\n";
    }
}
