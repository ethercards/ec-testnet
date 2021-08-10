const { ZERO_ADDRESS, ROLE, Data } = require('./helpers/common');
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
const { expect } = chai;

// make sure to have ethers.js 5.X required, else this will fail!
const BigNumber = ethers.BigNumber;


describe("tokenUsed", function () {

    let data: any, owner: any, controller: any, testingAccount1: any, testingAccount2: any;
    let EC721Artifacts: any, testContract: any;


    before(async () => {

        const accounts = await ethers.getSigners();

        data = new Data();
        await data.init();

        owner = data.deployerSigner;
        controller = data.user1Signer;
        testingAccount1 = data.user2Signer;
        testingAccount2 = data.user3Signer;

        EC721Artifacts = await ethers.getContractFactory("tokenUsed");
    });

    describe("writing:", function () {

        beforeEach(async () => {
            testContract = await EC721Artifacts.deploy();
            await testContract.deployed();
        });

        it("setUsed 1 token - id 512", async function () {

            let tx = await testContract.setUsed(512);
            let txReceit = await tx.wait();
            console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());
        
        });

        it("setUsed 1 token - id 8543", async function () {

            let tx = await testContract.setUsed(8543);
            let txReceit = await tx.wait();
            console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());
        
        });

        it("setUsedFromAndLength - set 100 tokens as used", async function () {

            let tx = await testContract.setUsedFromAndLength(0, 100);
            let txReceit = await tx.wait();
            console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());
        
        });

        it("setUsedFromAndLength - set 1000 tokens as used", async function () {

            let tx = await testContract.setUsedFromAndLength(0, 1000);
            let txReceit = await tx.wait();
            console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());
        
        });

        it("setData 1024 tokens ( 128 bytes )", async function () {

            let tokenData = [];
            for(let i = 0; i < 128; i++) {
                tokenData.push(255);
            }
            let tx = await testContract.setData(0, tokenData);
            let txReceit = await tx.wait();
            console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());
        
        });

        it("setData 2496 tokens ( 312 bytes )", async function () {

            let tokenData = [];
            for(let i = 0; i < 312; i++) {
                tokenData.push(255);
            }
            let tx = await testContract.setData(0, tokenData);
            let txReceit = await tx.wait();
            console.log("            - Gas:             ", txReceit.cumulativeGasUsed.toString());
        
        });
        
    });

    describe("reading:", function () {

        beforeEach(async () => {
            testContract = await EC721Artifacts.deploy();
            await testContract.deployed();

            let tokenData = [];
            for(let i = 0; i < 256; i++) {
                tokenData.push(255);
            }
            let tx = await testContract.setData(0, tokenData);
            let txReceit = await tx.wait();
            tx = await testContract.setData(256, tokenData);
            txReceit = await tx.wait();
            tx = await testContract.setData(512, tokenData);
            txReceit = await tx.wait();
            tx = await testContract.setData(768, tokenData);
            txReceit = await tx.wait();
        });

        it("isUsed - read 1 token", async function () {
            let tx = await testContract.estimateGas.isUsed(5);
            console.log("            - Gas:             ", tx.toString());
        });

        it("getData - read 8 tokens", async function () {
            let tx = await testContract.estimateGas.getData(0, 8);
            console.log("            - Gas:             ", tx.toString());
        });

        it("getData - read 256 tokens", async function () {
            let tx = await testContract.estimateGas.getData(0, 256);
            console.log("            - Gas:             ", tx.toString());
        });

        it("getData - read 2496 tokens", async function () {
            let tx = await testContract.estimateGas.getData(0, 2496);
            console.log("            - Gas:             ", tx.toString());
        });

        it("getData - read 10000 tokens - 1250 bytes", async function () {
            let tx = await testContract.estimateGas.getData(0, 10000);
            console.log("            - Gas:             ", tx.toString());
        });

    });

    // it("tokenURI works", async function () {
    //     const URI = await EC721.tokenURI(5);
    //     console.log("URI", URI);
    // });

});