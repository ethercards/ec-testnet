const { ZERO_ADDRESS, ROLE, Data } = require('../tests/helpers/common');
const hre = require("hardhat");

async function main() {

    let NFTToolboxArtifacts;
    let data, nftOne;

    const accounts = await ethers.getSigners();
    console.log("    Deployer        ", accounts[0].address);

    data = new Data();

    const EC721Artifacts = await ethers.getContractFactory("NFTToolbox");
    EC721 = await EC721Artifacts.deploy();
    await EC721.deployed();
    console.log("    RinkebyEC:      ", EC721.address);

    const tx = await EC721["batchMint(uint256[],address)"]([0,1,2,3,4,5,6,7,8,9], accounts[0].address);
    await tx.wait(8);

    // npx hardhat verify --network rinkeby --contract contracts/NFTToolbox.sol:NFTToolbox "0xAAD4475343f5150E33d6194270f04e7e5968A2f8"
    // npx hardhat verify --network sepolia --contract contracts/NFTToolbox.sol:NFTToolbox "0xF1D6A8E031740efE05975162e9C6908aA273D593"
    await hre.run("verify:verify", {
        contract: "contracts/NFTToolbox.sol:NFTToolbox",
        address: EC721.address,
        constructorArguments: []
    });
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });