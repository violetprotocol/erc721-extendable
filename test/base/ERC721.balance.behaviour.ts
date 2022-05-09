import { TransactionReceipt } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, ContractReceipt, ContractTransaction } from "ethers";
import { ethers, waffle } from "hardhat";
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
import { attachExtendableContract, deployExtendableContract, Extended, Signers } from "../types";
import { EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, TOKEN_LOGIC_INTERFACE } from "../utils/constants";

const { BN, constants, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const Error = {
  Panic: 3,
  RevertWithoutMessage: 2,
  RevertWithMessage: 1,
  None: 0,
}

const firstTokenId = BigNumber.from(5042);
const secondTokenId = BigNumber.from(79217);
const nonExistentTokenId = BigNumber.from(182738971238);
const fourthTokenId = BigNumber.from(4);

const RECEIVER_MAGIC_VALUE = '0x150b7a02';

const shouldBehaveLikeERC721Balance = () => {
    context('with minted tokens', async function () {
        before(async function () {
            await this.redeploy();
            await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, firstTokenId);
            await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, secondTokenId);
            this.toWhom = this.signers.other.address; // default to other for toWhom in context-dependent tests
        });
        
        describe('balanceOf', function () {
            context('when the given address owns some tokens', function () {
                it('returns the amount of tokens owned by the given address', async function () {
                    expect(await this.tokenAsBaseGetter.callStatic.balanceOf(this.signers.owner.address)).to.equal(BigNumber.from(2));
                });
            });
        
            context('when the given address does not own any tokens', function () {
                it('returns 0', async function () {
                    expect(await this.tokenAsBaseGetter.callStatic.balanceOf(this.signers.other.address)).to.equal(BigNumber.from(0));
                });
            });
        
            context('when querying the zero address', function () {
                it('throws', async function () {
                    await expect(this.tokenAsBaseGetter.balanceOf(ZERO_ADDRESS)).to.be.revertedWith("ERC721: balance query for the zero address");
                });
            });
        });
        
        describe('ownerOf', function () {
            context('when the given token ID was tracked by this token', function () {
                const tokenId = firstTokenId;
        
                it('returns the owner of the given token ID', async function () {
                    expect(await this.tokenAsBaseGetter.callStatic.ownerOf(tokenId)).to.be.equal(this.signers.owner.address);
                });
            });
        
            context('when the given token ID was not tracked by this token', function () {
                const tokenId = nonExistentTokenId;
        
                it('reverts', async function () {
                    await expect(this.tokenAsBaseGetter.ownerOf(tokenId)).to.be.revertedWith("ERC721: owner query for nonexistent token");
                });
            });
        });
    });
        
}

export { shouldBehaveLikeERC721Balance }