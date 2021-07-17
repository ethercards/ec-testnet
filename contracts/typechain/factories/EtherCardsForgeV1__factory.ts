/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  EtherCardsForgeV1,
  EtherCardsForgeV1Interface,
} from "../EtherCardsForgeV1";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_NFTContractAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_VaultAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint16",
        name: "src",
        type: "uint16",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "dst",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "callData",
        type: "bytes",
      },
    ],
    name: "LayerTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "Logged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    name: "ForgeProtector",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NFTContract",
    outputs: [
      {
        internalType: "contract IERC721",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "Vault",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_initialized",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_locked",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "mode",
        type: "bool",
      },
    ],
    name: "lock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "logData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "receivedTokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tracker",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "retrieve721",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tracker",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "retrieveERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16[]",
        name: "tokenIds",
        type: "uint16[]",
      },
    ],
    name: "setForgeProtection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "setInitialized",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040526000600460006101000a81548160ff0219169083151502179055506000600460016101000a81548160ff02191690831515021790555034801561004657600080fd5b50604051611a55380380611a558339818101604052604081101561006957600080fd5b81019080805190602001909291908051906020019092919050505060006100946101bb60201b60201c565b9050806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35081600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050506101c3565b600033905090565b611883806101d26000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80635e7bfa8b11610097578063a466dd9311610066578063a466dd9314610419578063a5b3abfb14610492578063f2fde38b146104e0578063fa600ddb14610524576100f5565b80635e7bfa8b14610358578063715018a6146103d157806380192821146103db5780638da5cb5b146103e5576100f5565b8063223fcbc9116100d3578063223fcbc9146102b05780632d2c44f2146102d05780633072cf601461030457806331c2273b14610324576100f5565b80630dd0a042146100fa578063150b7a021461012a57806317fd1e2f14610262575b600080fd5b6101286004803603602081101561011057600080fd5b8101908080351515906020019092919050505061056c565b005b61022d6004803603608081101561014057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190803590602001906401000000008111156101a757600080fd5b8201836020820111156101b957600080fd5b803590602001918460018302840111640100000000831117156101db57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610638565b60405180827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b6102ae6004803603604081101561027857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610d00565b005b6102b8610e60565b60405180821515815260200191505060405180910390f35b6102d8610e73565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61030c610e99565b60405180821515815260200191505060405180910390f35b61032c610eac565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103cf6004803603602081101561036e57600080fd5b810190808035906020019064010000000081111561038b57600080fd5b82018360208201111561039d57600080fd5b803590602001918460018302840111640100000000831117156103bf57600080fd5b9091929391929390505050610ed2565b005b6103d9610fbb565b005b6103e3611128565b005b6103ed611277565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6104906004803603602081101561042f57600080fd5b810190808035906020019064010000000081111561044c57600080fd5b82018360208201111561045e57600080fd5b8035906020019184602083028401116401000000008311171561048057600080fd5b90919293919293905050506112a0565b005b6104de600480360360408110156104a857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611444565b005b610522600480360360208110156104f657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061159e565b005b6105546004803603602081101561053a57600080fd5b81019080803561ffff169060200190929190505050611790565b60405180821515815260200191505060405180910390f35b6105746117b0565b73ffffffffffffffffffffffffffffffffffffffff16610592611277565b73ffffffffffffffffffffffffffffffffffffffff161461061b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b80600460016101000a81548160ff02191690831515021790555050565b6000600460009054906101000a900460ff166106bc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260138152602001807f4d75737420626520696e697469616c697a65640000000000000000000000000081525060200191505060405180910390fd5b600460019054906101000a900460ff161561073f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260128152602001807f4d757374206e6f74206265206c6f636b6564000000000000000000000000000081525060200191505060405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610802576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f4d757374206265204e4654436f6e74726163742061646472657373000000000081525060200191505060405180910390fd5b60008060008060208601805160001a9450600181019050805160001a93506001810190505060018460ff16146108a0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601d8152602001807f42696e61727920646174612076657273696f6e206d757374206265203100000081525060200191505060405180910390fd5b60018360ff161415610c8a5760228601600181015160001a610100825160001a02019150600281019050600181015160001a610100825160001a02019250600281019050508773ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636352211e836040518263ffffffff1660e01b8152600401808261ffff16815260200191505060206040518083038186803b15801561097357600080fd5b505afa158015610987573d6000803e3d6000fd5b505050506040513d602081101561099d57600080fd5b810190808051906020019092919050505073ffffffffffffffffffffffffffffffffffffffff1614610a1a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260438152602001806117df6043913960600191505060405180910390fd5b8161ffff168714610a76576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602c815260200180611822602c913960400191505060405180910390fd5b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600360008461ffff1661ffff16815260200190815260200160002060009054906101000a900460ff1615610b03576000600360008561ffff1661ffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508890505b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd3083866040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018261ffff1681526020019350505050600060405180830381600087803b158015610bb857600080fd5b505af1158015610bcc573d6000803e3d6000fd5b505050508161ffff168361ffff167f5949f486964b9062c1b5d09ce263b19e66864cd9ff78b15688085cddc87b78ce896040518080602001828103825283818151815260200191508051906020019080838360005b83811015610c3c578082015181840152602081019050610c21565b50505050905090810190601f168015610c695780820380516001836020036101000a031916815260200191505b509250505060405180910390a363150b7a0260e01b95505050505050610cf8565b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260198152602001807f43616c6c2074797065206e6f7420696d706c656d656e7465640000000000000081525060200191505060405180910390fd5b949350505050565b610d086117b0565b73ffffffffffffffffffffffffffffffffffffffff16610d26611277565b73ffffffffffffffffffffffffffffffffffffffff1614610daf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff1663a9059cbb33836040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b158015610e2057600080fd5b505af1158015610e34573d6000803e3d6000fd5b505050506040513d6020811015610e4a57600080fd5b8101908080519060200190929190505050505050565b600460019054906101000a900460ff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460009054906101000a900460ff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460019054906101000a900460ff1615610f55576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260128152602001807f4d757374206e6f74206265206c6f636b6564000000000000000000000000000081525060200191505060405180910390fd5b818160405180838380828437808301925050509250505060405180910390203373ffffffffffffffffffffffffffffffffffffffff167f64a79c29627553c4a1d8fd0a4581343e256db6072c9af6a5e04ce9df53918cd560405160405180910390a35050565b610fc36117b0565b73ffffffffffffffffffffffffffffffffffffffff16610fe1611277565b73ffffffffffffffffffffffffffffffffffffffff161461106a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a360008060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b6111306117b0565b73ffffffffffffffffffffffffffffffffffffffff1661114e611277565b73ffffffffffffffffffffffffffffffffffffffff16146111d7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b600460009054906101000a900460ff161561125a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260178152602001807f4d757374206e6f7420626520696e697469616c697a656400000000000000000081525060200191505060405180910390fd5b6001600460006101000a81548160ff021916908315150217905550565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6112a86117b0565b73ffffffffffffffffffffffffffffffffffffffff166112c6611277565b73ffffffffffffffffffffffffffffffffffffffff161461134f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b600460009054906101000a900460ff16156113d2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260178152602001807f4d757374206e6f7420626520696e697469616c697a656400000000000000000081525060200191505060405180910390fd5b60005b828290508161ffff16101561143f5760016003600085858561ffff168181106113fa57fe5b9050602002013561ffff1661ffff1661ffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555080806001019150506113d5565b505050565b61144c6117b0565b73ffffffffffffffffffffffffffffffffffffffff1661146a611277565b73ffffffffffffffffffffffffffffffffffffffff16146114f3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff166323b872dd3033846040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050600060405180830381600087803b15801561158257600080fd5b505af1158015611596573d6000803e3d6000fd5b505050505050565b6115a66117b0565b73ffffffffffffffffffffffffffffffffffffffff166115c4611277565b73ffffffffffffffffffffffffffffffffffffffff161461164d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657281525060200191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156116d3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260268152602001806117b96026913960400191505060405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60036020528060005260406000206000915054906101000a900460ff1681565b60003390509056fe4f776e61626c653a206e6577206f776e657220697320746865207a65726f206164647265737344657374696e6174696f6e20746f6b656e206d757374206265206f776e6564206279207468652073616d65206164647265737320617320736f7572636520746f6b656e546f6b656e2073656e7420746f20636f6e7472616374206d757374206d6174636820737263546f6b656e4964a2646970667358221220e982144b2f2e16b919d7832d5d25b5fb17cd737c7cababe3df91593ce05c89b964736f6c63430007050033";

export class EtherCardsForgeV1__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _NFTContractAddress: string,
    _VaultAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<EtherCardsForgeV1> {
    return super.deploy(
      _NFTContractAddress,
      _VaultAddress,
      overrides || {}
    ) as Promise<EtherCardsForgeV1>;
  }
  getDeployTransaction(
    _NFTContractAddress: string,
    _VaultAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _NFTContractAddress,
      _VaultAddress,
      overrides || {}
    );
  }
  attach(address: string): EtherCardsForgeV1 {
    return super.attach(address) as EtherCardsForgeV1;
  }
  connect(signer: Signer): EtherCardsForgeV1__factory {
    return super.connect(signer) as EtherCardsForgeV1__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EtherCardsForgeV1Interface {
    return new utils.Interface(_abi) as EtherCardsForgeV1Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): EtherCardsForgeV1 {
    return new Contract(address, _abi, signerOrProvider) as EtherCardsForgeV1;
  }
}
