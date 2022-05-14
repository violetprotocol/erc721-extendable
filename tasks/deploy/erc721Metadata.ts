import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { ERC721Metadata } from "../../src/types";

import { deploy } from "../helpers";

task("deploy:ERC721Metadata")
  .addParam("name", "Name to give your ERC721 token")
  .addParam("symbol", "Symbol for your ERC721 token")
  .addParam("extend", "Extend Logic address")
  .addParam("approve", "Approve Logic address")
  .addParam("getter", "Base Getter Logic address")
  .addParam("onreceive", "onReceive Logic address")
  .addParam("transfer", "Transfer Logic address")
  .addParam("beforetransfer", "BeforeTransfer Logic address")
  .addParam("metadatagetter", "Base Getter Logic address")
  .addParam("settokenuri", "onReceive Logic address")
  .addParam("mint", "Mint Logic address")
  .addParam("burn", "MetadataBurn Logic address")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const erc721 = <ERC721Metadata>await deploy(ethers, "ERC721Metadata", 
        taskArguments.name,
        taskArguments.symbol,
        taskArguments.extend, 
        taskArguments.approve, 
        taskArguments.getter, 
        taskArguments.onreceive, 
        taskArguments.transfer,
        taskArguments.beforetransfer
    );
    await erc721.finaliseERC721MetadataExtending(
      taskArguments.metadatagetter, 
      taskArguments.settokenuri, 
      taskArguments.mint, 
      taskArguments.burn
    );
    console.log("ERC721Metadata deployed to: ", erc721.address);
  });
