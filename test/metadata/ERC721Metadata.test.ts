import { waffle } from "hardhat";
import { MODULE } from "../setup";
import { shouldBehaveLikeERC721Metadata } from "./ERC721Metadata.behaviour";

const chai = require("chai");
const { solidity } = waffle;
chai.use(solidity);

describe("ERC721Metadata", function () {
    shouldBehaveLikeERC721Metadata(MODULE.METADATA);
});