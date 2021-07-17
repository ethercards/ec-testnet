const forgeProtectedCards = require("../data/forgeProtectedCards.json");

const etherCardsContractAddress = '0x97ca7fe0b0288f5eb85f386fed876618fb9b8ab8';
const forgeVaultContractAddress = '0x6abC4684f104AEf2e3B37E2E9E8018BFcD30c0d8';

const ECRegistryArtifacts = require("./abi/ECRegistry.json");


const { ZERO_ADDRESS, ROLE, Data } = require('../tests/helpers/common');

async function main() {

    const data = new Data();
    const accounts = await ethers.getSigners();
    console.log("Deployer", accounts[0].address);

    const ECRegistry = new ethers.Contract("0x26af8a1438308c52ec02b52feefff9236248913a", ECRegistryArtifacts.abi, accounts[0]);

    NFTToolboxArtifacts = await ethers.getContractFactory("NFTToolbox");
    nftOne = await NFTToolboxArtifacts.deploy();
    await nftOne.deployed();
    console.log("    NFT Toolbox:             ", nftOne.address);

    const NFTContractAddress = nftOne.address;

    // deploy EtherCardsForge contract
    let EtherCardsForgeArtifacts = await ethers.getContractFactory("EtherCardsForge");

    let EtherCardsForgeDeployedInstance = await EtherCardsForgeArtifacts.deploy(
        NFTContractAddress,
        ECRegistry.address,
        forgeVaultContractAddress
    );
    await EtherCardsForgeDeployedInstance.deployed();

    let txn = await EtherCardsForgeDeployedInstance.provider.getTransactionReceipt(EtherCardsForgeDeployedInstance.deployTransaction.hash);


    await ECRegistry.setTraitControllerAccess(EtherCardsForgeDeployedInstance.address, 0, true);
    await ECRegistry.setTraitControllerAccess(EtherCardsForgeDeployedInstance.address, 9, true);


    console.log("    Configuration:");
    console.log( await EtherCardsForgeDeployedInstance.owner() );
    console.log("       EtherCards contract address:", NFTContractAddress);
    console.log("       EtherCards VAULT address:   ", forgeVaultContractAddress);
    console.log("");
    console.log("    Step 1: Deploy Contract")
    console.log("       - hash:                ", EtherCardsForgeDeployedInstance.deployTransaction.hash);
    console.log("       - EtherCardsForge:     ", EtherCardsForgeDeployedInstance.address);
    console.log("");

    let EtherCardsForgeInstance = new ethers.Contract(EtherCardsForgeDeployedInstance.address, EtherCardsForgeArtifacts.interface, accounts[0]);

    // npx hardhat verify --network mainnet 0x119Cd999356C59B5E4E49a7993A842E20b20ECe8 "0x97ca7fe0b0288f5eb85f386fed876618fb9b8ab8" "0x6abC4684f104AEf2e3B37E2E9E8018BFcD30c0d8"

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });