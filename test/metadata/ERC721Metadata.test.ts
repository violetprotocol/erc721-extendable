import { waffle } from "hardhat";
import chai from "chai";
import { MODULE } from "../setup";
import { shouldBehaveLikeERC721Metadata } from "./ERC721Metadata.behaviour";

const { solidity } = waffle;
chai.use(solidity);

describe("ERC721Metadata", function () {
  shouldBehaveLikeERC721Metadata(MODULE.METADATA);
});
