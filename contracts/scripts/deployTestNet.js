const forgeProtectedCards = require("../data/forgeProtectedCards.json");

//const etherCardsContractAddress = '0xfe7EbC878B7106EF813e32452Ba14Fe99851e311';
const forgeVaultContractAddress = '0x1D2E5B42487f5C5A2c4970B80d3C5AaD1B6ec8D0';

const { ZERO_ADDRESS, ROLE, Data } = require('../tests/helpers/common');

async function main() {

    let NFTToolboxArtifacts;
    let data, nftOne;

    data = new Data();
    // await data.init();

    NFTToolboxArtifacts = await ethers.getContractFactory("NFTToolbox");
    nftOne = await NFTToolboxArtifacts.deploy();
    await nftOne.deployed();
    console.log("    NFT Toolbox:             ", nftOne.address);

    // deploy EtherCardsForge contract
    EtherCardsForgeArtifacts = await ethers.getContractFactory("EtherCardsForge");
    EtherCardsForgeInstance = await EtherCardsForgeArtifacts.deploy(nftOne.address, forgeVaultContractAddress);
    await EtherCardsForgeInstance.deployed();
    console.log("    EtherCardsForgeDemo:     ", EtherCardsForgeInstance.address);


    // 6.7 m gas for 300 items
    const idsPerTxn = 300;
    const txnCount = Math.ceil(forgeProtectedCards.length / idsPerTxn);
    console.log(txnCount, "transactions will cover", forgeProtectedCards.length, "in chunks of", idsPerTxn)

    const chunks = data.chunk(forgeProtectedCards, idsPerTxn);
    // console.log(chunks);

    for (let i = 0; i < chunks.length; i++) {
        const tx = await EtherCardsForgeInstance.setForgeProtection(chunks[i]);
        await tx.wait();
    }
    // once we finish adding Forge Protection ids, initialize the contract
    await EtherCardsForgeInstance.setInitialized();

    // for testing mint tokens
    for (let i = 0; i < 100; i++) {
        let minttx = await nftOne.mint("url" + i);
        // await minttx.wait();
    }

    console.log("For testing use ids -> ", chunks[0]);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });