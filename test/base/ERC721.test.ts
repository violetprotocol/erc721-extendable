import { waffle } from "hardhat";
import chai from "chai";
import { MODULE } from "../setup";
import { shouldBehaveLikeERC721 } from "./ERC721.behaviour";

const { solidity } = waffle;
chai.use(solidity);

describe("ERC721", function () {
  shouldBehaveLikeERC721(MODULE.BASE);
});
