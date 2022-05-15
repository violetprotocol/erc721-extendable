import { expect } from "chai";
import { BigNumber, ContractTransaction } from "ethers";
import { waffle } from "hardhat";
import { 
  ERC721ReceiverMock,
 } from "../../src/types";
import { MODULE } from "../setup";
import { expectEvent } from "../utils/utils";
import { Error, firstTokenId, fourthTokenId, RECEIVER_MAGIC_VALUE } from "./ERC721.behaviour";

const { constants } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const shouldBehaveLikeERC721Mint = (module: MODULE) => {
    let tx: ContractTransaction;

    context('_mint', function () {

      describe("permissioned", async function () {
        beforeEach(async function () {
          await this.redeploy(module, true);
        });

        it('reverts with a null destination address', async function () {
          await expect(
              this.tokenAsErc721MockExtension.mint(ZERO_ADDRESS, firstTokenId)
          ).to.be.revertedWith('ERC721: mint to the zero address');
        });

        it('reverts with non owner', async function () {
          await expect(
              this.tokenAsErc721MockExtension.connect(this.signers.other).mint(ZERO_ADDRESS, firstTokenId)
          ).to.be.revertedWith('Logic: unauthorised');
        });

        context('with minted token', async function () {
          beforeEach(async function () {
              await this.redeploy(module, true);
              tx = await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, firstTokenId);
          });

          it('emits a Transfer event', function () {
              expectEvent(tx, 'Transfer', { from: ZERO_ADDRESS, to: this.signers.owner.address, tokenId: firstTokenId });
          });

          it('creates the token', async function () {
              expect(await this.tokenAsBaseGetter.callStatic.balanceOf(this.signers.owner.address)).to.equal(BigNumber.from(1));
              expect(await this.tokenAsBaseGetter.callStatic.ownerOf(firstTokenId)).to.equal(this.signers.owner.address);
          });

          it('reverts when adding a token id that already exists', async function () {
              await expect(this.tokenAsErc721MockExtension.mint(this.signers.owner.address, firstTokenId)).to.be.revertedWith('ERC721: token already minted');
          });

          
          describe('safe mint', function () {
            const tokenId = fourthTokenId;
            const data = '0x42';

            describe('via safeMint', function () {
              beforeEach(async function () {
                  await this.redeploy(module, true);
              });

              context("from owner", async function () {
                it('calls onERC721Received — with data', async function () {
                  this.erc721Receiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.None]));
                  const tx = await this.tokenAsErc721MockExtension["safeMint(address,uint256,bytes)"](this.erc721Receiver.address, tokenId, data);
        
                  await expectEvent(tx, 'Received', {
                    from: ZERO_ADDRESS,
                    tokenId: tokenId,
                    data: data,
                  });
                });
        
                it('calls onERC721Received — without data', async function () {
                  this.erc721Receiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.None]));
                  const tx = await this.tokenAsErc721MockExtension["safeMint(address,uint256)"](this.erc721Receiver.address, tokenId);
        
                  await expectEvent(tx, 'Received', {
                    from: ZERO_ADDRESS,
                    tokenId: tokenId,
                  });
                });
        
                context('to a receiver contract returning unexpected value', function () {
                  it('reverts', async function () {
                    const invalidReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, ['0x42424242', Error.None]));
                    await expect(
                      this.tokenAsErc721MockExtension["safeMint(address,uint256)"](invalidReceiver.address, tokenId))
                      .to.be.revertedWith('ERC721: transfer to non ERC721Receiver implementer')
                  });
                });
        
                context('to a receiver contract that reverts with message', function () {
                  it('reverts', async function () {
                    const revertingReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.RevertWithMessage]));
                    await expect(
                      this.tokenAsErc721MockExtension["safeMint(address,uint256)"](revertingReceiver.address, tokenId))
                      .to.be.revertedWith('ERC721ReceiverMock: reverting');
                  });
                });
        
                context('to a receiver contract that reverts without message', function () {
                  it('reverts', async function () {
                    const revertingReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.RevertWithoutMessage]));
                    await expect(
                      this.tokenAsErc721MockExtension["safeMint(address,uint256)"](revertingReceiver.address, tokenId))
                      .to.be.revertedWith('ERC721: transfer to non ERC721Receiver implementer');
                  });
                });
        
                context('to a receiver contract that panics', function () {
                  it('reverts', async function () {
                    const revertingReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.Panic]));
                    await expect(
                      this.tokenAsErc721MockExtension["safeMint(address,uint256)"](revertingReceiver.address, tokenId)
                    ).to.be.revertedWith("");
                  });
                });
        
                context('to a contract that does not implement the required function', function () {
                  it('reverts', async function () {
                    const nonReceiver = this.extend;
                    await expect(
                      this.tokenAsErc721MockExtension["safeMint(address,uint256)"](nonReceiver.address, tokenId))
                      .to.be.revertedWith('ERC721: transfer to non ERC721Receiver implementer')
                  });
                });
              })
              
              context("from non-owner", async function () {
                it('calls onERC721Received — with data fails', async function () {
                  this.erc721Receiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.None]));
                  await expect(
                    this.tokenAsErc721MockExtension.connect(this.signers.other)["safeMint(address,uint256,bytes)"](this.erc721Receiver.address, tokenId, data))
                    .to.be.revertedWith("Logic: unauthorised");
                });
        
                it('calls onERC721Received — without data fails', async function () {
                  this.erc721Receiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.None]));
                  await expect(
                    this.tokenAsErc721MockExtension.connect(this.signers.other)["safeMint(address,uint256)"](this.erc721Receiver.address, tokenId))
                    .to.be.revertedWith("Logic: unauthorised");
                });

        
                context('to a receiver contract returning unexpected value', function () {
                  it('reverts', async function () {
                    const invalidReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, ['0x42424242', Error.None]));
                    await expect(
                      this.tokenAsErc721MockExtension.connect(this.signers.other)["safeMint(address,uint256)"](invalidReceiver.address, tokenId))
                      .to.be.revertedWith('Logic: unauthorised')
                  });
                });
        
                context('to a receiver contract that reverts with message', function () {
                  it('reverts', async function () {
                    const revertingReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.RevertWithMessage]));
                    await expect(
                      this.tokenAsErc721MockExtension.connect(this.signers.other)["safeMint(address,uint256)"](revertingReceiver.address, tokenId))
                      .to.be.revertedWith('Logic: unauthorised');
                  });
                });
        
                context('to a receiver contract that reverts without message', function () {
                  it('reverts', async function () {
                    const revertingReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.RevertWithoutMessage]));
                    await expect(
                      this.tokenAsErc721MockExtension.connect(this.signers.other)["safeMint(address,uint256)"](revertingReceiver.address, tokenId))
                      .to.be.revertedWith('Logic: unauthorised');
                  });
                });
        
                context('to a receiver contract that panics', function () {
                  it('reverts', async function () {
                    const revertingReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.Panic]));
                    await expect(
                      this.tokenAsErc721MockExtension.connect(this.signers.other)["safeMint(address,uint256)"](revertingReceiver.address, tokenId)
                    ).to.be.revertedWith("");
                  });
                });
        
                context('to a contract that does not implement the required function', function () {
                  it('reverts', async function () {
                    const nonReceiver = this.extend;
                    await expect(
                      this.tokenAsErc721MockExtension.connect(this.signers.other)["safeMint(address,uint256)"](nonReceiver.address, tokenId))
                      .to.be.revertedWith('Logic: unauthorised')
                  });
                });
              })
            });
          });
        });

      });

      describe("unpermissioned", async function () {
        beforeEach(async function () {
          await this.redeploy(module, false);
        });

        it('reverts with a null destination address', async function () {
          await expect(
              this.tokenAsErc721MockExtension.mint(ZERO_ADDRESS, firstTokenId)
          ).to.be.revertedWith('ERC721: mint to the zero address');
        });

        context('with minted token', async function () {
          beforeEach(async function () {
              await this.redeploy(module, false);
              tx = await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, firstTokenId);
          });

          it('emits a Transfer event', function () {
              expectEvent(tx, 'Transfer', { from: ZERO_ADDRESS, to: this.signers.owner.address, tokenId: firstTokenId });
          });

          it('creates the token', async function () {
              expect(await this.tokenAsBaseGetter.callStatic.balanceOf(this.signers.owner.address)).to.equal(BigNumber.from(1));
              expect(await this.tokenAsBaseGetter.callStatic.ownerOf(firstTokenId)).to.equal(this.signers.owner.address);
          });

          it('reverts when adding a token id that already exists', async function () {
              await expect(this.tokenAsErc721MockExtension.mint(this.signers.owner.address, firstTokenId)).to.be.revertedWith('ERC721: token already minted');
          });

          
          describe('safe mint', function () {
            const tokenId = fourthTokenId;
            const data = '0x42';

            beforeEach(async function () {
                await this.redeploy(module, false);
            });
      
            describe('via safeMint', function () {
              beforeEach(async function () {
                  await this.redeploy(module, false);
              });

              it('calls onERC721Received — with data', async function () {
                this.erc721Receiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.None]));
                const tx = await this.tokenAsErc721MockExtension["safeMint(address,uint256,bytes)"](this.erc721Receiver.address, tokenId, data);
      
                await expectEvent(tx, 'Received', {
                  from: ZERO_ADDRESS,
                  tokenId: tokenId,
                  data: data,
                });
              });
      
              it('calls onERC721Received — without data', async function () {
                this.erc721Receiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.None]));
                const tx = await this.tokenAsErc721MockExtension["safeMint(address,uint256)"](this.erc721Receiver.address, tokenId);
      
                await expectEvent(tx, 'Received', {
                  from: ZERO_ADDRESS,
                  tokenId: tokenId,
                });
              });
      
              context('to a receiver contract returning unexpected value', function () {
                it('reverts', async function () {
                  const invalidReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, ['0x42424242', Error.None]));
                  await expect(
                    this.tokenAsErc721MockExtension["safeMint(address,uint256)"](invalidReceiver.address, tokenId))
                    .to.be.revertedWith('ERC721: transfer to non ERC721Receiver implementer')
                });
              });
      
              context('to a receiver contract that reverts with message', function () {
                it('reverts', async function () {
                  const revertingReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.RevertWithMessage]));
                  await expect(
                    this.tokenAsErc721MockExtension["safeMint(address,uint256)"](revertingReceiver.address, tokenId))
                    .to.be.revertedWith('ERC721ReceiverMock: reverting');
                });
              });
      
              context('to a receiver contract that reverts without message', function () {
                it('reverts', async function () {
                  const revertingReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.RevertWithoutMessage]));
                  await expect(
                    this.tokenAsErc721MockExtension["safeMint(address,uint256)"](revertingReceiver.address, tokenId))
                    .to.be.revertedWith('ERC721: transfer to non ERC721Receiver implementer');
                });
              });
      
              context('to a receiver contract that panics', function () {
                it('reverts', async function () {
                  const revertingReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.Panic]));
                  await expect(
                    this.tokenAsErc721MockExtension["safeMint(address,uint256)"](revertingReceiver.address, tokenId)
                  ).to.be.revertedWith("");
                });
              });
      
              context('to a contract that does not implement the required function', function () {
                it('reverts', async function () {
                  const nonReceiver = this.extend;
                  await expect(
                    this.tokenAsErc721MockExtension["safeMint(address,uint256)"](nonReceiver.address, tokenId))
                    .to.be.revertedWith('ERC721: transfer to non ERC721Receiver implementer')
                });
              });
            });
          });
        });
      });
    });
}

export { shouldBehaveLikeERC721Mint }