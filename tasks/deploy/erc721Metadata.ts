import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { ERC721Metadata } from "../../src/types";

import { deploy } from "../helpers";

task("deploy:ERC721Metadata")
  .addParam("extend", "Extend Logic address")
  .addParam("approve", "Approve Logic address")
  .addParam("getter", "Base Getter Logic address")
  .addParam("onReceive", "onReceive Logic address")
  .addParam("transfer", "Transfer Logic address")
  .addParam("beforeTransfer", "BeforeTransfer Logic address")
  .addParam("metadataGetter", "Base Getter Logic address")
  .addParam("setTokenURI", "onReceive Logic address")
  .addParam("mint", "Mint Logic address")
  .addParam("burn", "MetadataBurn Logic address")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const erc721 = <ERC721Metadata>await deploy(ethers, "ERC721", 
        taskArguments.extend, 
        taskArguments.approve, 
        taskArguments.getter, 
        taskArguments.onReceive, 
        taskArguments.transfer,
        taskArguments.beforeTransfer
    );
    await erc721.finaliseERC721MetadataExtending(
      taskArguments.metadataGetter, 
      taskArguments.setTokenURI, 
      taskArguments.mint, 
      taskArguments.burn
    );
    console.log("ERC721 deployed to: ", erc721.address);
  });
