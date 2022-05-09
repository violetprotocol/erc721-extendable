import { waffle } from "hardhat";
import { shouldBehaveLikeERC721Enumerable } from "./ERC721Enumerable.behaviour";

const chai = require("chai");
const { solidity } = waffle;
chai.use(solidity);

describe("ERC721Enumerable", function () {
    before("deploy new", async function () {
        await this.redeployEnumerable();
    })

    shouldBehaveLikeERC721Enumerable();
});