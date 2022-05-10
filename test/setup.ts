import { artifacts, ethers, waffle } from "hardhat";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { deployExtendableContract, Extended, Signers } from "./types";
import { Artifacts } from "hardhat/types";
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
  BasicSetTokenURILogic,
 } from "../src/types";

const chai = require("chai");
const { solidity } = waffle;
chai.use(solidity);

export const TOKEN_NAME = "ERC721 Extendable";
export const TOKEN_SYMBOL = "721EXT";

export const enum MODULE {
    BASE = "base",
    ENUMERABLE = "enumerable",
    METADATA = "metadata",
    METADATAENUMERABLE = "metadataenumerable"
}

before("setup", async function () {
    this.signers = {} as Signers;
    
    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.operator = signers[1];
    this.signers.owner = signers[2];
    this.signers.toWhom = signers[3];
    this.signers.other = signers[4];
    this.signers.approved = signers[5];
    this.signers.anotherApproved = signers[6];
    this.signers.user = signers[7];
    this.signers.newOwner = signers[8];

    const extendArtifact = await artifacts.readArtifact("ExtendLogic");
    const permissioningArtifact = await artifacts.readArtifact("PermissioningLogic");

    const erc721Artifact = await artifacts.readArtifact("ERC721");
    const erc721MetadataArtifact = await artifacts.readArtifact("ERC721Metadata");
    const erc721EnumerableArtifact = await artifacts.readArtifact("ERC721Enumerable");
    const erc721ReceiverMock = await artifacts.readArtifact("ERC721ReceiverMock");
    const erc721MockExtensionArtifact = await artifacts.readArtifact("ERC721MockExtension");

    const approveArtifact = await artifacts.readArtifact("ApproveLogic");
    const burnArtifact = await artifacts.readArtifact("BasicBurnLogic");
    const baseGetterArtifact = await artifacts.readArtifact("GetterLogic");
    const beforeTransferArtifact = await artifacts.readArtifact("BeforeTransferLogic");
    const mintArtifact = await artifacts.readArtifact("BasicMintLogic");
    const onReceiveArtifact = await artifacts.readArtifact("OnReceiveLogic");
    const transferArtifact = await artifacts.readArtifact("TransferLogic");

    const enumerableGetterArtifact = await artifacts.readArtifact("EnumerableGetterLogic");
    const enumerableBeforeTransferArtifact = await artifacts.readArtifact("EnumerableBeforeTransferLogic");

    const metadataBurnArtifact = await artifacts.readArtifact("MetadataBurnLogic");
    const metadataGetterArtifact = await artifacts.readArtifact("MetadataGetterLogic");
    const setTokenUriArtifact = await artifacts.readArtifact("BasicSetTokenURILogic");

    this.artifacts = {
        extend: extendArtifact,
        permissioning: permissioningArtifact,
        erc721: erc721Artifact,
        erc721Metadata: erc721MetadataArtifact,
        erc721Enumerable: erc721EnumerableArtifact,
        erc721Receiver: erc721ReceiverMock,
        erc721MockExtension: erc721MockExtensionArtifact,
        approve: approveArtifact,
        burn: burnArtifact,
        baseGetter: baseGetterArtifact,
        beforeTransfer: beforeTransferArtifact,
        mint: mintArtifact,
        onReceive: onReceiveArtifact,
        transfer: transferArtifact,
        enumerableGetter: enumerableGetterArtifact,
        enumerableBeforeTransfer: enumerableBeforeTransferArtifact,
        metadataBurn: metadataBurnArtifact,
        metadataGetter: metadataGetterArtifact,
        setTokenUri: setTokenUriArtifact
    }

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

    this.enumerableGetter = <EnumerableGetterLogic>await waffle.deployContract(this.signers.admin, this.artifacts.enumerableGetter);
    this.enumerableBeforeTransfer = <EnumerableBeforeTransferLogic>await waffle.deployContract(this.signers.admin, this.artifacts.enumerableBeforeTransfer);

    this.metadataBurn = <MetadataBurnLogic>await waffle.deployContract(this.signers.admin, this.artifacts.metadataBurn);
    this.metadataGetter = <MetadataGetterLogic>await waffle.deployContract(this.signers.admin, this.artifacts.metadataGetter);
    this.setTokenUri = <BasicSetTokenURILogic>await waffle.deployContract(this.signers.admin, this.artifacts.setTokenUri);

    this.redeploy = async function (module: MODULE) {
        switch(module) {
            case MODULE.BASE:
                await this.redeployBase();
                break;
            case MODULE.ENUMERABLE:
                await this.redeployEnumerable();
                break;
            case MODULE.METADATA:
                await this.redeployMetadata();
                break;
            case MODULE.METADATAENUMERABLE:
                await this.redeployMetadataEnumerable();
                break;
        }
    }

    this.redeployBase = async function () {
        this.erc721 = <Extended<ERC721>>await deployExtendableContract(this.signers.admin, this.artifacts.erc721, [TOKEN_NAME, TOKEN_SYMBOL, this.extend.address, this.approve.address, this.baseGetter.address, this.onReceive.address, this.transfer.address, this.beforeTransfer.address]) 
        this.tokenAsExtend = <ExtendLogic>await this.erc721.as(this.artifacts.extend);
        await this.tokenAsExtend.extend(this.erc721MockExtension.address);
    
        this.tokenAsApprove = <ApproveLogic>await this.erc721.as(this.artifacts.approve);
        this.tokenAsBurn = <BasicBurnLogic>await this.erc721.as(this.artifacts.burn);
        this.tokenAsBaseGetter = <GetterLogic>await this.erc721.as(this.artifacts.baseGetter);
        this.tokenAsBeforeTransfer = <BeforeTransferLogic>await this.erc721.as(this.artifacts.beforeTransfer);
        this.tokenAsOnReceive = <OnReceiveLogic>await this.erc721.as(this.artifacts.onReceive);
        this.tokenAsTransfer = <TransferLogic>await this.erc721.as(this.artifacts.transfer);
        this.tokenAsErc721MockExtension = <ERC721MockExtension>await this.erc721.as(this.artifacts.erc721MockExtension);
    }

    this.redeployEnumerable = async function () {
        this.erc721Enumerable = <Extended<ERC721Enumerable>>await deployExtendableContract(this.signers.admin, this.artifacts.erc721Enumerable, [TOKEN_NAME, TOKEN_SYMBOL, this.extend.address, this.approve.address, this.baseGetter.address, this.onReceive.address, this.transfer.address, this.enumerableBeforeTransfer.address, this.enumerableGetter.address]) 
        this.tokenAsExtend = <ExtendLogic>await this.erc721Enumerable.as(this.artifacts.extend);
        await this.tokenAsExtend.extend(this.erc721MockExtension.address);

        this.tokenAsApprove = <ApproveLogic>await this.erc721Enumerable.as(this.artifacts.approve);
        this.tokenAsBurn = <BasicBurnLogic>await this.erc721Enumerable.as(this.artifacts.burn);
        this.tokenAsBaseGetter = <GetterLogic>await this.erc721Enumerable.as(this.artifacts.baseGetter);
        this.tokenAsEnumerableGetter = <EnumerableGetterLogic>await this.erc721Enumerable.as(this.artifacts.enumerableGetter);
        this.tokenAsEnumerableBeforeTransfer = <EnumerableBeforeTransferLogic>await this.erc721Enumerable.as(this.artifacts.enumerableBeforeTransfer);
        this.tokenAsOnReceive = <OnReceiveLogic>await this.erc721Enumerable.as(this.artifacts.onReceive);
        this.tokenAsTransfer = <TransferLogic>await this.erc721Enumerable.as(this.artifacts.transfer);
        this.tokenAsErc721MockExtension = <ERC721MockExtension>await this.erc721Enumerable.as(this.artifacts.erc721MockExtension);
    }

    this.redeployMetadata = async function () {
        this.erc721Metadata = <Extended<ERC721Metadata>>await deployExtendableContract(this.signers.admin, this.artifacts.erc721Metadata, [TOKEN_NAME, TOKEN_SYMBOL, this.extend.address, this.approve.address, this.baseGetter.address, this.onReceive.address, this.transfer.address, this.beforeTransfer.address]) 
        await this.erc721Metadata.connect(this.signers.admin).finaliseERC721MetadataExtending(this.metadataGetter.address, this.setTokenUri.address, this.mint.address, this.metadataBurn.address);
       
        // only to provide access to `exists` function, all other functions are shadowed by previous extensions
        this.tokenAsExtend = <ExtendLogic>await this.erc721Metadata.as(this.artifacts.extend);
        await this.tokenAsExtend.extend(this.erc721MockExtension.address);

        this.tokenAsApprove = <ApproveLogic>await this.erc721Metadata.as(this.artifacts.approve);
        this.tokenAsMint = <BasicMintLogic>await this.erc721Metadata.as(this.artifacts.mint);
        this.tokenAsBurn = <MetadataBurnLogic>await this.erc721Metadata.as(this.artifacts.metadataBurn);
        this.tokenAsBaseGetter = <GetterLogic>await this.erc721Metadata.as(this.artifacts.baseGetter);
        this.tokenAsMetadataGetter = <MetadataGetterLogic>await this.erc721Metadata.as(this.artifacts.metadataGetter);
        this.tokenAsBeforeTransfer = <BeforeTransferLogic>await this.erc721Metadata.as(this.artifacts.beforeTransfer);
        this.tokenAsOnReceive = <OnReceiveLogic>await this.erc721Metadata.as(this.artifacts.onReceive);
        this.tokenAsTransfer = <TransferLogic>await this.erc721Metadata.as(this.artifacts.transfer);
        this.tokenAsSetTokenURI = <BasicSetTokenURILogic>await this.erc721Metadata.as(this.artifacts.setTokenUri);
        this.tokenAsErc721MockExtension = <ERC721MockExtension>await this.erc721Metadata.as(this.artifacts.erc721MockExtension);
    }

    this.redeployMetadataEnumerable = async function () {
        // Deploy metadata as initial base
        this.erc721Metadata = <Extended<ERC721Metadata>>await deployExtendableContract(this.signers.admin, this.artifacts.erc721Metadata, [TOKEN_NAME, TOKEN_SYMBOL, this.extend.address, this.approve.address, this.baseGetter.address, this.onReceive.address, this.transfer.address, this.enumerableBeforeTransfer.address]) 
        await this.erc721Metadata.connect(this.signers.admin).finaliseERC721MetadataExtending(this.metadataGetter.address, this.setTokenUri.address, this.mint.address, this.metadataBurn.address);
       
        // only to provide access to `exists` function, all other functions are shadowed by previous extensions
        this.tokenAsExtend = <ExtendLogic>await this.erc721Metadata.as(this.artifacts.extend);
        await this.tokenAsExtend.extend(this.erc721MockExtension.address);
        
        // Extend Metadata with enumerable getter
        this.tokenAsExtend = <ExtendLogic>await this.erc721Metadata.as(this.artifacts.extend);
        await this.tokenAsExtend.extend(this.enumerableGetter.address);

        this.tokenAsApprove = <ApproveLogic>await this.erc721Metadata.as(this.artifacts.approve);
        this.tokenAsMint = <BasicMintLogic>await this.erc721Metadata.as(this.artifacts.mint);
        this.tokenAsBurn = <MetadataBurnLogic>await this.erc721Metadata.as(this.artifacts.metadataBurn);
        this.tokenAsBaseGetter = <GetterLogic>await this.erc721Metadata.as(this.artifacts.baseGetter);
        this.tokenAsMetadataGetter = <MetadataGetterLogic>await this.erc721Metadata.as(this.artifacts.metadataGetter);
        this.tokenAsBeforeTransfer = <EnumerableBeforeTransferLogic>await this.erc721Metadata.as(this.artifacts.enumerableBeforeTransfer);
        this.tokenAsOnReceive = <OnReceiveLogic>await this.erc721Metadata.as(this.artifacts.onReceive);
        this.tokenAsTransfer = <TransferLogic>await this.erc721Metadata.as(this.artifacts.transfer);
        this.tokenAsSetTokenURI = <BasicSetTokenURILogic>await this.erc721Metadata.as(this.artifacts.setTokenUri);
        this.tokenAsErc721MockExtension = <ERC721MockExtension>await this.erc721Metadata.as(this.artifacts.erc721MockExtension);
        this.tokenAsEnumerableGetter = <EnumerableGetterLogic>await this.erc721Metadata.as(this.artifacts.enumerableGetter);
    }
});