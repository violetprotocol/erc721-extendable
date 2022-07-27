//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IBasicMintLogic.sol";
import "./MintLogic.sol";

// Functional logic extracted from openZeppelin:
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol

// This contract should be inherited by your own custom `mint` logic which makes a call to `_mint` or `_safeMint`
contract BasicMintLogic is IBasicMintLogic, MintLogic {
    /**
     * @dev Safely mints `tokenId` and transfers it to `to`.
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - If `to` refers to a smart contract,
     *      it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function mint(address to, uint256 tokenId) public virtual override {
        _safeMint(to, tokenId);
    }

    function getInterfaceId() public pure virtual override returns (bytes4) {
        return (type(IBasicMintLogic).interfaceId);
    }

    function getInterface() public pure virtual override returns (string memory) {
        return "function mint(address to, uint256 amount) external;\n";
    }
}
