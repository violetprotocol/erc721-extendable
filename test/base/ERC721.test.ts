import { waffle } from "hardhat";
import { shouldBehaveLikeERC721 } from "./ERC721.behaviour";

const chai = require("chai");
const { solidity } = waffle;
chai.use(solidity);

describe("ERC721", function () {
    before("deploy new", async function () {
        await this.redeploy();
    })

    // shouldBehaveLikeERC721();
});