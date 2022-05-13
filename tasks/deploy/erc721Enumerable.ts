import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { deploy } from "../helpers";

task("deploy:ERC721Enumerable")
  .addParam("extend", "Extend Logic address")
  .addParam("approve", "Approve Logic address")
  .addParam("getter", "Base Getter Logic address")
  .addParam("onReceive", "onReceive Logic address")
  .addParam("transfer", "Transfer Logic address")
  .addParam("beforeTransfer", "BeforeTransfer Logic address")
  .addParam("enumerableGetter", "EnumerableGetter Logic address")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const erc721 = await deploy(ethers, "ERC721Enumerable", 
        taskArguments.extend, 
        taskArguments.approve, 
        taskArguments.getter, 
        taskArguments.onReceive, 
        taskArguments.transfer,
        taskArguments.beforeTransfer,
        taskArguments.enumerableGetter
    );
    console.log("ERC721Enumerable deployed to: ", erc721.address);
  });
