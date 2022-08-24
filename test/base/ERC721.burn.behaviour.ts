import { expect } from "chai";
import { BigNumber, ContractTransaction } from "ethers";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: error persists even after adding a declaration file
import { constants } from "@openzeppelin/test-helpers";
import { MODULE } from "../setup";
import { expectEvent } from "../utils/utils";
import { firstTokenId, nonExistentTokenId } from "./ERC721.behaviour";

const { ZERO_ADDRESS } = constants;

const shouldBehaveLikeERC721Burn = (module: MODULE) => {
  context("_burn", function () {
    let tx: ContractTransaction;

    context("permissioned", async function () {
      beforeEach(async function () {
        await this.redeploy(module, true);
      });

      it("reverts when burning a non-existent token id", async function () {
        await expect(this.tokenAsErc721MockExtension.burn(nonExistentTokenId)).to.be.revertedWith(
          "ERC721: owner query for nonexistent token",
        );
      });

      context("with minted tokens", function () {
        beforeEach(async function () {
          await this.redeploy(module, true);
          await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, firstTokenId);
        });

        context("with burnt token", function () {
          context("from owner", async function () {
            beforeEach(async function () {
              tx = await this.tokenAsErc721MockExtension.burn(firstTokenId);
            });

            it("emits a Transfer event", async function () {
              await expectEvent(tx, "Transfer", {
                from: this.signers.owner.address,
                to: ZERO_ADDRESS,
                tokenId: firstTokenId,
              });
            });

            it("emits an Approval event", async function () {
              await expectEvent(tx, "Approval", {
                owner: this.signers.owner.address,
                approved: ZERO_ADDRESS,
                tokenId: firstTokenId,
              });
            });

            it("deletes the token", async function () {
              expect(await this.tokenAsBaseGetter.callStatic.balanceOf(this.signers.owner.address)).to.equal(
                BigNumber.from(0),
              );
              await expect(this.tokenAsBaseGetter.ownerOf(firstTokenId)).to.be.revertedWith(
                "ERC721: owner query for nonexistent token",
              );
            });

            it("reverts when burning a token id that has been deleted", async function () {
              await expect(this.tokenAsErc721MockExtension.burn(firstTokenId)).to.be.revertedWith(
                "ERC721: owner query for nonexistent token",
              );
            });
          });

          context("from non-owner", async function () {
            it("reverts", async function () {
              await expect(
                this.tokenAsErc721MockExtension.connect(this.signers.other).burn(firstTokenId),
              ).to.be.revertedWith("Logic: unauthorised");
            });
          });
        });
      });
    });

    context("unpermissioned", async function () {
      beforeEach(async function () {
        await this.redeploy(module, false);
      });

      it("reverts when burning a non-existent token id", async function () {
        await expect(this.tokenAsErc721MockExtension.burn(nonExistentTokenId)).to.be.revertedWith(
          "ERC721: owner query for nonexistent token",
        );
      });

      context("with minted tokens", function () {
        beforeEach(async function () {
          await this.redeploy(module, false);
          await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, firstTokenId);
        });

        context("with burnt token", function () {
          beforeEach(async function () {
            tx = await this.tokenAsErc721MockExtension.burn(firstTokenId);
          });

          it("emits a Transfer event", async function () {
            await expectEvent(tx, "Transfer", {
              from: this.signers.owner.address,
              to: ZERO_ADDRESS,
              tokenId: firstTokenId,
            });
          });

          it("emits an Approval event", async function () {
            await expectEvent(tx, "Approval", {
              owner: this.signers.owner.address,
              approved: ZERO_ADDRESS,
              tokenId: firstTokenId,
            });
          });

          it("deletes the token", async function () {
            expect(await this.tokenAsBaseGetter.callStatic.balanceOf(this.signers.owner.address)).to.equal(
              BigNumber.from(0),
            );
            await expect(this.tokenAsBaseGetter.ownerOf(firstTokenId)).to.be.revertedWith(
              "ERC721: owner query for nonexistent token",
            );
          });

          it("reverts when burning a token id that has been deleted", async function () {
            await expect(this.tokenAsErc721MockExtension.burn(firstTokenId)).to.be.revertedWith(
              "ERC721: owner query for nonexistent token",
            );
          });
        });
      });
    });
  });
};

export { shouldBehaveLikeERC721Burn };
