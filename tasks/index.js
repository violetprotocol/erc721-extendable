const register = require("./register-logic");
const call = require("./call");
const callApp = require("./call-app");
const extend = require("./extend")
const getExtensions = require("./extend-getExtensionAddresses")
const deploy = require("./deploy")
const deployApp = require("./deploy-app")
const deployFactory = require("./deploy-factory")
const deploydeploy = require("./deploy-deploy")
const registerCredential = require("./register-credential")
const factoryGetInterfaceIds = require("./factory-getInterfaceIds")
const factoryGetContracts = require("./factory-getContracts")
const factoryDeploy = require("./factory-deployCredential")
const replace = require("./replace")
const accounts = require("./accounts");

module.exports = { accounts, extend, getExtensions, replace, deploy, deploydeploy, deployApp, deployFactory, register, registerCredential, call, callApp, factoryGetInterfaceIds, factoryGetContracts, factoryDeploy };
