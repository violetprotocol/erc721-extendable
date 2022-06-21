const deployExtendable = require("./deploy/extendable");
const deployExtension = require("./deploy/extension");
const deployBase = require("./deploy/erc721");
const deployMetadata = require("./deploy/erc721Metadata");
const deployEnumerable = require("./deploy/erc721Enumerable");

const extend = require("./extend");
const accounts = require("./accounts");

export { accounts, deployExtendable, deployExtension, extend, deployBase, deployMetadata, deployEnumerable };
