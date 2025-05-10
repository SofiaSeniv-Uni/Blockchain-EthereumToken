const TestToken = artifacts.require("TestToken");

module.exports = function (deployer) {
  const initialSupply = web3.utils.toWei("1000", "ether");
  deployer.deploy(TestToken, initialSupply);
};
