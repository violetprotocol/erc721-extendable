import { expect } from "chai";
import { BigNumber, ContractTransaction } from "ethers";
import { expectEvent } from "../utils/utils";
import { firstTokenId, nonExistentTokenId } from "./ERC721.behaviour";

const { constants } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

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