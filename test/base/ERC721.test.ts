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
        this.extend = <ExtendLogic>(await waffle.deployContract(this.signers.admin, this.artifacts.extend));
        this.permissioning = <PermissioningLogic>await waffle.deployContract(this.signers.admin, this.artifacts.permissioning);
        this.approve = <ApproveLogic>await waffle.deployContract(this.signers.admin, this.artifacts.approve);
        this.burn = <BasicBurnLogic>await waffle.deployContract(this.signers.admin, this.artifacts.burn);
        this.baseGetter = <GetterLogic>await waffle.deployContract(this.signers.admin, this.artifacts.baseGetter);
        this.beforeTransfer = <BeforeTransferLogic>await waffle.deployContract(this.signers.admin, this.artifacts.beforeTransfer);
        this.mint = <BasicMintLogic>await waffle.deployContract(this.signers.admin, this.artifacts.mint);
        this.onReceive = <OnReceiveLogic>await waffle.deployContract(this.signers.admin, this.artifacts.onReceive);
        this.transfer = <TransferLogic>await waffle.deployContract(this.signers.admin, this.artifacts.transfer);
        this.erc721MockExtension = <ERC721MockExtension>await waffle.deployContract(this.signers.admin, this.artifacts.erc721MockExtension);

        this.erc721 = <Extended<ERC721>>await deployExtendableContract(this.signers.admin, this.artifacts.erc721, ["TOKEN_NAME", "TOKEN_SYMBOL", this.extend.address, this.approve.address, this.baseGetter.address, this.onReceive.address, this.transfer.address, this.beforeTransfer.address])
        const tokenAsExtend = <ExtendLogic>await this.erc721.as(this.artifacts.extend);
        await tokenAsExtend.extend(this.erc721MockExtension.address);
    })

    shouldBehaveLikeERC721();
});