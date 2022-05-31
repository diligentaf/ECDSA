const Token = artifacts.require("Token");
const { expect } = require("chai");

describe("Token contract", function () {
  let TokenContract;
  let Token;
  let creator = "0x490473c8Da71525C46b156c4e5bcc70c81d40A08";
  let owner = "0x3376869241ee69228587ab4BB9231fBDA8EB79D4";
  let addr1;
  let addr2;
  let addr3;
  let addrs;
  let ts;
  let link1;
  let link2;
  let link3;
  // drop
  let num = 10;
  let cost = 20000;
  let costPerNum;
  let links;
  let randomString;

  before(async function () {
    // generating random string
    var randomString = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 30; i++) {
      randomString += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }

    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
    TokenContract = await ethers.getContractFactory("Token");
    DropContract = await ethers.getContractFactory("Drop");

    Token = await TokenContract.connect(addr1).deploy();
    // Drop = await DropContract.deploy(Token.address, addr1.address, cost, num, "campaignID1", {gasPrice: 50000000000000000});
    Drop = await DropContract.deploy(Token.address, addr1.address, cost, num, "campaignID1", 1, randomString);
    // 50 gwei
    // gasPrice: 50000000000

  });

  it("checking campgain creator's address", async function () {
    creator = await Drop.creator();
    expect(creator).to.equal(addr1.address);
  });

  it("checking cost, num, costPerNum, creator, validator", async function () {
    // const temp = await Drop.verifyLinkdropSignerSignature("0x0C3888b0Ddc8D63FCa479A68A69b7F68673BfA2D", 100, 10);

    // for (var i = 0; i < 100; i++) {
    //   temp = await Drop.verifyLinkdropSignerSignature(i, "0x0C3888b0Ddc8D63FCa479A68A69b7F68673BfA2D", 100, 10);
    //   console.log(temp)
    // }

    expect(await Drop.cost()).to.equal(cost);
    expect(await Drop.num()).to.equal(num)
    costPerNum = await Drop.costPerNum()
    expect(await costPerNum.toNumber()).to.equal(Math.floor(cost / num))
    expect(await Drop.creator()).to.equal(addr1.address)
    expect(await Drop.validator()).to.equal(owner.address)
  });

  it("funding contract", async function () {
    //checking balance
    const addr1address = await Token.balanceOf(addr1.address);
    expect(await Token.totalSupply()).to.equal(addr1address);

    //chekcing allowance
    await Token.connect(addr1).approve(Drop.address, cost)
    const allowance = await Token.allowance(addr1.address, Drop.address)
    expect(await allowance.toNumber()).to.equal(cost);
    expect(await Token.totalSupply()).to.equal(addr1address);
    let DropBalance = await Token.balanceOf(Drop.address);
    expect(DropBalance.toNumber()).to.equal(0);

  });

  it("transfer fund from addr1(token creator) to contract", async function () {
    // fund contract
    await Token.connect(addr1).transfer(Drop.address, cost)
    const contractBalance = await Token.balanceOf(Drop.address);
    expect(await contractBalance.toNumber()).to.equal(cost);

    // transfer from contract to addr2
    // await Drop.connect(owner).airdrop(addr2.address)
    // dropped = await Token.balanceOf(addr2.address);
    // expect(await dropped.toNumber()).to.equal(costPerNum);
  });

  // it("create multiple links", async function () {
  //   web3.eth.getBlock("latest", false, (error, result) => {
  //     console.log(result.gasLimit)
  //   });
  //   await Drop.createMultipleLinks({ gasPrice: BigInt(5000000000000000000) });
  //   web3.eth.getBlock("latest", false, (error, result) => {
  //     console.log(result.gasLimit)
  //   });
  // });

  it("addLinks", async function () {
    for (var i = 0; i < num; i++) {
      await Drop.connect(owner).addLink()
    }
  });

  it("getLinks only creator", async function () {
    links = await Drop.connect(addr1.address).getLinks()
  });

  it("airdropping to addr3", async function () {
    await Drop.airdrop(4, links[4].balance.toBigInt(), addr3.address)
    links = await Drop.connect(addr1.address).getLinks()
    expect(links[4].balance).to.equal(0)
    expect(links[4].pubwallet).to.equal(addr3.address)
    expect(links[4].taken).to.equal(true)
    // airdropped to addr3
    expect(await Token.balanceOf(addr3.address)).to.equal(costPerNum)
  });

  it("checking keccak256", async function () {
    temp = await Drop.verifyLinkdropSignerSignature(1, "0x0C3888b0Ddc8D63FCa479A68A69b7F68673BfA2D", 100, 10);
    console.log(temp)
    temp = await Drop.verifyLinkdropSignerSignature(1, "0x0C3888b0Ddc8D63FCa479A68A69b7F68673BfA2D", 100, 10);
    console.log(temp)
    // console.log(await Drop.randomString())
    // temp = await Drop.verifyLinkdropSignerSignature2(1, "0x0C3888b0Ddc8D63FCa479A68A69b7F68673BfA2D", 100, 10);
    // console.log(temp)
    // temp = await Drop.verifyLinkdropSignerSignature2(1, "0x0C3888b0Ddc8D63FCa479A68A69b7F68673BfA2D", 100, 10);
    // console.log(temp)
  });

  // describe("checking random", function () {
  //   it("checking random number", async function () {
  //     // tx = await Drop.random(1999);
  //     // receipt = await tx.wait()
  //     // gasUsed = receipt.gasUsed.toBigInt()
  //     // rn = await Drop.randomNumber();
  //     // console.log(rn)

  //     // tx = await Drop.random(1999);
  //     // receipt = await tx.wait()
  //     // gasUsed = receipt.gasUsed.toBigInt()
  //     // rn = await Drop.randomNumber();
  //     // console.log(rn)

  //     // for(var i = 0; i < 100; i++) {
  //     // tx = await Drop.random("yo", i, "0x0C3888b0Ddc8D63FCa479A68A69b7F68673BfA2D");
  //     // console.log(tx)
  //     // }
  //   });
  // })

});