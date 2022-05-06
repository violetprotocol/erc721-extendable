import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";
import { ExtendLogic } from "../src/types/ExtendLogic";
import { PermissioningLogic } from "../src/types/PermissioningLogic";
import { ERC721 } from "../src/types/ERC721";
import { ERC721Metadata } from "../src/types/ERC721Metadata";
import { ERC721Enumerable } from "../src/types/ERC721Enumerable";
import { ERC721MockExtension } from "../src/types/ERC721MockExtension";
import { ERC721ReceiverMock } from "../src/types/ERC721ReceiverMock";
import { ApproveLogic } from "../src/types/ApproveLogic";
import { BasicBurnLogic } from "../src/types/BasicBurnLogic";
import { GetterLogic } from "../src/types/GetterLogic";
import { BeforeTransferLogic } from "../src/types/BeforeTransferLogic";
import { BasicMintLogic } from "../src/types/BasicMintLogic";
import { OnReceiveLogic } from "../src/types/OnReceiveLogic";
import { TransferLogic } from "../src/types/TransferLogic";
import { EnumerableGetterLogic } from "../src/types/EnumerableGetterLogic";
import { EnumerableBeforeTransferLogic } from "../src/types/EnumerableBeforeTransferLogic";
import { MetadataBurnLogic } from "../src/types/MetadataBurnLogic";
import { MetadataGetterLogic } from "../src/types/MetadataGetterLogic";
import { SetTokenURILogic } from "../src/types/SetTokenURILogic";
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

type OptionalPropertyNames<T> =
  { [K in keyof T]-?: ({} extends { [P in K]: T[K] } ? K : never) }[keyof T];

type SpreadProperties<L, R, K extends keyof L & keyof R> =
  { [P in K]: L[P] | Exclude<R[P], undefined> };

type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

type SpreadTwo<L, R> = Id<
  & Pick<L, Exclude<keyof L, keyof R>>
  & Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>>
  & Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>>
  & SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>;

type Spread<A extends readonly [...any]> = A extends [infer L, ...infer R] ?
  SpreadTwo<L, Spread<R>> : unknown

export const merge = <A extends object[]>(...a: [...A]) => {
  return Object.assign({}, ...a) as Spread<A>;
}