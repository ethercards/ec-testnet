import { ethers } from 'ethers';
import AddressesMain from '../../contracts/addresses-1.json';
import AddressesRinkeby from '../../contracts/addresses-4.json';
import AddressesGoerli from '../../contracts/addresses-5.json';
import AddressesLocal from '../../contracts/addresses-1337.json';
import EtherCards from '../../contracts/EtherCards.json';
import ECRegistryV2 from '../../contracts/ECRegistryV2.json';
import Zoom2 from '../../contracts/Zoom2.json';



const contractAbis = { EtherCards, ECRegistryV2, Zoom2 };
const addresses = {
    1: { addr: AddressesMain, name: 'Main' },
    4: { addr: AddressesRinkeby, name: 'Rinkeby' },
    5: { addr: AddressesGoerli, name: 'Goerli' },
    1337: { addr: AddressesLocal, name: 'localhost' }
};

export const getContract = async (contractName, provider) => {
    // console.log('getContract', contractName);

    let ntw = await provider.getNetwork();
    //console.log('nnetwork',ntw);

    let contractAbi = contractAbis[contractName];
    let address = addresses[ntw.chainId].addr[contractName];
    let contract = null;

    try {
        contract = new ethers.Contract(address, contractAbi.abi, provider);
    } catch {
        console.log('contract not found');
    }

    // console.log(contractName,contract);
    return contract;
}

export const getContractAddress = async (contractName, networkChainId) => {
    return addresses[networkChainId].addr[contractName];
}