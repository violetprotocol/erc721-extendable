import { waffle } from "hardhat";
import chai from "chai";
import { MODULE } from "../setup";
import { shouldBehaveLikeERC721Enumerable } from "./ERC721Enumerable.behaviour";

const { solidity } = waffle;
chai.use(solidity);

describe("ERC721Enumerable", function () {
  shouldBehaveLikeERC721Enumerable(MODULE.ENUMERABLE);
});
