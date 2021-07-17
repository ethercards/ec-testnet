
async function main() {

    const calTestAddress = '0xfe7EbC878B7106EF813e32452Ba14Fe99851e311';

    const micTestAddress = "0x626f158e89ece1ce777f3d1897c362b078fd7149";

    const morTestAddress = "0x034953EF37CC4A8378eE11a8e51BdD23bFb0f293";

    const kinTestAddress = "0xc9B958E0f7E8ABe45a99CCCBe06c31Dc46D8C995";

    const garyTestAdress = "0x11Ad435d419523b12bD1b555C91b34463FBE4A05";

    const NFTAddress = "0xF3110C4C4BbEFaC81a315517f184F982ee2bF0FD";
    const ForgeDemoAddress = "0x63D7735553A067F7Ff2186c45E5EEEaC58A728A6";

    const tokenId = 37;
    const accounts = await ethers.getSigners();

    const NFTToolboxArtifacts = await ethers.getContractFactory("NFTToolbox");

    const nftOne = new ethers.Contract(NFTAddress, NFTToolboxArtifacts.interface, accounts[0]);

    let tx = await nftOne.transferFrom(accounts[0].address, garyTestAdress, tokenId);
    await tx.wait();

    console.log("tokenId", tokenId);
    console.log("Done")

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });