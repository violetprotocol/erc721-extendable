import { waffle } from "hardhat";
import { MODULE } from "../setup";
import { shouldBehaveLikeERC721Metadata } from "./ERC721Metadata.behaviour";

const chai = require("chai");
const { solidity } = waffle;
chai.use(solidity);

describe("ERC721Metadata", function () {
    before("deploy new", async function () {
        await this.redeployMetadata();
    });

    shouldBehaveLikeERC721Metadata(MODULE.METADATA);
});