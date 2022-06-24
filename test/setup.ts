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
  ApproveLogic,
  BasicBurnLogic,
  GetterLogic,
  ERC721HooksLogic,
  BasicMintLogic,
  OnReceiveLogic,
  TransferLogic,
  EnumerableGetterLogic,
  EnumerableHooksLogic,
  MetadataBurnLogic,
  MetadataGetterLogic,
  SetTokenURILogic,
  BasicSetTokenURILogic,
  PermissionedBurnLogic,
  PermissionedMintLogic,
  PermissionedMetadataBurnLogic,
  PermissionedSetTokenURILogic,
  PermissionedERC721MockExtension,
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
    const permissionedErc721MockExtensionArtifact = await artifacts.readArtifact("PermissionedERC721MockExtension");

    const approveArtifact = await artifacts.readArtifact("ApproveLogic");
    const burnArtifact = await artifacts.readArtifact("BasicBurnLogic");
    const permissionedBurnArtifact = await artifacts.readArtifact("PermissionedBurnLogic");
    const baseGetterArtifact = await artifacts.readArtifact("GetterLogic");
    const hooksArtifact = await artifacts.readArtifact("ERC721HooksLogic");
    const mintArtifact = await artifacts.readArtifact("BasicMintLogic");
    const permissionedMintArtifact = await artifacts.readArtifact("PermissionedMintLogic");
    const onReceiveArtifact = await artifacts.readArtifact("OnReceiveLogic");
    const transferArtifact = await artifacts.readArtifact("TransferLogic");

    const enumerableGetterArtifact = await artifacts.readArtifact("EnumerableGetterLogic");
    const enumerableHooksArtifact = await artifacts.readArtifact("EnumerableHooksLogic");

    const metadataBurnArtifact = await artifacts.readArtifact("MetadataBurnLogic");
    const permissionedMetadataBurnArtifact = await artifacts.readArtifact("PermissionedMetadataBurnLogic");
    const metadataGetterArtifact = await artifacts.readArtifact("MetadataGetterLogic");
    const setTokenUriArtifact = await artifacts.readArtifact("BasicSetTokenURILogic");
    const permissionedSetTokenUriArtifact = await artifacts.readArtifact("PermissionedSetTokenURILogic");

    this.artifacts = {
        extend: extendArtifact,
        permissioning: permissioningArtifact,
        erc721: erc721Artifact,
        erc721Metadata: erc721MetadataArtifact,
        erc721Enumerable: erc721EnumerableArtifact,
        erc721Receiver: erc721ReceiverMock,
        erc721MockExtension: erc721MockExtensionArtifact,
        permissionedErc721MockExtension: permissionedErc721MockExtensionArtifact,
        approve: approveArtifact,
        burn: burnArtifact,
        permissionedBurn: permissionedBurnArtifact,
        baseGetter: baseGetterArtifact,
        hooks: hooksArtifact,
        mint: mintArtifact,
        permissionedMint: permissionedMintArtifact,
        onReceive: onReceiveArtifact,
        transfer: transferArtifact,
        enumerableGetter: enumerableGetterArtifact,
        enumerableHooks: enumerableHooksArtifact,
        metadataBurn: metadataBurnArtifact,
        permissionedMetadataBurn: permissionedMetadataBurnArtifact,
        metadataGetter: metadataGetterArtifact,
        setTokenUri: setTokenUriArtifact,
        permissionedSetTokenUri: permissionedSetTokenUriArtifact
    }

    this.extend = <ExtendLogic>(await waffle.deployContract(this.signers.admin, this.artifacts.extend));
    this.permissioning = <PermissioningLogic>await waffle.deployContract(this.signers.admin, this.artifacts.permissioning);
    this.approve = <ApproveLogic>await waffle.deployContract(this.signers.admin, this.artifacts.approve);
    this.burn = <BasicBurnLogic>await waffle.deployContract(this.signers.admin, this.artifacts.burn);
    this.permissionedBurn = <PermissionedBurnLogic>await waffle.deployContract(this.signers.admin, this.artifacts.permissionedBurn);
    this.baseGetter = <GetterLogic>await waffle.deployContract(this.signers.admin, this.artifacts.baseGetter);
    this.hooks = <ERC721HooksLogic>await waffle.deployContract(this.signers.admin, this.artifacts.hooks);
    this.mint = <BasicMintLogic>await waffle.deployContract(this.signers.admin, this.artifacts.mint);
    this.permissionedMint = <PermissionedMintLogic>await waffle.deployContract(this.signers.admin, this.artifacts.permissionedMint);
    this.onReceive = <OnReceiveLogic>await waffle.deployContract(this.signers.admin, this.artifacts.onReceive);
    this.transfer = <TransferLogic>await waffle.deployContract(this.signers.admin, this.artifacts.transfer);
    this.erc721MockExtension = <ERC721MockExtension>await waffle.deployContract(this.signers.admin, this.artifacts.erc721MockExtension);
    this.permissionedErc721MockExtension = <PermissionedERC721MockExtension>await waffle.deployContract(this.signers.admin, this.artifacts.permissionedErc721MockExtension);

    this.enumerableGetter = <EnumerableGetterLogic>await waffle.deployContract(this.signers.admin, this.artifacts.enumerableGetter);
    this.enumerableHooks = <EnumerableHooksLogic>await waffle.deployContract(this.signers.admin, this.artifacts.enumerableHooks);

    this.metadataBurn = <MetadataBurnLogic>await waffle.deployContract(this.signers.admin, this.artifacts.metadataBurn);
    this.permissionedMetadataBurn = <PermissionedMetadataBurnLogic>await waffle.deployContract(this.signers.admin, this.artifacts.permissionedMetadataBurn);
    this.metadataGetter = <MetadataGetterLogic>await waffle.deployContract(this.signers.admin, this.artifacts.metadataGetter);
    this.setTokenUri = <BasicSetTokenURILogic>await waffle.deployContract(this.signers.admin, this.artifacts.setTokenUri);
    this.permissionedSetTokenUri = <PermissionedSetTokenURILogic>await waffle.deployContract(this.signers.admin, this.artifacts.permissionedSetTokenUri);

    this.redeploy = async function (module: MODULE, permissioned: boolean) {
        switch(module) {
            case MODULE.BASE:
                await this.redeployBase(permissioned);
                break;
            case MODULE.ENUMERABLE:
                await this.redeployEnumerable(permissioned);
                break;
            case MODULE.METADATA:
                await this.redeployMetadata(permissioned);
                break;
            case MODULE.METADATAENUMERABLE:
                await this.redeployMetadataEnumerable(permissioned);
                break;
        }
    }

    this.redeployBase = async function (permissioned: boolean) {
        this.erc721 = <Extended<ERC721>>await deployExtendableContract(this.signers.admin, this.artifacts.erc721, [TOKEN_NAME, TOKEN_SYMBOL, this.extend.address, this.approve.address, this.baseGetter.address, this.onReceive.address, this.transfer.address, this.hooks.address]) 
        this.tokenAsExtend = <ExtendLogic>await this.erc721.as(this.artifacts.extend);
        if (permissioned) await this.tokenAsExtend.extend(this.permissionedErc721MockExtension.address);
        else await this.tokenAsExtend.extend(this.erc721MockExtension.address);
    
        this.tokenAsApprove = <ApproveLogic>await this.erc721.as(this.artifacts.approve);
        this.tokenAsBurn = <BasicBurnLogic>await this.erc721.as(this.artifacts.burn);
        this.tokenAsBaseGetter = <GetterLogic>await this.erc721.as(this.artifacts.baseGetter);
        this.tokenAsOnReceive = <OnReceiveLogic>await this.erc721.as(this.artifacts.onReceive);
        this.tokenAsTransfer = <TransferLogic>await this.erc721.as(this.artifacts.transfer);
        this.tokenAsErc721MockExtension = <ERC721MockExtension>await this.erc721.as(this.artifacts.erc721MockExtension);
    }

    this.redeployEnumerable = async function () {
        this.erc721Enumerable = <Extended<ERC721Enumerable>>await deployExtendableContract(this.signers.admin, this.artifacts.erc721Enumerable, [TOKEN_NAME, TOKEN_SYMBOL, this.extend.address, this.approve.address, this.baseGetter.address, this.onReceive.address, this.transfer.address, this.enumerableHooks.address, this.enumerableGetter.address]) 
        this.tokenAsExtend = <ExtendLogic>await this.erc721Enumerable.as(this.artifacts.extend);
        await this.tokenAsExtend.extend(this.erc721MockExtension.address);

        this.tokenAsApprove = <ApproveLogic>await this.erc721Enumerable.as(this.artifacts.approve);
        this.tokenAsBurn = <BasicBurnLogic>await this.erc721Enumerable.as(this.artifacts.burn);
        this.tokenAsBaseGetter = <GetterLogic>await this.erc721Enumerable.as(this.artifacts.baseGetter);
        this.tokenAsEnumerableGetter = <EnumerableGetterLogic>await this.erc721Enumerable.as(this.artifacts.enumerableGetter);
        this.tokenAsOnReceive = <OnReceiveLogic>await this.erc721Enumerable.as(this.artifacts.onReceive);
        this.tokenAsTransfer = <TransferLogic>await this.erc721Enumerable.as(this.artifacts.transfer);
        this.tokenAsErc721MockExtension = <ERC721MockExtension>await this.erc721Enumerable.as(this.artifacts.erc721MockExtension);
    }

    this.redeployMetadata = async function (permissioned: boolean) {
        this.erc721Metadata = <Extended<ERC721Metadata>>await deployExtendableContract(this.signers.admin, this.artifacts.erc721Metadata, [TOKEN_NAME, TOKEN_SYMBOL, this.extend.address, this.approve.address, this.baseGetter.address, this.onReceive.address, this.transfer.address, this.hooks.address]) 
        await this.erc721Metadata.connect(this.signers.admin).finaliseERC721MetadataExtending(
            this.metadataGetter.address, 
            permissioned? this.permissionedSetTokenUri.address : this.setTokenUri.address, 
            permissioned? this.permissionedMint.address : this.mint.address, 
            permissioned? this.permissionedMetadataBurn.address : this.metadataBurn.address
        );
       
        // only to provide access to `exists` function, all other functions are shadowed by previous extensions
        this.tokenAsExtend = <ExtendLogic>await this.erc721Metadata.as(this.artifacts.extend);
        await this.tokenAsExtend.extend(this.erc721MockExtension.address);

        this.tokenAsApprove = <ApproveLogic>await this.erc721Metadata.as(this.artifacts.approve);
        this.tokenAsMint = <BasicMintLogic>await this.erc721Metadata.as(this.artifacts.mint);
        this.tokenAsBurn = <MetadataBurnLogic>await this.erc721Metadata.as(this.artifacts.metadataBurn);
        this.tokenAsBaseGetter = <GetterLogic>await this.erc721Metadata.as(this.artifacts.baseGetter);
        this.tokenAsMetadataGetter = <MetadataGetterLogic>await this.erc721Metadata.as(this.artifacts.metadataGetter);
        this.tokenAsOnReceive = <OnReceiveLogic>await this.erc721Metadata.as(this.artifacts.onReceive);
        this.tokenAsTransfer = <TransferLogic>await this.erc721Metadata.as(this.artifacts.transfer);
        this.tokenAsSetTokenURI = <BasicSetTokenURILogic>await this.erc721Metadata.as(this.artifacts.setTokenUri);
        this.tokenAsErc721MockExtension = <ERC721MockExtension>await this.erc721Metadata.as(this.artifacts.erc721MockExtension);
    }

    this.redeployMetadataEnumerable = async function (permissioned: boolean) {
        // Deploy metadata as initial base
        this.erc721Metadata = <Extended<ERC721Metadata>>await deployExtendableContract(this.signers.admin, this.artifacts.erc721Metadata, [TOKEN_NAME, TOKEN_SYMBOL, this.extend.address, this.approve.address, this.baseGetter.address, this.onReceive.address, this.transfer.address, this.enumerableHooks.address]) 
        await this.erc721Metadata.connect(this.signers.admin).finaliseERC721MetadataExtending(
            this.metadataGetter.address, 
            permissioned? this.permissionedSetTokenUri.address : this.setTokenUri.address, 
            permissioned? this.permissionedMint.address : this.mint.address, 
            permissioned? this.permissionedMetadataBurn.address : this.metadataBurn.address
        );
       
        // only to provide access to `exists` function, all other functions are shadowed by previous extensions
        this.tokenAsExtend = <ExtendLogic>await this.erc721Metadata.as(this.artifacts.extend);
        if (permissioned) await this.tokenAsExtend.extend(this.permissionedErc721MockExtension.address);
        else await this.tokenAsExtend.extend(this.erc721MockExtension.address);
        
        // Extend Metadata with enumerable getter
        this.tokenAsExtend = <ExtendLogic>await this.erc721Metadata.as(this.artifacts.extend);
        await this.tokenAsExtend.extend(this.enumerableGetter.address);

        this.tokenAsApprove = <ApproveLogic>await this.erc721Metadata.as(this.artifacts.approve);
        this.tokenAsMint = <BasicMintLogic>await this.erc721Metadata.as(this.artifacts.mint);
        this.tokenAsBurn = <MetadataBurnLogic>await this.erc721Metadata.as(this.artifacts.metadataBurn);
        this.tokenAsBaseGetter = <GetterLogic>await this.erc721Metadata.as(this.artifacts.baseGetter);
        this.tokenAsMetadataGetter = <MetadataGetterLogic>await this.erc721Metadata.as(this.artifacts.metadataGetter);
        this.tokenAsOnReceive = <OnReceiveLogic>await this.erc721Metadata.as(this.artifacts.onReceive);
        this.tokenAsTransfer = <TransferLogic>await this.erc721Metadata.as(this.artifacts.transfer);
        this.tokenAsSetTokenURI = <BasicSetTokenURILogic>await this.erc721Metadata.as(this.artifacts.setTokenUri);
        this.tokenAsErc721MockExtension = <ERC721MockExtension>await this.erc721Metadata.as(this.artifacts.erc721MockExtension);
        this.tokenAsEnumerableGetter = <EnumerableGetterLogic>await this.erc721Metadata.as(this.artifacts.enumerableGetter);
    }
});