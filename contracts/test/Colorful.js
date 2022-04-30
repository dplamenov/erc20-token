const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Colorful", function () {
  let colorful;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async () => {
    const Colorful = await ethers.getContractFactory("Colorful");
    colorful = await Colorful.deploy();
    await colorful.deployed();
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("Name should be Colorful", async function () {
    expect(await colorful.name()).to.be.eq("Colorful");
  });

  it("Symbol should be COL", async function () {
    expect(await colorful.symbol()).to.be.eq("COL");
  });

  it("Total supply should be 18000000", async function () {
    expect(await colorful.totalSupply()).to.be.eq(18000000);
  });

  it("Decimals should be 18", async function () {
    expect(await colorful.decimals()).to.be.eq(18);
  });

  it("Owner should have all of supply", async function () {
    expect(await colorful.balanceOf(owner.address)).to.be.eq(18000000);
  });
});
