import { ContractTransaction } from "ethers";
import { waffle } from "hardhat";
import chai from "chai";

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
