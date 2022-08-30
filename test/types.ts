import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";
import {
  ExtendLogic,
  PermissioningLogic,
  ERC721,
  ERC721Metadata,
  ERC721Enumerable,
  ERC721MockExtension,
  ERC721ReceiverMock,
  ApproveLogic,
  BurnLogic,
  GetterLogic,
  ERC721HooksLogic,
  MintLogic,
  OnReceiveLogic,
  TransferLogic,
  EnumerableGetterLogic,
  EnumerableHooksLogic,
  MetadataBurnLogic,
  MetadataGetterLogic,
  BasicSetTokenURILogic,
  PermissionedBurnLogic,
  PermissionedMintLogic,
  PermissionedMetadataBurnLogic,
  PermissionedSetTokenURILogic,
  PermissionedERC721MockExtension,
} from "../src/types";
import { Artifact } from "hardhat/types";
import { Contract } from "ethers";
import { waffle, ethers } from "hardhat";
import { MODULE } from "./setup";

declare module "mocha" {
  export interface Context {
    name: string;
    symbol: string;
    artifacts: Artifacts;
    extend: ExtendLogic;
    permissioning: PermissioningLogic;
    erc721: Extended<ERC721>;
    erc721Metadata: Extended<ERC721Metadata>;
    erc721Enumerable: Extended<ERC721Enumerable>;
    erc721Receiver: ERC721ReceiverMock;
    erc721MockExtension: ERC721MockExtension;
    permissionedErc721MockExtension: PermissionedERC721MockExtension;
    approve: ApproveLogic;
    burn: BurnLogic;
    permissionedBurn: PermissionedBurnLogic;
    baseGetter: GetterLogic;
    hooks: ERC721HooksLogic;
    mint: MintLogic;
    permissionedMint: PermissionedMintLogic;
    onReceive: OnReceiveLogic;
    transfer: TransferLogic;
    enumerableGetter: EnumerableGetterLogic;
    enumerableHooks: EnumerableHooksLogic;
    metadataBurn: MetadataBurnLogic;
    permissionedMetadataBurn: PermissionedMetadataBurnLogic;
    metadataGetter: MetadataGetterLogic;
    setTokenUri: BasicSetTokenURILogic;
    permissionedSetTokenUri: PermissionedSetTokenURILogic;
    redeploy: (module: MODULE, permissioned: boolean) => void;
    redeployBase: (permissioned: boolean) => void;
    redeployEnumerable: (permissioned: boolean) => void;
    redeployMetadata: (permissioned: boolean) => void;
    redeployMetadataEnumerable: (permissioned: boolean) => void;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
  operator: SignerWithAddress;
  owner: SignerWithAddress;
  newOwner: SignerWithAddress;
  toWhom: SignerWithAddress;
  other: SignerWithAddress;
  approved: SignerWithAddress;
  anotherApproved: SignerWithAddress;
  user: SignerWithAddress;
}

export interface Artifacts {
  extend: Artifact;
  permissioning: Artifact;
  erc721: Artifact;
  erc721Metadata: Artifact;
  erc721Enumerable: Artifact;
  erc721Receiver: Artifact;
  erc721MockExtension: Artifact;
  permissionedErc721MockExtension: Artifact;
  approve: Artifact;
  burn: Artifact;
  permissionedBurn: Artifact;
  baseGetter: Artifact;
  hooks: Artifact;
  mint: Artifact;
  permissionedMint: Artifact;
  onReceive: Artifact;
  transfer: Artifact;
  enumerableGetter: Artifact;
  enumerableHooks: Artifact;
  metadataBurn: Artifact;
  permissionedMetadataBurn: Artifact;
  metadataGetter: Artifact;
  setTokenUri: Artifact;
  permissionedSetTokenUri: Artifact;
}

export type Extended<T extends Contract> = T & {
  as<T>(artifact: Artifact): T;
};

export const deployExtendableContract = async <T extends Contract>(
  deployer: SignerWithAddress,
  artifact: Artifact,
  params: any[],
): Promise<Extended<T>> => {
  const contract = <Extended<T>>await waffle.deployContract(deployer, artifact, [...params]);
  contract.as = <T>(artifact: Artifact) => {
    return <T>(<unknown>ethers.getContractAtFromArtifact(artifact, contract.address));
  };

  return contract;
};

export const attachExtendableContract = async <T extends Contract>(
  artifact: Artifact,
  address: string,
): Promise<Extended<T>> => {
  const contract = <Extended<T>>await ethers.getContractAtFromArtifact(artifact, address);
  contract.as = <T>(artifact: Artifact) => {
    return <T>(<unknown>ethers.getContractAtFromArtifact(artifact, contract.address));
  };

  return contract;
};
