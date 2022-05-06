import { ethers } from "ethers";
import { ethers as hreEthers, waffle } from "hardhat";

const chai = require("chai");
const { solidity } = waffle;
chai.use(solidity);
const { expect, assert } = chai;

module.exports = {
    getExtendedContractWithInterface: async (address: string, contractInterface: string) => {
        const LogicInterface = await hreEthers.getContractFactory(contractInterface);
        return (await LogicInterface.attach(address));
    },

    checkExtensions: async (contract: ethers.Contract, expectedInterfaceIds: string[], expectedContractAddresses: string[]) => {
        expect(await contract.callStatic.getExtensions()).to.deep.equal(expectedInterfaceIds);
        expect(await contract.callStatic.getExtensionAddresses()).to.deep.equal(expectedContractAddresses);
    }
}