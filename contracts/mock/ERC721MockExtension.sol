// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@violetprotocol/extendable/extensions/permissioning/PermissioningLogic.sol";
import "../extensions/base/ERC721.sol";
import "../extensions/base/getter/IGetterLogic.sol";
import "../extensions/base/mint/MintLogic.sol";
import "../extensions/base/mint/PermissionedMintLogic.sol";
import "../extensions/base/burn/BurnLogic.sol";
import "../extensions/base/burn/PermissionedBurnLogic.sol";

interface IERC721TokenExists {
    function exists(uint256 tokenId) external returns (bool);
}

/**
 * @title ERC721Mock
 * This mock just provides a public safeMint, mint, and burn functions for testing purposes
 */
contract ERC721MockExists is IERC721TokenExists, Extension {
    function exists(uint256 tokenId) public returns (bool) {
        return IGetterLogic(address(this))._exists(tokenId);
    }

    function getInterface() public pure virtual override returns (Interface[] memory interfaces) {
        interfaces = new Interface[](1);

        bytes4[] memory functions = new bytes4[](1);
        functions[0] = IERC721MockExtension.exists.selector;

        interfaces[0] = Interface(type(IERC721MockExtension).interfaceId, functions);
    }

    function getSolidityInterface() public pure virtual override returns (string memory) {
        return "function exists(uint256 tokenId) external returns (bool);\n";
    }
}

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
 * This mock just provides a public `safeMint` and `exists` functions for testing purposes
 */
contract ERC721MockExtension is Mint, Extension {
    function exists(uint256 tokenId) public returns (bool) {
        return IGetterLogic(address(this))._exists(tokenId);
    }

    function safeMint(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }

    function safeMint(
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public {
        _safeMint(to, tokenId, _data);
    }

    function getInterface() public pure virtual override returns (Interface[] memory interfaces) {
        interfaces = new Interface[](1);

        bytes4[] memory functions = new bytes4[](3);
        functions[0] = IERC721MockExtension.exists.selector;
        functions[1] = bytes4(keccak256("safeMint(address,uint256)"));
        functions[2] = bytes4(keccak256("safeMint(address,uint256,bytes)"));

        interfaces[0] = Interface(type(IERC721MockExtension).interfaceId, functions);
    }

    function getSolidityInterface() public pure virtual override returns (string memory) {
        return
            "function exists(uint256 tokenId) external returns (bool);\n"
            "function safeMint(address to, uint256 tokenId) external;\n"
            "function safeMint(address to, uint256 tokenId, bytes memory _data) external;\n";
    }
}

/**
 * @title PermissionedERC721Mock
 * This mock just provides a permissioned `safeMint`, and `exists` functions for testing purposes
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

    function exists(uint256 tokenId) public returns (bool) {
        return IGetterLogic(address(this))._exists(tokenId);
    }

    function safeMint(address to, uint256 tokenId) public onlyOwnerOrSelf {
        _safeMint(to, tokenId);
    }

    function safeMint(
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public onlyOwnerOrSelf {
        _safeMint(to, tokenId, _data);
    }

    function getInterface()
        public
        pure
        virtual
        override(MintExtension, BurnExtension)
        returns (Interface[] memory interfaces)
    {
        interfaces = new Interface[](1);

        bytes4[] memory functions = new bytes4[](3);
        functions[0] = IERC721MockExtension.exists.selector;
        functions[1] = bytes4(keccak256("safeMint(address,uint256)"));
        functions[2] = bytes4(keccak256("safeMint(address,uint256,bytes)"));

        interfaces[0] = Interface(type(IERC721MockExtension).interfaceId, functions);
    }

    function getSolidityInterface() public pure virtual override(MintExtension, BurnExtension) returns (string memory) {
        return
            "function exists(uint256 tokenId) external returns (bool);\n"
            "function safeMint(address to, uint256 tokenId) external;\n"
            "function safeMint(address to, uint256 tokenId, bytes memory _data) external;\n";
    }
}

contract CompilePermissioning is PermissioningLogic {}
