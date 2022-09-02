import { ContractTransaction } from "ethers";
import { ethers, waffle } from "hardhat";
import chai from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  erc165Bytecode,
  erc165DeploymentSalt,
  factoryABI,
  singletonFactoryAddress,
  singletonFactoryDeployer,
  singletonFactoryDeploymentTx,
} from "./constants";

const { solidity } = waffle;
chai.use(solidity);
const { expect } = chai;

export const expectEvent = async (tx: ContractTransaction, eventName: string, params: any) => {
  const receipt = await tx.wait();
  const found = receipt.events?.find(e => e.event == eventName);

  if (found) {
    const decode = found.decode;
    if (decode) {
      const eventParams = decode(found.data, found.topics);

      const paramKeys = Object.keys(params);
      paramKeys.forEach(paramKey => {
        expect(params[paramKey]).to.equal(eventParams[paramKey]);
      });
    }
  }
};

// Extracted from @violetprotocol/extendable/test/utils.js
export const deployERC165Singleton = async (deployer: SignerWithAddress) => {
  await deployer.sendTransaction({ to: singletonFactoryDeployer, value: ethers.utils.parseEther("1") });
  await ethers.provider.sendTransaction(singletonFactoryDeploymentTx);

  const Factory = new ethers.Contract("0x0000000000000000000000000000000000000000", factoryABI, deployer);
  const factory = await Factory.attach(singletonFactoryAddress);
  await factory.deploy(erc165Bytecode, erc165DeploymentSalt, { gasLimit: "0x07A120" });
};
