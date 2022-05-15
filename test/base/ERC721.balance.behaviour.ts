import { expect } from "chai";
import { BigNumber } from "ethers";
import { MODULE } from "../setup";
import { firstTokenId, nonExistentTokenId, secondTokenId } from "./ERC721.behaviour";

const { constants } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const shouldBehaveLikeERC721Balance = (module: MODULE) => {
    context('balance with minted tokens', async function () {
        before(async function () {
            await this.redeploy(module, false);
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