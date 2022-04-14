//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@violetprotocol/extendable/extendable/Extendable.sol";
import "@violetprotocol/extendable/extensions/extend/IExtendLogic.sol";
import { ERC721State, ERC721Storage } from "../../storage/ERC721Storage.sol";

// Functional logic extracted from openZeppelin:
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
// To follow Extension principles, maybe best to separate each function into a different Extension
contract ERC721 is Extendable {
    constructor(string memory name_, string memory symbol_, 
        address extendLogic,
        address approveLogic,
        address getterLogic,
        address onReceiveLogic,
        address transferLogic,
        address beforeTransferLogic
    ) Extendable(extendLogic) {
        ERC721State storage erc721Storage = ERC721Storage._getStorage();
        erc721Storage._name = name_;
        erc721Storage._symbol = symbol_;

        IExtendLogic(address(this)).extend(approveLogic);
        IExtendLogic(address(this)).extend(getterLogic);
        IExtendLogic(address(this)).extend(onReceiveLogic);
        IExtendLogic(address(this)).extend(transferLogic);
        IExtendLogic(address(this)).extend(beforeTransferLogic);
    }
}