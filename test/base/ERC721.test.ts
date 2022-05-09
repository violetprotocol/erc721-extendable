import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { shouldBehaveLikeERC721 } from "./ERC721.behaviour";
import { attachExtendableContract, deployExtendableContract, Extended } from "../types";
import { 
    ExtendLogic,
    PermissioningLogic,
    ERC721,
    ERC721Metadata,
    ERC721Enumerable,
    ERC721MockExtension,
    ERC721ReceiverMock,
    ApproveLogic,
    BasicBurnLogic,
    GetterLogic,
    BeforeTransferLogic,
    BasicMintLogic,
    OnReceiveLogic,
    TransferLogic,
    EnumerableGetterLogic,
    EnumerableBeforeTransferLogic,
    MetadataBurnLogic,
    MetadataGetterLogic,
    SetTokenURILogic,
   } from "../../src/types";

const chai = require("chai");
const { solidity } = waffle;
chai.use(solidity);
const { expect } = chai;

describe("ERC721", function () {
    before("deploy new", async function () {
        await this.redeploy();
    })

    shouldBehaveLikeERC721();
});