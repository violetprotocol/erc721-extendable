import { waffle } from "hardhat";
import { shouldBehaveLikeERC721 } from "./base/ERC721.behaviour";
import { shouldBehaveLikeERC721Enumerable } from "./enumerable/ERC721Enumerable.behaviour";
import { shouldBehaveLikeERC721Metadata } from "./metadata/ERC721Metadata.behaviour";
import { MODULE } from "./setup";

const chai = require("chai");
const { solidity } = waffle;
chai.use(solidity);

describe("ERC721MetadataEnumerable", function () {
    shouldBehaveLikeERC721(MODULE.METADATAENUMERABLE);
    // shouldBehaveLikeERC721Metadata(MODULE.METADATAENUMERABLE);
    // shouldBehaveLikeERC721Enumerable(MODULE.METADATAENUMERABLE);
});