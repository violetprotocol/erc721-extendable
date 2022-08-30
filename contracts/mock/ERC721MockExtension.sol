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

    function mint(address to, uint256 tokenId) public override {
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

    function burn(uint256 tokenId) public override {
        _burn(tokenId);
    }

    function getInterface()
        public
        pure
        virtual
        override(MintExtension, BurnExtension)
        returns (Interface[] memory interfaces)
    {
        interfaces = new Interface[](1);

        bytes4[] memory functions = new bytes4[](6);
        functions[0] = IERC721MockExtension.baseURI.selector;
        functions[1] = IERC721MockExtension.exists.selector;
        functions[2] = IERC721MockExtension.mint.selector;
        functions[3] = bytes4(keccak256("safeMint(address,uint256)"));
        functions[4] = bytes4(keccak256("safeMint(address,uint256,bytes)"));
        functions[5] = IERC721MockExtension.burn.selector;

        interfaces[0] = Interface(type(IERC721MockExtension).interfaceId, functions);
    }

    function getSolidityInterface() public pure virtual override(MintExtension, BurnExtension) returns (string memory) {
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
        RoleState storage state = Permissions._getState();
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

    function getInterface()
        public
        pure
        virtual
        override(MintExtension, BurnExtension)
        returns (Interface[] memory interfaces)
    {
        interfaces = new Interface[](1);

        bytes4[] memory functions = new bytes4[](6);
        functions[0] = IERC721MockExtension.baseURI.selector;
        functions[1] = IERC721MockExtension.exists.selector;
        functions[2] = IERC721MockExtension.mint.selector;
        functions[3] = bytes4(keccak256("safeMint(address,uint256)"));
        functions[4] = bytes4(keccak256("safeMint(address,uint256,bytes)"));
        functions[5] = IERC721MockExtension.burn.selector;

        interfaces[0] = Interface(type(IERC721MockExtension).interfaceId, functions);
    }

    function getSolidityInterface() public pure virtual override(MintExtension, BurnExtension) returns (string memory) {
        return
            "function baseURI() external returns (string memory);\n"
            "function exists(uint256 tokenId) external returns (bool);\n"
            "function mint(address to, uint256 tokenId) external;\n"
            "function safeMint(address to, uint256 tokenId) external;\n"
            "function safeMint(address to, uint256 tokenId, bytes memory _data) external;\n"
            "function burn(uint256 tokenId) external;\n";
    }
}
