import { waffle } from "hardhat";
import chai from "chai";
import { shouldBehaveLikeERC721 } from "./base/ERC721.behaviour";
import { shouldBehaveLikeERC721Enumerable } from "./enumerable/ERC721Enumerable.behaviour";
import { shouldBehaveLikeERC721Metadata } from "./metadata/ERC721Metadata.behaviour";
import { MODULE } from "./setup";

const { solidity } = waffle;
chai.use(solidity);

// eslint-disable-next-line no-undef
describe("ERC721MetadataEnumerable", function () {
  shouldBehaveLikeERC721(MODULE.METADATAENUMERABLE);
  shouldBehaveLikeERC721Metadata(MODULE.METADATAENUMERABLE);
  shouldBehaveLikeERC721Enumerable(MODULE.METADATAENUMERABLE);
});
