import { artifacts, ethers, waffle } from "hardhat";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Signers } from "./types";
import { Artifacts } from "hardhat/types";

const chai = require("chai");
const { solidity } = waffle;
chai.use(solidity);
const { expect } = chai;
const { BigNumber } = ethers;

before("setup", async function () {
    this.signers = {} as Signers;
    
    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.operator = signers[1];
    this.signers.owner = signers[2];
    this.signers.other = signers[3];
    this.signers.approved = signers[4];
    this.signers.anotherApproved = signers[5];
    this.signers.user = signers[6];

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
    const setTokenUriArtifact = await artifacts.readArtifact("SetTokenURILogic");

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
});