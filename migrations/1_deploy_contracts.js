const VotingSys = artifacts.require("VotingSys");

module.exports = function (deployer) {
    deployer.deploy(VotingSys);
};