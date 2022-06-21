import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { deploy } from "../helpers";

task("deploy:ERC721Enumerable")
  .addParam("name", "Name to give your ERC721 token")
  .addParam("symbol", "Symbol for your ERC721 token")
  .addParam("extend", "Extend Logic address")
  .addParam("approve", "Approve Logic address")
  .addParam("getter", "Base Getter Logic address")
  .addParam("onreceive", "onReceive Logic address")
  .addParam("transfer", "Transfer Logic address")
  .addParam("hooks", "EnumerableHooks Logic address")
  .addParam("enumerablegetter", "EnumerableGetter Logic address")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const erc721 = await deploy(ethers, "ERC721Enumerable", 
        taskArguments.name,
        taskArguments.symbol,
        taskArguments.extend, 
        taskArguments.approve, 
        taskArguments.getter, 
        taskArguments.onreceive, 
        taskArguments.transfer,
        taskArguments.hooks,
        taskArguments.enumerablegetter
    );
    console.log("ERC721Enumerable deployed to: ", erc721.address);
  });
