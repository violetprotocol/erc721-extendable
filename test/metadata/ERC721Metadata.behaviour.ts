import { expect } from "chai";
import { firstTokenId, nonExistentTokenId } from "../base/ERC721.behaviour";
import { MODULE, TOKEN_NAME, TOKEN_SYMBOL } from "../setup";

export function shouldBehaveLikeERC721Metadata (module: MODULE) {
  context('metadata', function () {
    before(async function () {
      await this.redeploy(module, false);
    })

    describe('basic', function () {
      it('has a name', async function () {
        expect(await this.tokenAsMetadataGetter.callStatic.name()).to.be.equal(TOKEN_NAME);
      });
  
      it('has a symbol', async function () {
        expect(await this.tokenAsMetadataGetter.callStatic.symbol()).to.be.equal(TOKEN_SYMBOL);
      });
    })

    describe('token URI', function () {
      const BASE_URI = "https://violet.co/tokens/";
      const sampleUri = 'mock://mytoken';

      describe("unpermissioned", async function () {
        beforeEach(async function () {
          await this.redeploy(module, false);
          await this.tokenAsMint.mint(this.signers.owner.address, firstTokenId);
        });
    
        it('it is empty by default', async function () {
          expect(await this.tokenAsMetadataGetter.callStatic.tokenURI(firstTokenId)).to.be.equal('');
        });
    
        it('reverts when queried for non existent token id', async function () {
          await expect(
            this.tokenAsMetadataGetter.tokenURI(nonExistentTokenId)).to.be.revertedWith('ERC721URIStorage: URI query for nonexistent token');
        });
    
        it('can be set for a token id', async function () {
          await this.tokenAsSetTokenURI.setTokenURI(firstTokenId, sampleUri);
          expect(await this.tokenAsMetadataGetter.callStatic.tokenURI(firstTokenId)).to.be.equal(sampleUri);
        });
    
        it('reverts when setting for non existent token id', async function () {
          await expect(
            this.tokenAsSetTokenURI.setTokenURI(nonExistentTokenId, sampleUri)).to.be.revertedWith('ERC721URIStorage: URI set of nonexistent token');
        });
  
        context("base URI", function () {
          beforeEach(async function () {
            await this.redeploy(module, false);
            await this.tokenAsMint.mint(this.signers.owner.address, firstTokenId);
          });
  
          it('base URI can be set', async function () {
            await this.tokenAsSetTokenURI.setBaseURI(BASE_URI);
            expect(await this.tokenAsMetadataGetter.callStatic.baseURI()).to.equal(BASE_URI);
          });
      
          it('base URI is added as a prefix to the token URI', async function () {
            await this.tokenAsSetTokenURI.setBaseURI(BASE_URI);
            await this.tokenAsSetTokenURI.setTokenURI(firstTokenId, sampleUri);
      
            expect(await this.tokenAsMetadataGetter.callStatic.tokenURI(firstTokenId)).to.be.equal(BASE_URI + sampleUri);
          });
      
          it('token URI can be changed by changing the base URI', async function () {
            await this.tokenAsSetTokenURI.setBaseURI(BASE_URI);
            await this.tokenAsSetTokenURI.setTokenURI(firstTokenId, sampleUri);
      
            const newBaseURI = 'https://api.example.com/v2/';
            await this.tokenAsSetTokenURI.setBaseURI(newBaseURI);
            expect(await this.tokenAsMetadataGetter.callStatic.tokenURI(firstTokenId)).to.be.equal(newBaseURI + sampleUri);
          });
      
          it('tokenId is appended to base URI for tokens with no URI', async function () {
            await this.tokenAsSetTokenURI.setBaseURI(BASE_URI);
      
            expect(await this.tokenAsMetadataGetter.callStatic.tokenURI(firstTokenId)).to.be.equal(BASE_URI + firstTokenId);
          });
      
          it('tokens without URI can be burnt ', async function () {
            await this.tokenAsBurn.burn(firstTokenId);
      
            expect(await this.tokenAsErc721MockExtension.callStatic.exists(firstTokenId)).to.equal(false);
            await expect(
              this.tokenAsMetadataGetter.tokenURI(firstTokenId)).to.be.revertedWith('ERC721URIStorage: URI query for nonexistent token');
          });
      
          it('tokens with URI can be burnt ', async function () {
            await this.tokenAsSetTokenURI.setTokenURI(firstTokenId, sampleUri);
      
            await this.tokenAsBurn.burn(firstTokenId);
      
            expect(await this.tokenAsErc721MockExtension.callStatic.exists(firstTokenId)).to.equal(false);
            await expect(
              this.tokenAsMetadataGetter.tokenURI(firstTokenId)).to.be.revertedWith('ERC721URIStorage: URI query for nonexistent token');
          });
        })
      })

      describe("permissioned", async function () {
        beforeEach(async function () {
          await this.redeploy(module, true);
          await this.tokenAsMint.mint(this.signers.owner.address, firstTokenId);
        });
    
        it('it is empty by default', async function () {
          expect(await this.tokenAsMetadataGetter.callStatic.tokenURI(firstTokenId)).to.be.equal('');
        });
    
        it('reverts when queried for non existent token id', async function () {
          await expect(
            this.tokenAsMetadataGetter.tokenURI(nonExistentTokenId)).to.be.revertedWith('ERC721URIStorage: URI query for nonexistent token');
        });

        context("with owner", async function () {
          it('can be set for a token id', async function () {
            await this.tokenAsSetTokenURI.setTokenURI(firstTokenId, sampleUri);
            expect(await this.tokenAsMetadataGetter.callStatic.tokenURI(firstTokenId)).to.be.equal(sampleUri);
          });
      
          it('reverts when setting for non existent token id', async function () {
            await expect(
              this.tokenAsSetTokenURI.setTokenURI(nonExistentTokenId, sampleUri)
            ).to.be.revertedWith('ERC721URIStorage: URI set of nonexistent token');
          });
        })

        context("with non-owner", async function () {
          it('reverts when setting token URI', async function () {
            await expect(
              this.tokenAsSetTokenURI.connect(this.signers.other).setTokenURI(firstTokenId, sampleUri)
            ).to.be.revertedWith("SetTokenURI: unauthorised");
          });
      
          it('reverts when setting for non existent token id', async function () {
            await expect(
              this.tokenAsSetTokenURI.setTokenURI(nonExistentTokenId, sampleUri)
            ).to.be.revertedWith('ERC721URIStorage: URI set of nonexistent token');
          });
      
          it('reverts when burnt', async function () {
            await this.tokenAsSetTokenURI.setTokenURI(firstTokenId, sampleUri);
      
            await expect(this.tokenAsBurn.connect(this.signers.other).burn(firstTokenId))
            .to.be.revertedWith('MetadataBurnLogic: unauthorised');
          });
        })
    
  
        context("base URI", function () {
          context("as owner", async function () {
            beforeEach(async function () {
              await this.redeploy(module, true);
              await this.tokenAsMint.mint(this.signers.owner.address, firstTokenId);
            });

            it('base URI can be set', async function () {
              await this.tokenAsSetTokenURI.setBaseURI(BASE_URI);
              expect(await this.tokenAsMetadataGetter.callStatic.baseURI()).to.equal(BASE_URI);
            });
        
            it('base URI is added as a prefix to the token URI', async function () {
              await this.tokenAsSetTokenURI.setBaseURI(BASE_URI);
              await this.tokenAsSetTokenURI.setTokenURI(firstTokenId, sampleUri);
        
              expect(await this.tokenAsMetadataGetter.callStatic.tokenURI(firstTokenId)).to.be.equal(BASE_URI + sampleUri);
            });
        
            it('token URI can be changed by changing the base URI', async function () {
              await this.tokenAsSetTokenURI.setBaseURI(BASE_URI);
              await this.tokenAsSetTokenURI.setTokenURI(firstTokenId, sampleUri);
        
              const newBaseURI = 'https://api.example.com/v2/';
              await this.tokenAsSetTokenURI.setBaseURI(newBaseURI);
              expect(await this.tokenAsMetadataGetter.callStatic.tokenURI(firstTokenId)).to.be.equal(newBaseURI + sampleUri);
            });
        
            it('tokenId is appended to base URI for tokens with no URI', async function () {
              await this.tokenAsSetTokenURI.setBaseURI(BASE_URI);
        
              expect(await this.tokenAsMetadataGetter.callStatic.tokenURI(firstTokenId)).to.be.equal(BASE_URI + firstTokenId);
            });
        
            it('tokens without URI can be burnt ', async function () {
              await this.tokenAsBurn.burn(firstTokenId);
        
              expect(await this.tokenAsErc721MockExtension.callStatic.exists(firstTokenId)).to.equal(false);
              await expect(
                this.tokenAsMetadataGetter.tokenURI(firstTokenId)).to.be.revertedWith('ERC721URIStorage: URI query for nonexistent token');
            });
        
            it('tokens with URI can be burnt ', async function () {
              await this.tokenAsSetTokenURI.setTokenURI(firstTokenId, sampleUri);
        
              await this.tokenAsBurn.burn(firstTokenId);
        
              expect(await this.tokenAsErc721MockExtension.callStatic.exists(firstTokenId)).to.equal(false);
              await expect(
                this.tokenAsMetadataGetter.tokenURI(firstTokenId)).to.be.revertedWith('ERC721URIStorage: URI query for nonexistent token');
            });
          })
          
          context("as non-owner", async function () {
            beforeEach(async function () {
              await this.redeploy(module, true);
              await this.tokenAsMint.mint(this.signers.owner.address, firstTokenId);
            });

            it('set base URI reverts', async function () {
              await expect(this.tokenAsSetTokenURI.connect(this.signers.other).setBaseURI(BASE_URI))
              .to.be.revertedWith("SetTokenURI: unauthorised");
            });
          })
        })
      })
  
    });
  });
}