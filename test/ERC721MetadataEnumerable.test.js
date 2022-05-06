// const { shouldBehaveLikeERC721 } = require('./base/ERC721.behavior');
// const { shouldBehaveLikeERC721Enumerable } = require('./enumerable/ERC721Enumerable.behavior');
// const { shouldBehaveLikeERC721Metadata } = require('./metadata/ERC721Metadata.behavior');

// const ERC721Metadata = artifacts.require('ERC721Metadata');

// contract('ERC721', function (accounts) {
//   const name = 'Non Fungible Token';
//   const symbol = 'NFT';

//   beforeEach(async function () {
//     this.token = await ERC721Metadata.new(name, symbol);
//   });

//   shouldBehaveLikeERC721('ERC721', ...accounts);
//   shouldBehaveLikeERC721Metadata('ERC721', name, symbol, ...accounts);
//   shouldBehaveLikeERC721Enumerable('ERC721', ...accounts);
// });
