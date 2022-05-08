import { expect } from "chai";
import { BigNumber } from "ethers";
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
import { attachExtendableContract, deployExtendableContract, Extended } from "../types";
import { EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, TOKEN_LOGIC_INTERFACE } from "../utils/constants";

const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const Error = {
  Panic: 3,
  RevertWithoutMessage: 2,
  RevertWithMessage: 1,
  None: 0,
}

const firstTokenId = BigNumber.from(5042);
const secondTokenId = BigNumber.from(79217);
const nonExistentTokenId = BigNumber.from(13);
const fourthTokenId = BigNumber.from(4);

const RECEIVER_MAGIC_VALUE = '0x150b7a02';

const shouldBehaveLikeERC721 = () => {
    before(async function () {
        this.redeployToken = async function () {
            this.erc721 = <Extended<ERC721>>await deployExtendableContract(this.signers.admin, this.artifacts.erc721, ["TOKEN_NAME", "TOKEN_SYMBOL", this.extend.address, this.approve.address, this.baseGetter.address, this.onReceive.address, this.transfer.address, this.beforeTransfer.address]) 
            this.tokenAsExtend = <ExtendLogic>await this.erc721.as(this.artifacts.extend);
            await this.tokenAsExtend.extend(this.erc721MockExtension.address);
        
            this.tokenAsApprove = <ApproveLogic>await this.erc721.as(this.artifacts.approve);
            this.tokenAsBurn = <BasicBurnLogic>await this.erc721.as(this.artifacts.burn);
            this.tokenAsBaseGetter = <GetterLogic>await this.erc721.as(this.artifacts.baseGetter);
            this.tokenAsBeforeTransfer = <BeforeTransferLogic>await this.erc721.as(this.artifacts.beforeTransfer);
            this.tokenAsOnReceive = <OnReceiveLogic>await this.erc721.as(this.artifacts.onReceive);
            this.tokenAsTransfer = <TransferLogic>await this.erc721.as(this.artifacts.transfer);
            this.tokenAsErc721MockExtension = <ERC721MockExtension>await this.erc721.as(this.artifacts.erc721MockExtension);
        }

        await this.redeployToken();
    })

    context('with minted tokens', async function () {
        before(async function () {
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
    
        // describe('ownerOf', function () {
        //   context('when the given token ID was tracked by this token', function () {
        //     const tokenId = firstTokenId;
    
        //     it('returns the owner of the given token ID', async function () {
        //       expect(await this.tokenAsBaseGetter.ownerOf(tokenId)).to.be.equal(this.signers.owner.address);
        //     });
        //   });
    
        //   context('when the given token ID was not tracked by this token', function () {
        //     const tokenId = nonExistentTokenId;
    
        //     it('reverts', async function () {
        //       await expectRevert(
        //         this.tokenAsBaseGetter.ownerOf(tokenId), 'ERC721: owner query for nonexistent token',
        //       );
        //     });
        //   });
        // });
    
        // describe('transfers', function () {
        //   const tokenId = firstTokenId;
        //   const data = '0x42';
    
        //   let logs: any = null;
    
        //   beforeEach(async function () {
        //     await this.tokenAsApprove.approve(this.approved, tokenId, { from: this.signers.owner.address });
        //     await this.tokenAsApprove.setApprovalForAll(this.operator, true, { from: this.signers.owner.address });
        //   });
    
        //   const transferWasSuccessful = function (owner: string, tokenId: BigNumber) {
        //     it('transfers the ownership of the given token ID to the given address', async function () {
        //       expect(await this.tokenAsBaseGetter.ownerOf(tokenId)).to.be.equal(this.toWhom);
        //     });
    
        //     it('emits a Transfer event', async function () {
        //       expectEvent.inLogs(logs, 'Transfer', { from: owner, to: this.toWhom, tokenId: tokenId });
        //     });
    
        //     it('clears the approval for the token ID', async function () {
        //       expect(await this.tokenAsBaseGetter.getApproved(tokenId)).to.be.equal(ZERO_ADDRESS);
        //     });
    
        //     it('emits an Approval event', async function () {
        //       expectEvent.inLogs(logs, 'Approval', { owner, approved: ZERO_ADDRESS, tokenId: tokenId });
        //     });
    
        //     it('adjusts owners balances', async function () {
        //       expect(await this.tokenAsBaseGetter.balanceOf(owner)).to.equal(BigNumber.from(1));
        //     });
    
        //     // Doesn't exist, not sure why this even exists @openzeppelin explain?
        //     // it('adjusts owners tokens by index', async function () {
        //     //   if (!this.token.tokenOfOwnerByIndex) return;
    
        //     //   expect(await this.token.tokenOfOwnerByIndex(this.toWhom, 0)).to.be.bignumber.equal(tokenId);
    
        //     //   expect(await this.token.tokenOfOwnerByIndex(owner, 0)).to.be.bignumber.not.equal(tokenId);
        //     // });
        //   };
    
        //   const shouldTransferTokensByUsers = function (transferFunction: any) {
        //     context('when called by the owner', function () {
        //       beforeEach(async function () {
        //         ({ logs } = await transferFunction.call(this, this.signers.owner.address, this.toWhom, tokenId, { from: this.signers.owner.address }));
        //       });
        //       it("", async function () {
        //         transferWasSuccessful( this.signers.owner.address, tokenId);
        //       })
        //     });
    
        //     context('when called by the approved individual', function () {
        //       beforeEach(async function () {
        //         ({ logs } = await transferFunction.call(this, this.signers.owner.address, this.toWhom, tokenId, { from: this.approved }));
        //       });
        //       it("", async function () {
        //         transferWasSuccessful( this.signers.owner.address, tokenId);
        //       })
        //     });
    
        //     context('when called by the operator', function () {
        //       beforeEach(async function () {
        //         ({ logs } = await transferFunction.call(this, this.signers.owner.address, this.toWhom, tokenId, { from: this.operator }));
        //       });
        //       it("", async function () {
        //         transferWasSuccessful( this.signers.owner.address, tokenId);
        //       })
        //     });
    
        //     context('when called by the owner without an approved user', function () {
        //       beforeEach(async function () {
        //         await this.tokenAsApprove.approve(ZERO_ADDRESS, tokenId, { from: this.signers.owner.address });
        //         ({ logs } = await transferFunction.call(this, this.signers.owner.address, this.toWhom, tokenId, { from: this.operator }));
        //       });
        //       it("", async function () {
        //         transferWasSuccessful( this.signers.owner.address, tokenId);
        //       })
        //     });
    
        //     context('when sent to the owner', function () {
        //       beforeEach(async function () {
        //         ({ logs } = await transferFunction.call(this, this.signers.owner.address, this.signers.owner.address, tokenId, { from: this.signers.owner.address }));
        //       });
    
        //       it('keeps ownership of the token', async function () {
        //         expect(await this.tokenAsBaseGetter.ownerOf(tokenId)).to.be.equal(this.signers.owner.address);
        //       });
    
        //       it('clears the approval for the token ID', async function () {
        //         expect(await this.tokenAsBaseGetter.getApproved(tokenId)).to.be.equal(ZERO_ADDRESS);
        //       });
    
        //       it('emits only a transfer event', async function () {
        //         expectEvent.inLogs(logs, 'Transfer', {
        //           from: this.signers.owner.address,
        //           to: this.signers.owner.address,
        //           tokenId: tokenId,
        //         });
        //       });
    
        //       it('keeps the owner balance', async function () {
        //         expect(await this.tokenAsBaseGetter.balanceOf(this.signers.owner.address)).to.equal(BigNumber.from(2));
        //       });
    
        //     //   it('keeps same tokens by index', async function () {
        //     //     if (!this.token.tokenOfOwnerByIndex) return;
        //     //     const tokensListed = await Promise.all(
        //     //       [0, 1].map(i => this.token.tokenOfOwnerByIndex(this.signers.owner.address, i)),
        //     //     );
        //     //     expect(tokensListed.map(t => t.toNumber())).to.have.members(
        //     //       [firstTokenId.toNumber(), secondTokenId.toNumber()],
        //     //     );
        //     //   });
        //     });
    
        //     context('when the address of the previous owner is incorrect', function () {
        //       it('reverts', async function () {
        //         await expectRevert(
        //           transferFunction.call(this, this.signers.other.address, this.signers.other.address, tokenId, { from: this.signers.owner.address }),
        //           'ERC721: transfer from incorrect owner',
        //         );
        //       });
        //     });
    
        //     context('when the sender is not authorized for the token id', function () {
        //       it('reverts', async function () {
        //         await expectRevert(
        //           transferFunction.call(this, this.signers.owner.address, this.signers.other.address, tokenId, { from: this.signers.other.address }),
        //           'ERC721: transfer caller is not owner nor approved',
        //         );
        //       });
        //     });
    
        //     context('when the given token ID does not exist', function () {
        //       it('reverts', async function () {
        //         await expectRevert(
        //           transferFunction.call(this, this.signers.owner.address, this.signers.other.address, nonExistentTokenId, { from: this.signers.owner.address }),
        //           'ERC721: operator query for nonexistent token',
        //         );
        //       });
        //     });
    
        //     context('when the address to transfer the token to is the zero address', function () {
        //       it('reverts', async function () {
        //         await expectRevert(
        //           transferFunction.call(this, this.signers.owner.address, ZERO_ADDRESS, tokenId, { from: this.signers.owner.address }),
        //           'ERC721: transfer to the zero address',
        //         );
        //       });
        //     });
        //   };
    
        //   describe('via transferFrom', function () {
        //     it("", async function() {
        //       shouldTransferTokensByUsers((from: any, to: any, tokenId: any, opts: any) => {
        //         return this.tokenAsTransfer.transferFrom(from, to, tokenId, opts);
        //       });
        //     })
        //   });
    
        //   describe('via safeTransferFrom', function () {
        //     it("with data", async function () {
        //       const safeTransferFromWithData = (from: any, to: any, tokenId: any, opts: any) => {
        //         return this.tokenAsTransfer['safeTransferFrom(address,address,uint256,bytes)'](from, to, tokenId, data, opts);
        //       };
    
        //       shouldTransferSafely(safeTransferFromWithData, data);
        //     });
    
        //     it("without data", async function () {
        //       const safeTransferFromWithoutData = (from: any, to: any, tokenId: any, opts: any) => {
        //         return this.tokenAsTransfer['safeTransferFrom(address,address,uint256)'](from, to, tokenId, opts);
        //       };
    
        //       shouldTransferSafely(safeTransferFromWithoutData, null);
        //     });
    
    
        //     const shouldTransferSafely = function (transferFun: any, data: any) {
        //       describe('to a user account', function () {
        //         shouldTransferTokensByUsers(transferFun);
        //       });
    
        //       describe('to a valid receiver contract', function () {
        //         beforeEach(async function () {
        //           this.erc721Receiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.None]));
        //           this.toWhom = this.receiver.address;
        //         });
    
        //         shouldTransferTokensByUsers(transferFun);
    
        //         it('calls onERC721Received', async function () {
        //           const receipt = await transferFun.call(this, this.signers.owner.address, this.receiver.address, tokenId, { from: this.signers.owner.address });
    
        //           await expectEvent.inTransaction(receipt.tx, this.erc721Receiver, 'Received', {
        //             operator: this.signers.owner.address,
        //             from: this.signers.owner.address,
        //             tokenId: tokenId,
        //             data: data,
        //           });
        //         });
    
        //         it('calls onERC721Received from approved', async function () {
        //           const receipt = await transferFun.call(this, this.signers.owner.address, this.receiver.address, tokenId, { from: this.approved });
    
        //           await expectEvent.inTransaction(receipt.tx, this.erc721Receiver, 'Received', {
        //             operator: this.approved,
        //             from: this.signers.owner.address,
        //             tokenId: tokenId,
        //             data: data,
        //           });
        //         });
    
        //         describe('with an invalid token id', function () {
        //           it('reverts', async function () {
        //             await expectRevert(
        //               transferFun.call(
        //                 this,
        //                 this.signers.owner.address,
        //                 this.receiver.address,
        //                 nonExistentTokenId,
        //                 { from: this.signers.owner.address },
        //               ),
        //               'ERC721: operator query for nonexistent token',
        //             );
        //           });
        //         });
        //       });
        //     };
    
    
        //     describe('to a receiver contract returning unexpected value', function () {
        //       it('reverts', async function () {
        //         const invalidReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, ['0x42', Error.None]));
        //         await expectRevert(
        //           this.tokenAsErc721MockExtension.safeTransferFrom(this.signers.owner.address, invalidReceiver.address, tokenId, { from: this.signers.owner.address }),
        //           'ERC721: transfer to non ERC721Receiver implementer',
        //         );
        //       });
        //     });
    
        //     describe('to a receiver contract that reverts with message', function () {
        //       it('reverts', async function () {
        //         const revertingReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.RevertWithMessage]));
        //         await expectRevert(
        //           this.tokenAsErc721MockExtension.safeTransferFrom(this.signers.owner.address, revertingReceiver.address, tokenId, { from: this.signers.owner.address }),
        //           'ERC721ReceiverMock: reverting',
        //         );
        //       });
        //     });
    
        //     describe('to a receiver contract that reverts without message', function () {
        //       it('reverts', async function () {
        //         const revertingReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.RevertWithoutMessage]));
        //         await expectRevert(
        //           this.tokenAsErc721MockExtension.safeTransferFrom(this.signers.owner.address, revertingReceiver.address, tokenId, { from: this.signers.owner.address }),
        //           'ERC721: transfer to non ERC721Receiver implementer',
        //         );
        //       });
        //     });
    
        //     describe('to a receiver contract that panics', function () {
        //       it('reverts', async function () {
        //         const revertingReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.Panic]));
        //         await expectRevert.unspecified(
        //           this.tokenAsErc721MockExtension.safeTransferFrom(this.signers.owner.address, revertingReceiver.address, tokenId, { from: this.signers.owner.address }),
        //         );
        //       });
        //     });
    
        //     describe('to a contract that does not implement the required function', function () {
        //       it('reverts', async function () {
        //         const nonReceiver = this.token;
        //         await expectRevert(
        //           this.tokenAsTransfer.safeTransferFrom(this.signers.owner.address, nonReceiver.address, tokenId, { from: this.signers.owner.address }),
        //           'ERC721: transfer to non ERC721Receiver implementer',
        //         );
        //       });
        //     });
        //   });
        // });
    
        // describe('safe mint', function () {
        //   const tokenId = fourthTokenId;
        //   const data = '0x42';
    
        //   describe('via safeMint', function () { // regular minting is tested in ERC721Mintable.test.js and others
        //     it('calls onERC721Received — with data', async function () {
        //       this.receiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.None]));
        //       const receipt = await this.tokenAsErc721MockExtension.safeMint(this.receiver.address, tokenId, data);
    
        //       await expectEvent.inTransaction(receipt.tx, this.receiver, 'Received', {
        //         from: ZERO_ADDRESS,
        //         tokenId: tokenId,
        //         data: data,
        //       });
        //     });
    
        //     it('calls onERC721Received — without data', async function () {
        //       this.receiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.None]));
        //       const receipt = await this.tokenAsErc721MockExtension.safeMint(this.receiver.address, tokenId);
    
        //       await expectEvent.inTransaction(receipt.tx, this.receiver, 'Received', {
        //         from: ZERO_ADDRESS,
        //         tokenId: tokenId,
        //       });
        //     });
    
        //     context('to a receiver contract returning unexpected value', function () {
        //       it('reverts', async function () {
        //         const invalidReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, ['0x42', Error.None]));
        //         await expectRevert(
        //           this.tokenAsErc721MockExtension.safeMint(invalidReceiver.address, tokenId),
        //           'ERC721: transfer to non ERC721Receiver implementer',
        //         );
        //       });
        //     });
    
        //     context('to a receiver contract that reverts with message', function () {
        //       it('reverts', async function () {
        //         const revertingReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.RevertWithMessage]));
        //         await expectRevert(
        //           this.tokenAsErc721MockExtension.safeMint(revertingReceiver.address, tokenId),
        //           'ERC721ReceiverMock: reverting',
        //         );
        //       });
        //     });
    
        //     context('to a receiver contract that reverts without message', function () {
        //       it('reverts', async function () {
        //         const revertingReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.RevertWithoutMessage]));
        //         await expectRevert(
        //           this.tokenAsErc721MockExtension.safeMint(revertingReceiver.address, tokenId),
        //           'ERC721: transfer to non ERC721Receiver implementer',
        //         );
        //       });
        //     });
    
        //     context('to a receiver contract that panics', function () {
        //       it('reverts', async function () {
        //         const revertingReceiver = await <ERC721ReceiverMock>(await waffle.deployContract(this.signers.admin, this.artifacts.erc721Receiver, [RECEIVER_MAGIC_VALUE, Error.Panic]));
        //         await expectRevert.unspecified(
        //           this.tokenAsErc721MockExtension.safeMint(revertingReceiver.address, tokenId),
        //         );
        //       });
        //     });
    
        //     context('to a contract that does not implement the required function', function () {
        //       it('reverts', async function () {
        //         const nonReceiver = this.token;
        //         await expectRevert(
        //           this.tokenAsErc721MockExtension.safeMint(nonReceiver.address, tokenId),
        //           'ERC721: transfer to non ERC721Receiver implementer',
        //         );
        //       });
        //     });
        //   });
        // });
    
        // describe('approve', function () {
        //   const tokenId = firstTokenId;
    
        //   let logs: any = null;
    
        //   const itClearsApproval = function () {
        //     it('clears approval for the token', async function () {
        //       expect(await this.tokenAsBaseGetter.getApproved(tokenId)).to.be.equal(ZERO_ADDRESS);
        //     });
        //   };
    
        //   const itApproves = function (address: any) {
        //     it('sets the approval for the target address', async function () {
        //       expect(await this.tokenAsBaseGetter.getApproved(tokenId)).to.be.equal(address);
        //     });
        //   };
    
        //   const itEmitsApprovalEvent = function (address: any) {
        //     it('emits an approval event', async function () {
        //       expectEvent.inLogs(logs, 'Approval', {
        //         owner: this.signers.owner.address,
        //         approved: address,
        //         tokenId: tokenId,
        //       });
        //     });
        //   };
    
        //   context('when clearing approval', function () {
        //     context('when there was no prior approval', function () {
        //       beforeEach(async function () {
        //         ({ logs } = await this.tokenAsApprove.approve(ZERO_ADDRESS, tokenId, { from: this.signers.owner.address }));
        //       });
    
        //       itClearsApproval();
        //       itEmitsApprovalEvent(ZERO_ADDRESS);
        //     });
    
        //     context('when there was a prior approval', function () {
        //       beforeEach(async function () {
        //         await this.tokenAsApprove.approve(this.approved, tokenId, { from: this.signers.owner.address });
        //         ({ logs } = await this.tokenAsApprove.approve(ZERO_ADDRESS, tokenId, { from: this.signers.owner.address }));
        //       });
    
        //       itClearsApproval();
        //       itEmitsApprovalEvent(ZERO_ADDRESS);
        //     });
        //   });
    
        //   context('when approving a non-zero address', function () {
        //     context('when there was no prior approval', function () {
        //       beforeEach(async function () {
        //         ({ logs } = await this.tokenAsApprove.approve(this.approved, tokenId, { from: this.signers.owner.address }));
        //       });
    
        //       it("", async function () {
        //         itApproves(this.approved);
        //         itEmitsApprovalEvent(this.approved);
        //       })
        //     });
    
        //     context('when there was a prior approval to the same address', function () {
        //       beforeEach(async function () {
        //         await this.tokenAsApprove.approve(this.approved, tokenId, { from: this.signers.owner.address });
        //         ({ logs } = await this.tokenAsApprove.approve(this.approved, tokenId, { from: this.signers.owner.address }));
        //       });
    
        //       it("", async function() {
        //         itApproves(this.approved);
        //         itEmitsApprovalEvent(this.approved);
        //       })
        //     });
    
        //     context('when there was a prior approval to a different address', function () {
        //       beforeEach(async function () {
        //         await this.tokenAsApprove.approve(this.anotherApproved, tokenId, { from: this.signers.owner.address });
        //         ({ logs } = await this.tokenAsApprove.approve(this.anotherApproved, tokenId, { from: this.signers.owner.address }));
        //       });
    
        //       it("", async function () {
        //         itApproves(this.anotherApproved);
        //         itEmitsApprovalEvent(this.anotherApproved);
        //       })
        //     });
        //   });
    
        //   context('when the address that receives the approval is the owner', function () {
        //     it('reverts', async function () {
        //       await expectRevert(
        //         this.tokenAsApprove.approve(this.signers.owner.address, tokenId, { from: this.signers.owner.address }), 'ERC721: approval to current owner',
        //       );
        //     });
        //   });
    
        //   context('when the sender does not own the given token ID', function () {
        //     it('reverts', async function () {
        //       await expectRevert(this.tokenAsApprove.approve(this.approved, tokenId, { from: this.signers.other.address }),
        //         'ERC721: approve caller is not owner nor approved');
        //     });
        //   });
    
        //   context('when the sender is approved for the given token ID', function () {
        //     it('reverts', async function () {
        //       await this.tokenAsApprove.approve(this.approved, tokenId, { from: this.signers.owner.address });
        //       await expectRevert(this.tokenAsApprove.approve(this.anotherApproved, tokenId, { from: this.approved }),
        //         'ERC721: approve caller is not owner nor approved for all');
        //     });
        //   });
    
        //   context('when the sender is an operator', function () {
        //     beforeEach(async function () {
        //       await this.tokenAsApprove.setApprovalForAll(this.operator, true, { from: this.signers.owner.address });
        //       ({ logs } = await this.tokenAsApprove.approve(this.approved, tokenId, { from: this.operator }));
        //     });
    
        //     it("", async function () {
        //       itApproves(this.approved);
        //       itEmitsApprovalEvent(this.approved);
        //     })
        //   });
    
        //   context('when the given token ID does not exist', function () {
        //     it('reverts', async function () {
        //       await expectRevert(this.tokenAsApprove.approve(this.approved, nonExistentTokenId, { from: this.operator }),
        //         'ERC721: owner query for nonexistent token');
        //     });
        //   });
        // });
    
        // describe('setApprovalForAll', function () {
        //   context('when the operator willing to approve is not the owner', function () {
        //     context('when there is no operator approval set by the sender', function () {
        //       it('approves the operator', async function () {
        //         await this.tokenAsApprove.setApprovalForAll(this.operator, true, { from: this.signers.owner.address });
    
        //         expect(await this.tokenAsBaseGetter.isApprovedForAll(this.signers.owner.address, this.operator)).to.equal(true);
        //       });
    
        //       it('emits an approval event', async function () {
        //         const { logs } = await this.tokenAsApprove.setApprovalForAll(this.operator, true, { from: this.signers.owner.address });
    
        //         expectEvent.inLogs(logs, 'ApprovalForAll', {
        //           owner: this.signers.owner.address,
        //           operator: this.operator,
        //           approved: true,
        //         });
        //       });
        //     });
    
        //     context('when the operator was set as not approved', function () {
        //       beforeEach(async function () {
        //         await this.tokenAsApprove.setApprovalForAll(this.operator, false, { from: this.signers.owner.address });
        //       });
    
        //       it('approves the operator', async function () {
        //         await this.tokenAsApprove.setApprovalForAll(this.operator, true, { from: this.signers.owner.address });
    
        //         expect(await this.tokenAsBaseGetter.isApprovedForAll(this.signers.owner.address, this.operator)).to.equal(true);
        //       });
    
        //       it('emits an approval event', async function () {
        //         const { logs } = await this.tokenAsApprove.setApprovalForAll(this.operator, true, { from: this.signers.owner.address });
    
        //         expectEvent.inLogs(logs, 'ApprovalForAll', {
        //           owner: this.signers.owner.address,
        //           operator: this.operator,
        //           approved: true,
        //         });
        //       });
    
        //       it('can unset the operator approval', async function () {
        //         await this.tokenAsApprove.setApprovalForAll(this.operator, false, { from: this.signers.owner.address });
    
        //         expect(await this.tokenAsBaseGetter.isApprovedForAll(this.signers.owner.address, this.operator)).to.equal(false);
        //       });
        //     });
    
        //     context('when the operator was already approved', function () {
        //       beforeEach(async function () {
        //         await this.tokenAsApprove.setApprovalForAll(this.operator, true, { from: this.signers.owner.address });
        //       });
    
        //       it('keeps the approval to the given address', async function () {
        //         await this.tokenAsApprove.setApprovalForAll(this.operator, true, { from: this.signers.owner.address });
    
        //         expect(await this.tokenAsBaseGetter.isApprovedForAll(this.signers.owner.address, this.operator)).to.equal(true);
        //       });
    
        //       it('emits an approval event', async function () {
        //         const { logs } = await this.tokenAsApprove.setApprovalForAll(this.operator, true, { from: this.signers.owner.address });
    
        //         expectEvent.inLogs(logs, 'ApprovalForAll', {
        //           owner: this.signers.owner.address,
        //           operator: this.operator,
        //           approved: true,
        //         });
        //       });
        //     });
        //   });
    
        //   context('when the operator is the owner', function () {
        //     it('reverts', async function () {
        //       await expectRevert(this.tokenAsApprove.setApprovalForAll(this.signers.owner.address, true, { from: this.signers.owner.address }),
        //         'ERC721: approve to caller');
        //     });
        //   });
        // });
    
        // describe('getApproved', async function () {
        //   context('when token is not minted', async function () {
        //     it('reverts', async function () {
        //       await expectRevert(
        //         this.tokenAsBaseGetter.getApproved(nonExistentTokenId),
        //         'ERC721: approved query for nonexistent token',
        //       );
        //     });
        //   });
    
        //   context('when token has been minted ', async function () {
        //     it('should return the zero address', async function () {
        //       expect(await this.tokenAsBaseGetter.getApproved(firstTokenId)).to.be.equal(
        //         ZERO_ADDRESS,
        //       );
        //     });
    
        //     context('when account has been approved', async function () {
        //       beforeEach(async function () {
        //         await this.tokenAsApprove.approve(this.approved, firstTokenId, { from: this.signers.owner.address });
        //       });
    
        //       it('returns approved account', async function () {
        //         expect(await this.tokenAsBaseGetter.getApproved(firstTokenId)).to.be.equal(this.approved);
        //       });
        //     });
        //   });
        // });
      });
    
    //   describe('_mint(address, uint256)', function () {
    //     it('reverts with a null destination address', async function () {
    //       await expectRevert(
    //         this.tokenAsErc721MockExtension.mint(ZERO_ADDRESS, firstTokenId), 'ERC721: mint to the zero address',
    //       );
    //     });
    
    //     context('with minted token', async function () {
    //       beforeEach(async function () {
    //         ({ logs: this.logs } = await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, firstTokenId));
    //       });
    
    //       it('emits a Transfer event', function () {
    //         expectEvent.inLogs(this.logs, 'Transfer', { from: ZERO_ADDRESS, to: this.signers.owner.address, tokenId: firstTokenId });
    //       });
    
    //       it('creates the token', async function () {
    //         expect(await this.tokenAsBaseGetter.balanceOf(this.signers.owner.address)).to.equal(BigNumber.from(1));
    //         expect(await this.tokenAsBaseGetter.ownerOf(firstTokenId)).to.equal(this.signers.owner.address);
    //       });
    
    //       it('reverts when adding a token id that already exists', async function () {
    //         await expectRevert(this.tokenAsErc721MockExtension.mint(this.signers.owner.address, firstTokenId), 'ERC721: token already minted');
    //       });
    //     });
    //   });
    
    //   describe('_burn', function () {
    //     it('reverts when burning a non-existent token id', async function () {
    //       await expectRevert(
    //         this.tokenAsErc721MockExtension.burn(nonExistentTokenId), 'ERC721: owner query for nonexistent token',
    //       );
    //     });
    
    //     context('with minted tokens', function () {
    //       beforeEach(async function () {
    //         await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, firstTokenId);
    //         await this.tokenAsErc721MockExtension.mint(this.signers.owner.address, secondTokenId);
    //       });
    
    //       context('with burnt token', function () {
    //         beforeEach(async function () {
    //           ({ logs: this.logs } = await this.tokenAsErc721MockExtension.burn(firstTokenId));
    //         });
    
    //         it('emits a Transfer event', function () {
    //           expectEvent.inLogs(this.logs, 'Transfer', { from: this.signers.owner.address, to: ZERO_ADDRESS, tokenId: firstTokenId });
    //         });
    
    //         it('emits an Approval event', function () {
    //           expectEvent.inLogs(this.logs, 'Approval', { owner: this.signers.owner.address, approved: ZERO_ADDRESS, tokenId: firstTokenId });
    //         });
    
    //         it('deletes the token', async function () {
    //           expect(await this.tokenAsBaseGetter.balanceOf(this.signers.owner.address)).to.equal(BigNumber.from(1));
    //           await expectRevert(
    //             this.tokenAsBaseGetter.ownerOf(firstTokenId), 'ERC721: owner query for nonexistent token',
    //           );
    //         });
    
    //         it('reverts when burning a token id that has been deleted', async function () {
    //           await expectRevert(
    //             this.tokenAsErc721MockExtension.burn(firstTokenId), 'ERC721: owner query for nonexistent token',
    //           );
    //         });
    //       });
    //     });
    //   });
}

export { shouldBehaveLikeERC721 }