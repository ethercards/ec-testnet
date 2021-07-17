const { ZERO_ADDRESS, ROLE, Data } = require('./helpers/common');
const { expect } = require("chai");
const ecutils = require("ec-util");
const ecForge = new ecutils.Forge();

describe("EtherCards - Forge", function () {

  let NFTToolboxArtifacts, TraitRegistryArtifacts;
  let data, nftOne, nftTwo, nftThree, TraitRegistryInstance, testingAccount1, testingAccount2;

  before(async function () {

    // console.log("ethers", ethers.utils)
    // console.log("accounts", accounts)
    // console.log("ethers", ethers.utils.BigNumber)

    data = new Data();
    await data.init();

    testingAccount1 = data.user1Signer;
    testingAccount2 = data.user2Signer;
    vaultSigner = data.user8Signer;

    NFTToolboxArtifacts = await ethers.getContractFactory("NFTToolbox");
    nftOne = await NFTToolboxArtifacts.deploy();
    await nftOne.deployed();
    console.log("    NFT Toolbox:             ", nftOne.address);

    ECRegistryArtifacts = await ethers.getContractFactory("ECRegistryMock");
    ECRegistryMockInstance = await ECRegistryArtifacts.deploy();
    await ECRegistryMockInstance.deployed();
    console.log("    ECRegistryMock:          ", ECRegistryMockInstance.address);

    const AccidentalCollaborationTraitId = 0;
    AccidentalCollaborationMockArtifacts = await ethers.getContractFactory("AccidentalCollaborationMock");
    AccidentalCollaborationMockInstance = await AccidentalCollaborationMockArtifacts.deploy(
      ECRegistryMockInstance.address,
      AccidentalCollaborationTraitId
    );
    await AccidentalCollaborationMockInstance.deployed();
    console.log("    AccidentalCollaboration: ", AccidentalCollaborationMockInstance.address);
    
    // set implementer
    tx = await ECRegistryMockInstance.setImplementer(AccidentalCollaborationTraitId, AccidentalCollaborationMockInstance.address);
    tx.wait();

    // deploy EtherCardsForge contract
    EtherCardsForgeArtifacts = await ethers.getContractFactory("EtherCardsForge");
    EtherCardsForgeInstance = await EtherCardsForgeArtifacts.deploy(nftOne.address, ECRegistryMockInstance.address, vaultSigner.address);

    await EtherCardsForgeInstance.deployed();
    console.log("    EtherCardsForge:         ", EtherCardsForgeInstance.address);

    

    // set Forge Protector ids in Forge.
    const tokenIds = [
      { id: 11, trait:0, mode: true },
      { id: 15, trait:0, mode: true },
      { id: 2552, trait:0, mode: true },
      { id: 2553, trait:0, mode: true },
      { id: 2554, trait:0, mode: true },
      { id: 2555, trait:0, mode: true },
      { id: 2556, trait:0, mode: true },
      { id: 2557, trait:0, mode: true },
      { id: 2558, trait:0, mode: true },
      { id: 2559, trait:0, mode: true },
    ];

    for (let i = 5010; i < 7500; i++) {
      tokenIds.push(
        { id: i, trait:0, mode: true },
      );
    }

    // 6.7 m gas for 300 items
    const idsPerTxn = 300;
    const txnCount = Math.ceil(tokenIds.length / idsPerTxn);
    const chunks = data.chunk(tokenIds, idsPerTxn);

    for (let i = 0; i < chunks.length; i++) {
      // make arrays
      let traitIds = [];
      let tokenIds = [];
      let modes = [];

      for (let j = 0; j < chunks[i].length; j++) {
        traitIds.push(chunks[i][j].trait);
        tokenIds.push(chunks[i][j].id);
        modes.push(chunks[i][j].mode);
        
      }
      const tx = await ECRegistryMockInstance.setTraitOnMultiple(traitIds, tokenIds, modes);
      await tx.wait();
    }

    // owner mints some tokens
    for (let i = 0; i < 20; i++) {
      let minttx = await nftOne.mint("url" + i);
      await minttx.wait();
    }

    const dstTokenId = 11;
    const srcTokenId = 12;

    const encodedLayerTransfer = ecForge.encodeLayerTransfer(dstTokenId, srcTokenId, true, false, false, true, true);

    // send source token id to forge along with the data about which layers to transfer
    // const tx = await nftOne["safeTransferFrom(address,address,uint256,bytes)"](data.deployerSigner.address, EtherCardsForgeInstance.address, srcTokenId, encodedLayerTransfer);
    // const txReceit = await tx.wait();
  });

  describe("Forge Deployment", function () {

    let TestForgeInstance, encodedLayerTransfer, nftTest;
    const dstTokenId = 11;
    const srcTokenId = 12;

    before(async function () {

      // deploy NFT
      nftTest = await NFTToolboxArtifacts.deploy();
      await nftTest.deployed();

      // owner mints some tokens
      for (let i = 0; i < 20; i++) {
        let minttx = await nftTest.mint("url" + i);
        await minttx.wait();
      }

      encodedLayerTransfer = ecForge.encodeLayerTransfer(dstTokenId, srcTokenId, true, false, false, true, true);

      // deploy EtherCardsForge contract
      TestForgeInstance = await EtherCardsForgeArtifacts.deploy(nftTest.address, ECRegistryMockInstance.address, vaultSigner.address);
      await TestForgeInstance.deployed();
      console.log("    TestForgeInstance:       ", TestForgeInstance.address);

      // set owner as well so we can test stuff
      tx = await ECRegistryMockInstance.setAddressAccess(data.deployerSigner.address, 0, true);
      await tx.wait();
      tx = await ECRegistryMockInstance.setAddressAccess(TestForgeInstance.address, 0, true);
      await tx.wait();

      tx = await ECRegistryMockInstance.setAddressAccess(TestForgeInstance.address, 0, true);
      await tx.wait();
      tx = await ECRegistryMockInstance.setAddressAccess(TestForgeInstance.address, 9, true);
      await tx.wait();

    });


    describe("lock()", function () {

      it("locks if called by owner", async function () {
        expect(await TestForgeInstance._locked()).to.be.equal(false);
        await TestForgeInstance.lock(true);
        expect(await TestForgeInstance._locked()).to.be.equal(true);
        await TestForgeInstance.lock(false);
        expect(await TestForgeInstance._locked()).to.be.equal(false);
      });

      it("reverts if non-owner calls", async function () {
        expect(await TestForgeInstance._locked()).to.be.equal(false);
        await data.assertInvalidOpcode(async () => {
          await TestForgeInstance.connect(testingAccount2).lock(true);
        }, "Ownable: caller is not the owner")
      });
    });

    describe("onERC721Received()", function () {


      it("reverts if Forge is locked", async function () {
        await TestForgeInstance.lock(true);
        expect(await TestForgeInstance._locked()).to.be.equal(true);

        const newsrcTokenId = 13;
        encodedLayerTransfer = ecForge.encodeLayerTransfer(dstTokenId, newsrcTokenId, true, false, false, true, true);

        // send source token id to forge along with the data about which layers to transfer
        await data.assertInvalidOpcode(async () => {
          const tx = await nftTest["safeTransferFrom(address,address,uint256,bytes)"](data.deployerSigner.address, TestForgeInstance.address, newsrcTokenId, encodedLayerTransfer);
          const txReceit = await tx.wait();
        }, "Must not be locked")

        await TestForgeInstance.lock(false);
        expect(await TestForgeInstance._locked()).to.be.equal(false);

      });

      it("Owner can set layer values", async function () {
        const newsrcTokenId = 14;

        let tx = await AccidentalCollaborationMockInstance.setValue(dstTokenId, [01,02,03,04,05]);
        tx.wait();
        tx = await AccidentalCollaborationMockInstance.setValue(newsrcTokenId, [06,07,08,09,10]);
        tx.wait();

        let layerData = await AccidentalCollaborationMockInstance.getValue(dstTokenId);
        console.log(dstTokenId, layerData);
        layerData = await AccidentalCollaborationMockInstance.getValue(newsrcTokenId);
        console.log(newsrcTokenId, layerData);
      });

      it("A number of 7 events get emitted on successfull operation", async function () {

        const newsrcTokenId = 14;

        encodedLayerTransfer = ecForge.encodeLayerTransfer(dstTokenId, newsrcTokenId, true, true, true, true, true);
        
        tx = await nftTest["safeTransferFrom(address,address,uint256,bytes)"](data.deployerSigner.address, TestForgeInstance.address, newsrcTokenId, encodedLayerTransfer);
        txReceit = await tx.wait();
        expect(txReceit.logs.length).to.be.equal(7);


        let layerData = await AccidentalCollaborationMockInstance.getValue(dstTokenId);
        console.log(dstTokenId, layerData);
        layerData = await AccidentalCollaborationMockInstance.getValue(newsrcTokenId);
        console.log(newsrcTokenId, layerData);

      });

      it("Layer values", async function () {

        const newsrcTokenId = 15;

        let tx = await AccidentalCollaborationMockInstance.setValue(dstTokenId, [01,02,03,04,05]);
          tx.wait();
        tx = await AccidentalCollaborationMockInstance.setValue(newsrcTokenId, [16,17,18,19,20]);
        tx.wait();

        let origlayerData1 = await AccidentalCollaborationMockInstance.getValue(dstTokenId);
        let origlayerData2 = await AccidentalCollaborationMockInstance.getValue(newsrcTokenId);
        console.log(dstTokenId, origlayerData1);
        console.log(newsrcTokenId, origlayerData2);


        encodedLayerTransfer = ecForge.encodeLayerTransfer(dstTokenId, newsrcTokenId, true, false, true, false, true);
        
        tx = await nftTest["safeTransferFrom(address,address,uint256,bytes)"](data.deployerSigner.address, TestForgeInstance.address, newsrcTokenId, encodedLayerTransfer);
        txReceit = await tx.wait();
        expect(txReceit.logs.length).to.be.equal(7);


        let afterlayerData1 = await AccidentalCollaborationMockInstance.getValue(dstTokenId);
        let afterlayerData2 = await AccidentalCollaborationMockInstance.getValue(newsrcTokenId);
        console.log(dstTokenId, afterlayerData1);
        console.log(newsrcTokenId, afterlayerData2);

        // layer 1 swaps between src and dst
        expect(origlayerData1[0]).to.be.equal(afterlayerData2[0]);
        expect(origlayerData2[0]).to.be.equal(afterlayerData1[0]);

        // layer 2 does not change
        expect(origlayerData1[1]).to.be.equal(afterlayerData1[1]);
        expect(origlayerData2[1]).to.be.equal(afterlayerData2[1]);

        // layer 3 swaps between src and dst
        expect(origlayerData1[2]).to.be.equal(afterlayerData2[2]);
        expect(origlayerData2[2]).to.be.equal(afterlayerData1[2]);
        
        // layer 4 does not change
        expect(origlayerData1[3]).to.be.equal(afterlayerData1[3]);
        expect(origlayerData2[3]).to.be.equal(afterlayerData2[3]);

        // layer 5 swaps between src and dst
        expect(origlayerData1[4]).to.be.equal(afterlayerData2[4]);
        expect(origlayerData2[4]).to.be.equal(afterlayerData1[4]);

      });



    });


    // describe("Different tokens", function () {

    //   let TestForgeInstance, encodedLayerTransfer, nftTest;
    //   const dstTokenId = 11;
    //   const srcTokenId = 12;

    //   before(async function () {

    //     nftTest = await NFTToolboxArtifacts.deploy();
    //     nftTest2 = await NFTToolboxArtifacts.deploy();
    //     await nftTest.deployed();
    //     await nftTest2.deployed();

    //     // owner mints some tokens
    //     for (let i = 0; i < 20; i++) {
    //       let minttx = await nftTest.mint("url" + i);
    //       await minttx.wait();
    //     }

    //     for (let i = 0; i < 20; i++) {
    //       let minttx = await nftTest2.mint("url" + i);
    //       await minttx.wait();
    //     }

    //     // deploy EtherCardsForge contract
    //     TestForgeInstance = await EtherCardsForgeArtifacts.deploy(nftTest.address, ECRegistryMockInstance.address, vaultSigner.address);
    //     await TestForgeInstance.deployed();

    //   });


    //   it("Reverts if different NFT is sent to the forge address", async function () {

    //     encodedLayerTransfer = ecForge.encodeLayerTransfer(dstTokenId, srcTokenId, true, false, false, true, true);
    //     let tx = await nftTest["safeTransferFrom(address,address,uint256,bytes)"](data.deployerSigner.address, TestForgeInstance.address, srcTokenId, encodedLayerTransfer);

    //     // send source token id to forge along with the data about which layers to transfer
    //     await data.assertInvalidOpcode(async () => {
    //       const tx = await nftTest2["safeTransferFrom(address,address,uint256,bytes)"](data.deployerSigner.address, TestForgeInstance.address, srcTokenId, encodedLayerTransfer);
    //     }, "Must be NFTContract address")

    //   });

    //   it("Reverts if destination token is not owned by caller", async function () {

    //     const newdstTokenId = 15;
    //     const newsrcTokenId = 14;
    //     // send token to someone else
    //     let tx = await nftTest["safeTransferFrom(address,address,uint256)"](data.deployerSigner.address, testingAccount2.address, newdstTokenId);
        
    //     // try to send layers to old token you just sent
    //     encodedLayerTransfer = ecForge.encodeLayerTransfer(newdstTokenId, newsrcTokenId, true, false, false, true, true);
        
    //     await data.assertInvalidOpcode(async () => {
    //       const tx = await nftTest["safeTransferFrom(address,address,uint256,bytes)"](data.deployerSigner.address, TestForgeInstance.address, newsrcTokenId, encodedLayerTransfer);
    //     }, "Destination token must be owned by the same address as source token")

    //   });

    // });

  });

  // describe("blackhole prevention", function () {



  //   describe("721 non-safe transfers", function () {
  //     let testTokenId = 5;
  //     before(async function () {
  //       NFTToolboxArtifacts = await ethers.getContractFactory("NFTToolbox");
  //       nftTwo = await NFTToolboxArtifacts.deploy();
  //       await nftTwo.deployed();

  //       // owner mints some tokens
  //       for (let i = 0; i < 20; i++) {
  //         let minttx = await nftTwo.mint("url" + i);
  //         await minttx.wait();
  //       }

  //       // transfer a token to the forge
  //       await nftTwo["transferFrom(address,address,uint256)"](data.deployerSigner.address, EtherCardsForgeInstance.address, testTokenId);

  //       let ownerOfToken = await nftTwo["ownerOf(uint256)"](testTokenId);
  //       expect(ownerOfToken).to.be.equal(EtherCardsForgeInstance.address);

  //     });

  //     it("retrieve721() - Retrieves an NFT sent to the Forge by mistake and sends it to forge owner", async function () {
  //       await EtherCardsForgeInstance.retrieve721(nftTwo.address, testTokenId);
  //       let newOwnerOfToken = await nftTwo["ownerOf(uint256)"](testTokenId);
  //       expect(newOwnerOfToken).to.be.equal(data.deployerSigner.address);
  //     });

  //     it("retrieve721() - Reverts if called by non-owner", async function () {
  //       await data.assertInvalidOpcode(async () => {
  //         await EtherCardsForgeInstance.connect(testingAccount2).retrieve721(nftTwo.address, testTokenId);
  //       }, "Ownable: caller is not the owner")
  //     });

  //   });

  //   describe("ERC20 non-safe transfers", function () {
  //     let erc20, testAmount = ethers.BigNumber.from(5);
  //     before(async function () {
  //       ERC20ToolboxArtifacts = await ethers.getContractFactory("ERC20Toolbox");
  //       erc20 = await ERC20ToolboxArtifacts.deploy();
  //       await erc20.deployed();

  //     });

  //     it("retrieveERC20() - Retrieves an amount of ERC20 tokens sent to the Forge by mistake and sends them to forge owner", async function () {

  //       let initialBalance = await erc20["balanceOf(address)"](data.deployerSigner.address);
  //       await erc20["transfer(address,uint256)"](EtherCardsForgeInstance.address, testAmount);
  //       let afterBalance = await erc20["balanceOf(address)"](data.deployerSigner.address);
  //       expect(afterBalance).to.be.equal(initialBalance.sub(testAmount));

  //       // forge balance
  //       let forgeAfterBalance = await erc20["balanceOf(address)"](EtherCardsForgeInstance.address);
  //       expect(forgeAfterBalance).to.be.equal(testAmount);

  //       // retrieve tokens
  //       await EtherCardsForgeInstance.retrieveERC20(erc20.address, testAmount);

  //       forgeAfterBalance = await erc20["balanceOf(address)"](EtherCardsForgeInstance.address);
  //       expect(forgeAfterBalance).to.be.equal(0);

  //       afterBalance = await erc20["balanceOf(address)"](data.deployerSigner.address);
  //       expect(afterBalance).to.be.equal(initialBalance);

  //     });

  //     it("retrieveERC20() - Reverts if called by non-owner", async function () {
  //       await data.assertInvalidOpcode(async () => {
  //         await EtherCardsForgeInstance.connect(testingAccount2).retrieveERC20(erc20.address, testAmount);
  //       }, "Ownable: caller is not the owner")
  //     });

  //   });


  //   // deploy erc20 token ( balanceOf )
  //   // transfer an erc20 amount to forge using transfer, test forge balanceOf(forgeaddress) to get amount, then retrieve it using retrieveERC20, test for amount balanceOf(forgeaddress)  is 0

  // });

  // describe("transferOwnership()", function () {
  //   it("owner can transfer contract ownership", async function () {
  //     const newOwner = "0x5147c5C1Cb5b5D3f56186C37a4bcFBb3Cd0bD5A7";
  //     const owner = await EtherCardsForgeInstance.owner();
  //     expect(owner).to.be.equal(data.deployerSigner.address);
  //     let tx = await EtherCardsForgeInstance.transferOwnership(newOwner);
  //     tx.wait();
  //     const afterOwner = await EtherCardsForgeInstance.owner();
  //     expect(afterOwner).to.be.equal(newOwner);
  //   });
  // });

});