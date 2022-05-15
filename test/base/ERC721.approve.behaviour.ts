import { expect } from "chai";
import { BigNumber, ContractTransaction } from "ethers";
import { MODULE } from "../setup";
import { expectEvent } from "../utils/utils";
import { firstTokenId, nonExistentTokenId, secondTokenId } from "./ERC721.behaviour";

const { constants} = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const shouldBehaveLikeERC721Approve = (module: MODULE) => {
  context('approve with minted tokens', async function () {
    beforeEach(async function () {
        await this.redeploy(module, false);
        await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, firstTokenId);
        await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, secondTokenId);
        this.toWhom = this.signers.other.address; // default to other for toWhom in context-dependent tests
    });
      
    describe('approve', function () {
      const tokenId = firstTokenId;
      let tx: ContractTransaction;

      const itClearsApproval = function () {
        it('clears approval for the token', async function () {
          expect(await this.tokenAsBaseGetter.callStatic.getApproved(tokenId)).to.be.equal(ZERO_ADDRESS);
        });
      };

      const itApproves = function (address: any) {
        it('sets the approval for the target address', async function () {
          expect(await this.tokenAsBaseGetter.callStatic.getApproved(tokenId)).to.be.equal(address);
        });
      };

      const itEmitsApprovalEvent = function (address: any) {
        it('emits an approval event', async function () {
          expectEvent(tx, 'Approval', {
            owner: this.signers.owner.address,
            approved: address,
            tokenId: tokenId,
          });
        });
      };

      context('when clearing approval', function () {
        context('when there was no prior approval', function () {
          beforeEach(async function () {
            tx = await this.tokenAsApprove.connect(this.signers.owner).approve(ZERO_ADDRESS, tokenId);
          });

          itClearsApproval();
          itEmitsApprovalEvent(ZERO_ADDRESS);
        });

        context('when there was a prior approval', function () {
          beforeEach(async function () {
            await this.tokenAsApprove.connect(this.signers.owner).approve(this.signers.approved.address, tokenId);
            tx = await this.tokenAsApprove.connect(this.signers.owner).approve(ZERO_ADDRESS, tokenId);
          });

          itClearsApproval();
          itEmitsApprovalEvent(ZERO_ADDRESS);
        });
      });

      context('when approving a non-zero address', function () {
        context('when there was no prior approval', function () {
          beforeEach(async function () {
            tx = await this.tokenAsApprove.connect(this.signers.owner).approve(this.signers.approved.address, tokenId);
          });

          it("successfully approves", async function () {
            itApproves(this.signers.approved.address);
            itEmitsApprovalEvent(this.signers.approved.address);
          })
        });

        context('when there was a prior approval to the same address', function () {
          beforeEach(async function () {
            await this.tokenAsApprove.connect(this.signers.owner).approve(this.signers.approved.address, tokenId);
            tx = await this.tokenAsApprove.connect(this.signers.owner).approve(this.signers.approved.address, tokenId);
          });

          it("successfully approves", async function() {
            itApproves(this.signers.approved.address);
            itEmitsApprovalEvent(this.signers.approved.address);
          })
        });

        context('when there was a prior approval to a different address', function () {
          beforeEach(async function () {
            await this.tokenAsApprove.connect(this.signers.owner).approve(this.signers.anotherApproved.address, tokenId);
            tx = await this.tokenAsApprove.connect(this.signers.owner).approve(this.signers.anotherApproved.address, tokenId);
          });

          it("successfully approves", async function () {
            itApproves(this.signers.anotherApproved.address);
            itEmitsApprovalEvent(this.signers.anotherApproved.address);
          })
        });
      });

      context('when the address that receives the approval is the owner', function () {
        it('reverts', async function () {
          await expect(
            this.tokenAsApprove.connect(this.signers.owner).approve(this.signers.owner.address, tokenId)
          ).to.be.revertedWith('ERC721: approval to current owner');
        });
      });

      context('when the sender does not own the given token ID', function () {
        it('reverts', async function () {
          await expect(this.tokenAsApprove.connect(this.signers.other).approve(this.signers.approved.address, tokenId))
            .to.be.revertedWith('ERC721: approve caller is not owner nor approved');
        });
      });

      context('when the sender is approved for the given token ID', function () {
        it('reverts', async function () {
          await this.tokenAsApprove.connect(this.signers.owner).approve(this.signers.approved.address, tokenId);
          await expect(this.tokenAsApprove.connect(this.signers.approved).approve(this.signers.anotherApproved.address, tokenId))
            .to.be.revertedWith('ERC721: approve caller is not owner nor approved for all');
        });
      });

      context('when the sender is an operator', function () {
        beforeEach(async function () {
          await this.tokenAsApprove.connect(this.signers.owner).setApprovalForAll(this.signers.operator.address, true);
          tx = await this.tokenAsApprove.connect(this.signers.operator).approve(this.signers.approved.address, tokenId);
        });

        it("successfully approves", async function () {
          itApproves(this.signers.approved.address);
          itEmitsApprovalEvent(this.signers.approved.address);
        })
      });

      context('when the given token ID does not exist', function () {
        it('reverts', async function () {
          await expect(this.tokenAsApprove.connect(this.signers.operator).approve(this.signers.approved.address, nonExistentTokenId))
            .to.be.revertedWith('ERC721: owner query for nonexistent token');
        });
      });
    });
    
    describe('setApprovalForAll', function () {
      context('when the operator willing to approve is not the owner', function () {
        context('when there is no operator approval set by the sender', function () {
          it('approves the operator', async function () {
            await this.tokenAsApprove.connect(this.signers.owner).setApprovalForAll(this.signers.operator.address, true);

            expect(await this.tokenAsBaseGetter.callStatic.isApprovedForAll(this.signers.owner.address, this.signers.operator.address)).to.equal(true);
          });

          it('emits an approval event', async function () {
            const tx = await this.tokenAsApprove.connect(this.signers.owner).setApprovalForAll(this.signers.operator.address, true);

            expectEvent(tx, 'ApprovalForAll', {
              owner: this.signers.owner.address,
              operator: this.signers.operator.address,
              approved: true,
            });
          });
        });

        context('when the operator was set as not approved', function () {
          beforeEach(async function () {
            await this.tokenAsApprove.connect(this.signers.owner).setApprovalForAll(this.signers.operator.address, false);
          });

          it('approves the operator', async function () {
            await this.tokenAsApprove.connect(this.signers.owner).setApprovalForAll(this.signers.operator.address, true);

            expect(await this.tokenAsBaseGetter.callStatic.isApprovedForAll(this.signers.owner.address, this.signers.operator.address)).to.equal(true);
          });

          it('emits an approval event', async function () {
            const tx = await this.tokenAsApprove.connect(this.signers.owner).setApprovalForAll(this.signers.operator.address, true);

            expectEvent(tx, 'ApprovalForAll', {
              owner: this.signers.owner.address,
              operator: this.signers.operator.address,
              approved: true,
            });
          });

          it('can unset the operator approval', async function () {
            await this.tokenAsApprove.connect(this.signers.owner).setApprovalForAll(this.signers.operator.address, false);

            expect(await this.tokenAsBaseGetter.callStatic.isApprovedForAll(this.signers.owner.address, this.signers.operator.address)).to.equal(false);
          });
        });

        context('when the operator was already approved', function () {
          beforeEach(async function () {
            await this.tokenAsApprove.connect(this.signers.owner).setApprovalForAll(this.signers.operator.address, true);
          });

          it('keeps the approval to the given address', async function () {
            await this.tokenAsApprove.connect(this.signers.owner).setApprovalForAll(this.signers.operator.address, true);

            expect(await this.tokenAsBaseGetter.callStatic.isApprovedForAll(this.signers.owner.address, this.signers.operator.address)).to.equal(true);
          });

          it('emits an approval event', async function () {
            const tx = await this.tokenAsApprove.connect(this.signers.owner).setApprovalForAll(this.signers.operator.address, true);

            expectEvent(tx, 'ApprovalForAll', {
              owner: this.signers.owner.address,
              operator: this.signers.operator.address,
              approved: true,
            });
          });
        });
      });

      context('when the operator is the owner', function () {
        it('reverts', async function () {
          await expect(this.tokenAsApprove.connect(this.signers.owner).setApprovalForAll(this.signers.owner.address, true))
            .to.be.revertedWith('ERC721: approve to caller');
        });
      });
    });
    
    describe('getApproved', async function () {
      context('when token is not minted', async function () {
        it('reverts', async function () {
          await expect(
            this.tokenAsBaseGetter.getApproved(nonExistentTokenId))
            .to.be.revertedWith('ERC721: approved query for nonexistent token');
        });
      });

      context('when token has been minted ', async function () {
        it('should return the zero address', async function () {
          expect(await this.tokenAsBaseGetter.callStatic.getApproved(firstTokenId)).to.be.equal(
            ZERO_ADDRESS,
          );
        });

        context('when account has been approved', async function () {
          beforeEach(async function () {
            await this.tokenAsApprove.connect(this.signers.owner).approve(this.signers.approved.address, firstTokenId);
          });

          it('returns approved account', async function () {
            expect(await this.tokenAsBaseGetter.callStatic.getApproved(firstTokenId)).to.be.equal(this.signers.approved.address);
          });
        });
      });
    });
  });
        
}

export { shouldBehaveLikeERC721Approve }