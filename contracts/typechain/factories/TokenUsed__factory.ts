/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { TokenUsed, TokenUsedInterface } from "../TokenUsed";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_page",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "_perPage",
        type: "uint16",
      },
    ],
    name: "getData",
    outputs: [
      {
        internalType: "uint8[]",
        name: "",
        type: "uint8[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_position",
        type: "uint16",
      },
    ],
    name: "isUsed",
    outputs: [
      {
        internalType: "bool",
        name: "result",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_index",
        type: "uint16",
      },
      {
        internalType: "uint8[]",
        name: "_data",
        type: "uint8[]",
      },
    ],
    name: "setData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_position",
        type: "uint16",
      },
    ],
    name: "setUsed",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_start",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "_len",
        type: "uint16",
      },
    ],
    name: "setUsedFromAndLength",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    name: "tokenData",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061056f806100206000396000f3fe608060405234801561001057600080fd5b50600436106100615760003560e01c8062011b7c1461006657806321cd70b9146100af57806389777ed0146100e1578063c6f3d9ec14610168578063cebb8feb146101a8578063e9b19f8a146101f0575b600080fd5b6100966004803603602081101561007c57600080fd5b81019080803561ffff169060200190929190505050610284565b604051808260ff16815260200191505060405180910390f35b6100df600480360360208110156100c557600080fd5b81019080803561ffff1690602001909291905050506102a4565b005b610166600480360360408110156100f757600080fd5b81019080803561ffff1690602001909291908035906020019064010000000081111561012257600080fd5b82018360208201111561013457600080fd5b8035906020019184602083028401116401000000008311171561015657600080fd5b9091929391929390505050610330565b005b6101a66004803603604081101561017e57600080fd5b81019080803561ffff169060200190929190803561ffff1690602001909291905050506103b4565b005b6101d8600480360360208110156101be57600080fd5b81019080803561ffff1690602001909291905050506103e7565b60405180821515815260200191505060405180910390f35b61022d6004803603604081101561020657600080fd5b81019080803560ff169060200190929190803561ffff16906020019092919050505061048b565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b83811015610270578082015181840152602081019050610255565b505050509050019250505060405180910390f35b60006020528060005260406000206000915054906101000a900460ff1681565b600060088261ffff16816102b457fe5b049050600060088202830360ff1690508061ffff166001901b6000808461ffff1661ffff16815260200190815260200160002060009054906101000a900460ff1660ff16176000808461ffff1661ffff16815260200190815260200160002060006101000a81548160ff021916908360ff160217905550505050565b6000808490505b838390508561ffff16018161ffff1610156103ad5783838361ffff1681811061035c57fe5b9050602002013560ff166000808361ffff1661ffff16815260200190815260200160002060006101000a81548160ff021916908360ff16021790555081806001019250508080600101915050610337565b5050505050565b60008290505b81830161ffff168161ffff1610156103e2576103d5816102a4565b80806001019150506103ba565b505050565b60008060088361ffff16816103f857fe5b049050600060088202840360ff16905060008060008461ffff1661ffff16815260200190815260200160002060009054906101000a900460ff1660ff16141561044657600092505050610486565b60008161ffff1660020a6001026000808561ffff1661ffff16815260200190815260200160002060009054906101000a900460ff1660ff16161415925050505b919050565b606060088261ffff168161049b57fe5b04915060008360ff168302905060008382019050600060608581525b8261ffff168461ffff161015610528576000808561ffff1661ffff16815260200190815260200160002060009054906101000a900460ff16818361ffff16815181106104ff57fe5b602002602001019060ff16908160ff1681525050818060010192505083806001019450506104b7565b59604052809450505050509291505056fea264697066735822122007eaefafc9ba1c8fe8203d92cb5c07dc71505619a7db35dcf6e4e12d142093a464736f6c63430007050033";

export class TokenUsed__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TokenUsed> {
    return super.deploy(overrides || {}) as Promise<TokenUsed>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): TokenUsed {
    return super.attach(address) as TokenUsed;
  }
  connect(signer: Signer): TokenUsed__factory {
    return super.connect(signer) as TokenUsed__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TokenUsedInterface {
    return new utils.Interface(_abi) as TokenUsedInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TokenUsed {
    return new Contract(address, _abi, signerOrProvider) as TokenUsed;
  }
}
