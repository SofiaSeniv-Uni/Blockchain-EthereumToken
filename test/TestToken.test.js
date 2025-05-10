const TestToken = artifacts.require("TestToken");
const { expect } = require("chai");

contract("TestToken", (accounts) => {
  const [deployer, recipient, anotherAccount] = accounts;
  const initialSupply = web3.utils.toWei("1000", "ether");

  let token;

  beforeEach(async () => {
    token = await TestToken.new(initialSupply, { from: deployer });
  });

  it("should have correct name and symbol", async () => {
    const name = await token.name();
    const symbol = await token.symbol();
    expect(name).to.equal("TestToken");
    expect(symbol).to.equal("TST");
  });

  it("should assign the total supply to the deployer", async () => {
    const deployerBalance = await token.balanceOf(deployer);
    expect(deployerBalance.toString()).to.equal(initialSupply);
  });

  it("should transfer tokens between accounts", async () => {
    const amount = web3.utils.toWei("100", "ether");

    await token.transfer(recipient, amount, { from: deployer });

    const recipientBalance = await token.balanceOf(recipient);
    expect(recipientBalance.toString()).to.equal(amount);

    const deployerBalance = await token.balanceOf(deployer);
    expect(deployerBalance.toString()).to.equal(
      web3.utils.toWei("900", "ether")
    );
  });

  it("should fail if sender doesn’t have enough balance", async () => {
    const amount = web3.utils.toWei("10", "ether");

    try {
      await token.transfer(deployer, amount, { from: anotherAccount });
      assert.fail("Expected revert not received");
    } catch (err) {
      expect(err.reason || err.message).to.include("transfer amount exceeds balance");
    }
  });

  it("should emit a Transfer event", async () => {
    const amount = web3.utils.toWei("50", "ether");

    const tx = await token.transfer(recipient, amount, { from: deployer });

    const event = tx.logs.find((log) => log.event === "Transfer");
    expect(event).to.exist;
    expect(event.args.from).to.equal(deployer);
    expect(event.args.to).to.equal(recipient);
    expect(event.args.value.toString()).to.equal(amount);
  });
});
