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
 } from "../src/types";
import { Artifact } from "hardhat/types";
import { Contract } from "ethers";
import { waffle, ethers } from "hardhat";

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
    approve: ApproveLogic;
    burn: BasicBurnLogic;
    baseGetter: GetterLogic;
    beforeTransfer: BeforeTransferLogic;
    mint: BasicMintLogic;
    onReceive: OnReceiveLogic;
    transfer: TransferLogic;
    enumerableGetter: EnumerableGetterLogic;
    enumerableBeforeTransfer: EnumerableBeforeTransferLogic;
    metadataBurn: MetadataBurnLogic;
    metadataGetter: MetadataGetterLogic;
    setTokenUri: SetTokenURILogic;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
  operator: SignerWithAddress;
  owner: SignerWithAddress;
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
  approve: Artifact;
  burn: Artifact;
  baseGetter: Artifact;
  beforeTransfer: Artifact;
  mint: Artifact;
  onReceive: Artifact;
  transfer: Artifact;
  enumerableGetter: Artifact;
  enumerableBeforeTransfer: Artifact;
  metadataBurn: Artifact;
  metadataGetter: Artifact;
  setTokenUri: Artifact;
}

export type Extended<T extends Contract> = T & {
  as<T>(artifact: Artifact): T;
};

export const deployExtendableContract = async <T extends Contract>(deployer: SignerWithAddress, artifact: Artifact, params: any[]): Promise<Extended<T>> => {
  const contract = <Extended<T>>await waffle.deployContract(deployer, artifact, [...params]);
  contract.as = <T>(artifact: Artifact) => {
    return <T><unknown>ethers.getContractAtFromArtifact(artifact, contract.address);
  }

  return contract;
}

export const attachExtendableContract = async <T extends Contract>(artifact: Artifact, address: string): Promise<Extended<T>> => {
  const contract = <Extended<T>>await ethers.getContractAtFromArtifact(artifact, address);
  contract.as = <T>(artifact: Artifact) => {
    return <T><unknown>ethers.getContractAtFromArtifact(artifact, contract.address);
  }

  return contract;
}