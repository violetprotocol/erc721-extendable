const shell = require("shelljs");

module.exports = {
  istanbulReporter: ["html", "lcov", "text", "clover"],
  providerOptions: {
    mnemonic: process.env.MNEMONIC,
  },
  skipFiles: ["test"],
};
