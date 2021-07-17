const { ZERO_ADDRESS, ROLE, Data } = require('../tests/helpers/common');
const { expect } = require("chai");
const ecutils = require("ec-util");
const ecForge = new ecutils.Forge();

async function main() {

    data = new Data();
    await data.init();

    testingAccount1 = data.user1Signer;
    testingAccount2 = data.user2Signer;
    vaultSigner = data.user8Signer;

    TesterArtifacts = await ethers.getContractFactory("Tester");
    tested = await TesterArtifacts.deploy();
    await tested.deployed();
    console.log("    tested:             ", tested.address);

    tx = await tested.doIt();
    tx.wait();
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });