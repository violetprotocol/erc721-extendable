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
import { expectEvent } from "./ERC721.behaviour";

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

const shouldBehaveLikeERC721Burn = () => {
  context('_burn', function () {
    let tx: ContractTransaction;

    beforeEach(async function () {
        await this.redeploy();
    })

    it('reverts when burning a non-existent token id', async function () {
      await expect(this.tokenAsErc721MockExtension.burn(nonExistentTokenId)).to.be.revertedWith('ERC721: owner query for nonexistent token');
    });

    context('with minted tokens', function () {
      beforeEach(async function () {
        await this.redeploy();
        await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, firstTokenId);
      });

      context('with burnt token', function () {
        beforeEach(async function () {
          tx = await this.tokenAsErc721MockExtension.burn(firstTokenId);
        });

        it('emits a Transfer event', function () {
          expectEvent(tx, 'Transfer', { from: this.signers.owner.address, to: ZERO_ADDRESS, tokenId: firstTokenId });
        });

        it('emits an Approval event', function () {
          expectEvent(tx, 'Approval', { owner: this.signers.owner.address, approved: ZERO_ADDRESS, tokenId: firstTokenId });
        });

        it('deletes the token', async function () {
          expect(await this.tokenAsBaseGetter.callStatic.balanceOf(this.signers.owner.address)).to.equal(BigNumber.from(0));
          await expect(
            this.tokenAsBaseGetter.ownerOf(firstTokenId))
            .to.be.revertedWith('ERC721: owner query for nonexistent token');
        });

        it('reverts when burning a token id that has been deleted', async function () {
          await expect(
            this.tokenAsErc721MockExtension.burn(firstTokenId)
          ).to.be.revertedWith('ERC721: owner query for nonexistent token');
        });
      });
    });
  });
}

export { shouldBehaveLikeERC721Burn }