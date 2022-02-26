import { expect } from "chai";
import { ethers } from "hardhat";

// describe("Greeter", function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
//     await greeter.deployed();

//     expect(await greeter.greet()).to.equal("Hello, world!");

//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });

describe("MyNFT", function () {
  it("Shoud mint and transfer an NFT to someone", async function () {
    const TheRoster = await ethers.getContractFactory("TheRoster");
    const theRoster = await TheRoster.deploy();
    await theRoster.deployed();

    const recipient = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
    const metadataURI = "cid/test.png";

    let balance = await theRoster.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await theRoster.payToMint(recipient, metadataURI, {
      value: ethers.utils.parseEther("0.07"),
    });

    await newlyMintedToken.wait();

    balance = await theRoster.balanceOf(recipient);
    expect(balance).to.equal(1);

    expect(await theRoster.isContentOwned(metadataURI)).to.equal(true);
  });
});
