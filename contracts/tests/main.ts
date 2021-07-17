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

    let data, owner, controller, testingAccount1, testingAccount2;

    before(async () => {

        const accounts = await ethers.getSigners();


        data = new Data();
        await data.init();

        owner = data.deployerSigner;
        controller = data.user1Signer;
        testingAccount1 = data.user2Signer;
        testingAccount2 = data.user3Signer;

        const EC721Artifacts = await ethers.getContractFactory("NFTToolbox");
        const EC721 = await EC721Artifacts.deploy();
        await EC721.deployed();
        console.log("    RinkebyEC:      ", EC721.address);

        await EC721.mintExactTokenId(5);
        await EC721["safeTransferFrom(address,address,uint256)"](owner.address, testingAccount1.address, 5);

        await EC721.mintExactTokenId(50);
        await EC721["safeTransferFrom(address,address,uint256)"](owner.address, testingAccount1.address, 50);

        let ownerAddr = await EC721.ownerOf(5);
        console.log(ownerAddr, testingAccount1.address)

        await EC721["takeTokenIdAndGiveTo(uint256,address)"](5, owner.address);

        ownerAddr = await EC721.ownerOf(5);
        console.log(ownerAddr, owner.address)

    });

    it("true", async function () {

        expect(true).to.be.equal(true);
        
    });

});