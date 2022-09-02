import { BigNumber } from "ethers";
import { MODULE } from "../setup";
import { shouldBehaveLikeERC721Approve } from "./ERC721.approve.behaviour";
import { shouldBehaveLikeERC721Balance } from "./ERC721.balance.behaviour";
import { shouldBehaveLikeERC721Burn } from "./ERC721.burn.behaviour";
import { shouldBehaveLikeERC721Mint } from "./ERC721.mint.behaviour";
import { shouldBehaveLikeERC721Transfer } from "./ERC721.transfer.behaviour";

const shouldBehaveLikeERC721 = (module: MODULE) => {
  shouldBehaveLikeERC721Mint(module);
  shouldBehaveLikeERC721Burn(module);
  shouldBehaveLikeERC721Approve(module);
  shouldBehaveLikeERC721Balance(module);
  shouldBehaveLikeERC721Transfer(module);
};

export const Error = {
  Panic: 3,
  RevertWithoutMessage: 2,
  RevertWithMessage: 1,
  None: 0,
};

export const RECEIVER_MAGIC_VALUE = "0x150b7a02";

export const firstTokenId = BigNumber.from(5042);
export const secondTokenId = BigNumber.from(79217);
export const thirdTokenId = BigNumber.from(123716236);
export const fourthTokenId = BigNumber.from(4);
export const nonExistentTokenId = BigNumber.from(182738971238);

export { shouldBehaveLikeERC721 };
