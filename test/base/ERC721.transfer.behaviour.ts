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

const { constants } = require('@openzeppelin/test-helpers');
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

const shouldBehaveLikeERC721Transfer = () => {
    const mintNew = async (tokenMint: ERC721MockExtension, signers: Signers) => {
        await tokenMint.mint(signers.owner.address, firstTokenId);
        await tokenMint.mint(signers.owner.address, secondTokenId);
    }

    context('with minted tokens', async function () {
        before(async function () {
            await this.redeploy();
            await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, firstTokenId);
            await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, secondTokenId);
            this.toWhom = this.signers.other.address; // default to other for toWhom in context-dependent tests
        });
    
        describe('transfers', function () {
            const tokenId = firstTokenId;
            const data = '0x42';
        
            let logs: any = null;
            let tx: ContractTransaction;
            let newTokenId = 0;
        
            beforeEach(async function () {
                await this.redeploy();
                await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, tokenId);
                await expect(this.tokenAsApprove.connect(this.signers.owner).approve(this.signers.approved.address, tokenId)).to.not.be.reverted;
                await expect(this.tokenAsApprove.connect(this.signers.owner).setApprovalForAll(this.signers.operator.address, true)).to.not.be.reverted;
            });
        
            const transferWasSuccessful = function (owner: string, tokenId: BigNumber) {
                it('transfers the ownership of the given token ID to the given address', async function () {
                    expect(await this.tokenAsBaseGetter.callStatic.ownerOf(tokenId)).to.be.equal(this.signers.toWhom.address);
                });
        
                it('emits a Transfer event', async function () {
                    expectEvent(tx, 'Transfer', { from: owner, to: this.toWhom, tokenId });
                });
        
                it('clears the approval for the token ID', async function () {
                    expect(await this.tokenAsBaseGetter.callStatic.getApproved(tokenId)).to.be.equal(ZERO_ADDRESS);
                });
        
                it('emits an Approval event', async function () {
                    expectEvent(tx, 'Approval', { _owner: owner, _approved: ZERO_ADDRESS, _tokenId: tokenId });
                });
        
                it('adjusts owners balances', async function () {
                    expect(await this.tokenAsBaseGetter.callStatic.balanceOf(owner)).to.equal(BigNumber.from(1));
                });
        
                // Doesn't exist, not sure why this test even exists @openzeppelin explain?
                // it('adjusts owners tokens by index', async function () {
                //   if (!this.token.tokenOfOwnerByIndex) return;
        
                //   expect(await this.token.tokenOfOwnerByIndex(this.toWhom, 0)).to.be.bignumber.equal(tokenId);
        
                //   expect(await this.token.tokenOfOwnerByIndex(owner, 0)).to.be.bignumber.not.equal(tokenId);
                // });
            };
        
            const shouldTransferTokensByUsers = async function (transferFunction: (tokenAsTransfer: TransferLogic, signer: SignerWithAddress, from: string, to: string, tokenId: BigNumber, opts?: any) => Promise<ContractTransaction | TransactionReceipt>
            ) {

                beforeEach(async function () {
                    console.log("redeploying")
                    await this.redeploy();
                    await expect(this.tokenAsErc721MockExtension.mint(this.signers.owner.address, firstTokenId)).to.not.be.reverted;
                    await expect(this.tokenAsApprove.connect(this.signers.owner).approve(this.signers.approved.address, firstTokenId)).to.not.be.reverted;
                });
                
                context('when called by the owner', function () {
                    it("should succeed", async function () {
                        tx = <ContractTransaction><any>await expect(transferFunction(this.tokenAsTransfer, this.signers.owner, this.signers.owner.address, this.signers.toWhom.address, firstTokenId)).to.not.be.reverted;
                        transferWasSuccessful(this.signers.owner.address, firstTokenId);
                    })
                });
        
                context('when called by the approved individual', function () {
                    it("should succeed", async function () {
                        tx = <ContractTransaction><any>await expect(transferFunction(this.tokenAsTransfer, this.signers.approved, this.signers.owner.address, this.signers.toWhom.address, firstTokenId)).to.be.revertedWith("lol");
                        transferWasSuccessful( this.signers.owner.address, firstTokenId);
                    })
                });
        
                context('when called by the operator', function () {
                    it("should succeed", async function () {
                        await expect(transferFunction(this.tokenAsTransfer, this.signers.operator, this.signers.owner.address, this.signers.toWhom.address, firstTokenId)).to.not.be.reverted;
                        transferWasSuccessful( this.signers.owner.address, firstTokenId);
                    })
                });
        
                context('when called by the owner without an approved user', function () {
                    it("should succeed", async function () {
                        await expect(this.tokenAsApprove.connect(this.signers.owner).approve(ZERO_ADDRESS, firstTokenId)).to.not.be.reverted;
                        await expect(transferFunction(this.tokenAsTransfer, this.signers.operator, this.signers.owner.address, this.signers.toWhom.address, firstTokenId)).to.not.be.reverted;
                        transferWasSuccessful( this.signers.owner.address, firstTokenId);
                    })
                });
        
                context('when sent to the owner', function () {
                    before(async function () {
                        tx = <ContractTransaction><any>await transferFunction(this.tokenAsTransfer, this.signers.owner, this.signers.owner.address, this.signers.owner.address, firstTokenId);
                    });
            
                    it('keeps ownership of the token', async function () {
                        expect(await this.tokenAsBaseGetter.callStatic.ownerOf(firstTokenId)).to.be.equal(this.signers.owner.address);
                    });
            
                    it('clears the approval for the token ID', async function () {
                        expect(await this.tokenAsBaseGetter.callStatic.getApproved(firstTokenId)).to.be.equal(ZERO_ADDRESS);
                    });
            
                    it('emits only a transfer event', async function () {
                        expectEvent(tx, 'Transfer', {
                            from: this.signers.owner.address,
                            to: this.signers.owner.address,
                            tokenId: firstTokenId,
                        });
                    });
            
                    it('keeps the owner balance', async function () {
                        expect(await this.tokenAsBaseGetter.callStatic.balanceOf(this.signers.owner.address)).to.equal(1);
                    });
            
                    //   it('keeps same tokens by index', async function () {
                    //     if (!this.token.tokenOfOwnerByIndex) return;
                    //     const tokensListed = await Promise.all(
                    //       [0, 1].map(i => this.token.tokenOfOwnerByIndex(this.signers.owner.address, i)),
                    //     );
                    //     expect(tokensListed.map(t => t.toNumber())).to.have.members(
                    //       [firstTokenId.toNumber(), secondTokenId.toNumber()],
                    //     );
                    //   });
                });
        
                context('when the address of the previous owner is incorrect', function () {
                    it('reverts', async function () {
                        await expect(transferFunction(this.tokenAsTransfer, this.signers.owner, this.signers.other.address, this.signers.other.address, BigNumber.from(newTokenId)))
                            .to.be.revertedWith("ERC721: transfer from incorrect owner");
                    });
                });
        
                context('when the sender is not authorized for the token id', function () {
                    it('reverts', async function () {
                        await expect(transferFunction(this.tokenAsTransfer, this.signers.other, this.signers.owner.address, this.signers.other.address, BigNumber.from(newTokenId)))
                            .to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
                    });
                });
        
                context('when the given token ID does not exist', function () {
                    it('reverts', async function () {
                        await expect(transferFunction(this.tokenAsTransfer, this.signers.owner, this.signers.owner.address, this.signers.other.address, nonExistentTokenId))
                            .to.be.revertedWith("ERC721: operator query for nonexistent token");
                    });
                });
        
                context('when the address to transfer the token to is the zero address', function () {
                    it('reverts', async function () {
                        await expect(transferFunction(this.tokenAsTransfer, this.signers.owner, this.signers.owner.address, ZERO_ADDRESS, BigNumber.from(newTokenId)))
                            .to.be.revertedWith("ERC721: transfer to the zero address");
                    });
                });
            };
        
            describe('via transferFrom', function () {
                beforeEach(async function () {
                    await this.redeploy();
                    await expect(this.tokenAsErc721MockExtension.mint(this.signers.owner.address, firstTokenId)).to.not.be.reverted;
                    await expect(this.tokenAsApprove.connect(this.signers.owner).approve(this.signers.approved.address, firstTokenId)).to.not.be.reverted;
                });
                
                context('when called by the owner', function () {
                    it("should succeed", async function () {
                        tx = <ContractTransaction><any>await expect(this.tokenAsTransfer.connect(this.signers.owner).transfer(this.signers.owner.address, this.signers.toWhom.address, firstTokenId)).to.not.be.reverted;
                        transferWasSuccessful(this.signers.owner.address, firstTokenId);
                    })
                });
        
                context('when called by the approved individual', function () {
                    it("should succeed", async function () {
                        tx = <ContractTransaction><any>await expect(this.tokenAsTransfer.connect(this.signers.approved).transfer(this.signers.owner.address, this.signers.toWhom.address, firstTokenId)).to.be.revertedWith("lol");
                        transferWasSuccessful( this.signers.owner.address, firstTokenId);
                    })
                });
        
                context('when called by the operator', function () {
                    it("should succeed", async function () {
                        await expect(this.tokenAsTransfer.connect(this.signers.operator).transfer(this.signers.owner.address, this.signers.toWhom.address, firstTokenId)).to.not.be.reverted;
                        transferWasSuccessful( this.signers.owner.address, firstTokenId);
                    })
                });
        
                context('when called by the owner without an approved user', function () {
                    it("should succeed", async function () {
                        await expect(this.tokenAsApprove.connect(this.signers.owner).approve(ZERO_ADDRESS, firstTokenId)).to.not.be.reverted;
                        await expect(this.tokenAsTransfer.connect(this.signers.operator).transfer(this.signers.owner.address, this.signers.toWhom.address, firstTokenId)).to.not.be.reverted;
                        transferWasSuccessful( this.signers.owner.address, firstTokenId);
                    })
                });
        
                context('when sent to the owner', function () {
                    before(async function () {
                        tx = <ContractTransaction><any>await this.tokenAsTransfer.connect(this.signers.owner).transfer(this.signers.owner.address, this.signers.owner.address, firstTokenId);
                    });
            
                    it('keeps ownership of the token', async function () {
                        expect(await this.tokenAsBaseGetter.callStatic.ownerOf(firstTokenId)).to.be.equal(this.signers.owner.address);
                    });
            
                    it('clears the approval for the token ID', async function () {
                        expect(await this.tokenAsBaseGetter.callStatic.getApproved(firstTokenId)).to.be.equal(ZERO_ADDRESS);
                    });
            
                    it('emits only a transfer event', async function () {
                        expectEvent(tx, 'Transfer', {
                            from: this.signers.owner.address,
                            to: this.signers.owner.address,
                            tokenId: firstTokenId,
                        });
                    });
            
                    it('keeps the owner balance', async function () {
                        expect(await this.tokenAsBaseGetter.callStatic.balanceOf(this.signers.owner.address)).to.equal(1);
                    });
            
                    //   it('keeps same tokens by index', async function () {
                    //     if (!this.token.tokenOfOwnerByIndex) return;
                    //     const tokensListed = await Promise.all(
                    //       [0, 1].map(i => this.token.tokenOfOwnerByIndex(this.signers.owner.address, i)),
                    //     );
                    //     expect(tokensListed.map(t => t.toNumber())).to.have.members(
                    //       [firstTokenId.toNumber(), secondTokenId.toNumber()],
                    //     );
                    //   });
                });
        
                context('when the address of the previous owner is incorrect', function () {
                    it('reverts', async function () {
                        await expect(this.tokenAsTransfer.connect(this.signers.owner).transfer(this.signers.other.address, this.signers.other.address, BigNumber.from(newTokenId)))
                            .to.be.revertedWith("ERC721: transfer from incorrect owner");
                    });
                });
        
                context('when the sender is not authorized for the token id', function () {
                    it('reverts', async function () {
                        await expect(this.tokenAsTransfer.connect(this.signers.other).transfer(this.signers.owner.address, this.signers.other.address, BigNumber.from(newTokenId)))
                            .to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
                    });
                });
        
                context('when the given token ID does not exist', function () {
                    it('reverts', async function () {
                        await expect(this.tokenAsTransfer.connect(this.signers.owner).transfer(this.signers.owner.address, this.signers.other.address, nonExistentTokenId))
                            .to.be.revertedWith("ERC721: operator query for nonexistent token");
                    });
                });
        
                context('when the address to transfer the token to is the zero address', function () {
                    it('reverts', async function () {
                        await expect(this.tokenAsTransfer.connect(this.signers.owner).transfer(this.signers.owner.address, ZERO_ADDRESS, BigNumber.from(newTokenId)))
                            .to.be.revertedWith("ERC721: transfer to the zero address");
                    });
                });
            });
        
            describe('via safeTransferFrom', async function () {
                it("with data", async function () {
                  const safeTransferFromWithData = (token: TransferLogic, signer: SignerWithAddress, from: any, to: any, tokenId: any, opts: any) => {
                    return this.tokenAsTransfer.connect(signer)['safeTransferFrom(address,address,uint256,bytes)'](from, to, tokenId, data);
                  };
        
                  shouldTransferSafely(this.tokenAsErc721MockExtension, this.tokenAsApprove, this.tokenAsBaseGetter, safeTransferFromWithData, data);
                });
        
                it("without data", async function () {
                  const safeTransferFromWithoutData = (token: TransferLogic, signer: SignerWithAddress, from: any, to: any, tokenId: any, opts: any) => {
                    return <any>token.connect(signer)['safeTransferFrom(address,address,uint256)'](from, to, tokenId);
                  };
        
                  shouldTransferSafely(this.tokenAsErc721MockExtension, this.tokenAsApprove, this.tokenAsBaseGetter, safeTransferFromWithoutData, null);
                });
        
        
                const shouldTransferSafely = async function (tokenMint: ERC721MockExtension, tokenApprove: ApproveLogic, tokenGetter: GetterLogic, 
                    transferFunction: (token: TransferLogic, signer: SignerWithAddress, from: string, to: string, tokenId: BigNumber, opts?: any) => Promise<TransactionReceipt>, data: any
                ) {
                  describe('to a user account', async function () {
                        await shouldTransferTokensByUsers(transferFunction);
                  });
        
                //   describe('to a valid receiver contract', function () {
                //     beforeEach(async function () {
                //       this.erc721Receiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.None]));
                //       this.toWhom = this.erc721Receiver.address;
                //     });
    
                //     shouldTransferTokensByUsers(tokenMint, tokenApprove, tokenGetter, transferFunction);
        
                //     it('calls onERC721Received', async function () {
                //       const tx = <ContractTransaction><any>await transferFunction(this.signers.owner, this.signers.owner.address, this.erc721Receiver.address, tokenId);
        
                //       await expectEvent(tx, 'Received', {
                //         operator: this.signers.owner.address,
                //         from: this.signers.owner.address,
                //         tokenId: tokenId,
                //         data: data,
                //       });
                //     });
        
                //     it('calls onERC721Received from approved', async function () {
                //       const tx = <ContractTransaction><any>await transferFunction(this.signers.approved, this.signers.owner.address, this.erc721Receiver.address, tokenId);
        
                //       await expectEvent(tx, 'Received', {
                //         operator: this.signers.approved.address,
                //         from: this.signers.owner.address,
                //         tokenId: tokenId,
                //         data: data,
                //       });
                //     });
        
                //     describe('with an invalid token id', function () {
                //       it('reverts', async function () {
                //         await expect(
                //           transferFunction(
                //             this.signers.owner,
                //             this.signers.owner.address,
                //             this.erc721Receiver.address,
                //             nonExistentTokenId
                //           )).to.be.revertedWith("ERC721: operator query for nonexistent token");
                //       });
                //     });
                //   });
                };
        
        
                // describe('to a receiver contract returning unexpected value', function () {
                //   it('reverts', async function () {
                //     const invalidReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, ["0x42424242", Error.None]));
                //     await expect(this.tokenAsTransfer.connect(this.signers.owner)['safeTransferFrom(address,address,uint256)'](this.signers.owner.address, invalidReceiver.address, tokenId))
                //         .to.be.revertedWith("ERC721: transfer to non ERC721Receiver implementer");
                //   });
                // });
        
                // describe('to a receiver contract that reverts with message', function () {
                //   it('reverts', async function () {
                //     const revertingReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.RevertWithMessage]));
                //     await expect(this.tokenAsTransfer.connect(this.signers.owner)['safeTransferFrom(address,address,uint256)'](this.signers.owner.address, revertingReceiver.address, tokenId))
                //         .to.be.revertedWith("ERC721ReceiverMock: reverting");
                //   });
                // });
        
                // describe('to a receiver contract that reverts without message', function () {
                //   it('reverts', async function () {
                //     const revertingReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.RevertWithoutMessage]));
                //     await expect(this.tokenAsTransfer.connect(this.signers.owner)['safeTransferFrom(address,address,uint256)'](this.signers.owner.address, revertingReceiver.address, tokenId))
                //         .to.be.revertedWith("ERC721: transfer to non ERC721Receiver implementer");
                //   });
                // });
        
                // describe('to a receiver contract that panics', function () {
                //   it('reverts', async function () {
                //     const revertingReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.Panic]));
                    
                //     await expect(this.tokenAsTransfer.connect(this.signers.owner)['safeTransferFrom(address,address,uint256)'](this.signers.owner.address, revertingReceiver.address, tokenId))
                //         .to.be.revertedWith("");
                //   });
                // });
        
                // describe('to a contract that does not implement the required function', function () {
                //   it('reverts', async function () {
                //     const nonReceiver = this.erc721;
                //     await expect(this.tokenAsTransfer.connect(this.signers.owner)['safeTransferFrom(address,address,uint256)'](this.signers.owner.address, nonReceiver.address, tokenId))
                //         .to.be.revertedWith("ERC721: transfer to non ERC721Receiver implementer");
                //   });
                // });
            });
            });
        
        });
        
}

export { shouldBehaveLikeERC721Transfer }