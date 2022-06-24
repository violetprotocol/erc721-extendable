import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { BasicMintLogic } from "../src/types";

task("mint")
  .addParam("token", "Address of your ERC721 token")
  .addParam("recipient", "Address of token recipient")
  .addParam("id", "TokenId of the token to be minted")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const erc721Factory = await ethers.getContractFactory("BasicMintLogic");
    const erc721Mint = await <BasicMintLogic>erc721Factory.attach(taskArguments.token);


    const tx = await erc721Mint.mint(taskArguments.recipient, taskArguments.id);
    const receipt = await tx.wait();

    console.log(`Minted! Tx hash: ${receipt.transactionHash}`);
  });
