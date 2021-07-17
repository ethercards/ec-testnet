const { ZERO_ADDRESS, ROLE, Data } = require('./helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
const { expect } = chai;

// make sure to have ethers.js 5.X required, else this will fail!
const BigNumber = ethers.BigNumber;


describe("test", function () {

    let data: any, owner: any, controller: any, testingAccount1: any, testingAccount2: any;
    let EC721: any;

    before(async () => {

        const accounts = await ethers.getSigners();

        data = new Data();
        await data.init();

        owner = data.deployerSigner;
        controller = data.user1Signer;
        testingAccount1 = data.user2Signer;
        testingAccount2 = data.user3Signer;

        const EC721Artifacts = await ethers.getContractFactory("NFTToolbox");
        EC721 = await EC721Artifacts.deploy();
        await EC721.deployed();
        console.log("    RinkebyEC:      ", EC721.address);

    });

    it("takeTokenIdAndGiveTo works", async function () {

        await EC721["mint(uint256)"](5);
        await EC721["safeTransferFrom(address,address,uint256)"](owner.address, testingAccount1.address, 5);

        await EC721["mint(uint256)"](50);
        await EC721["safeTransferFrom(address,address,uint256)"](owner.address, testingAccount1.address, 50);

        let ownerAddr = await EC721.ownerOf(5);
        expect(ownerAddr).to.be.equal(testingAccount1.address);

        await EC721["takeTokenIdAndGiveTo(uint256,address)"](5, owner.address);

        ownerAddr = await EC721.ownerOf(5);
        expect(ownerAddr).to.be.equal(owner.address);
        
    });

    it("tokenURI works", async function () {
        const URI = await EC721.tokenURI(5);
        console.log("URI", URI);
    });

});