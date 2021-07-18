const { ZERO_ADDRESS, ROLE, Data } = require('../tests/helpers/common');

async function main() {

    let NFTToolboxArtifacts;
    let data, nftOne;

    const accounts = await ethers.getSigners();
    console.log("    Deployer        ", accounts[0].address);

    data = new Data();

    const EC721Artifacts = await ethers.getContractFactory("NFTToolbox");

    const EC721 = new ethers.Contract("0xAAD4475343f5150E33d6194270f04e7e5968A2f8", EC721Artifacts.interface, accounts[0]);
    console.log("    RinkebyEC:      ", EC721.address);

    // await EC721["batchMint(uint256[],address)"]([10,11,12,13,14,100,101,102,103,104,1000,1001,1002,1003,1004], accounts[0].address);
    await EC721["batchMint(uint256[],address)"]([999,998,997,996,995,9999,9998,9997,9996,9995], accounts[0].address);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });