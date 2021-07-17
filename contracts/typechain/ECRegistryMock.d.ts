/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface ECRegistryMockInterface extends ethers.utils.Interface {
  functions: {
    "access(uint16,address)": FunctionFragment;
    "addressCanModifyTrait(address,uint16)": FunctionFragment;
    "addressCanModifyTraits(address,uint16[])": FunctionFragment;
    "getImplementer(uint16)": FunctionFragment;
    "hasTrait(uint16,uint16)": FunctionFragment;
    "implementer(uint16)": FunctionFragment;
    "setAddressAccess(address,uint16,bool)": FunctionFragment;
    "setImplementer(uint16,address)": FunctionFragment;
    "setTrait(uint16,uint16,bool)": FunctionFragment;
    "setTraitOnMultiple(uint16[],uint16[],bool[])": FunctionFragment;
    "traits(uint16,uint16)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "access",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "addressCanModifyTrait",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "addressCanModifyTraits",
    values: [string, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getImplementer",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "hasTrait",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "implementer",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setAddressAccess",
    values: [string, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setImplementer",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setTrait",
    values: [BigNumberish, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setTraitOnMultiple",
    values: [BigNumberish[], BigNumberish[], boolean[]]
  ): string;
  encodeFunctionData(
    functionFragment: "traits",
    values: [BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "access", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "addressCanModifyTrait",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addressCanModifyTraits",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getImplementer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "hasTrait", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "implementer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAddressAccess",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setImplementer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setTrait", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setTraitOnMultiple",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "traits", data: BytesLike): Result;

  events: {};
}

export class ECRegistryMock extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: ECRegistryMockInterface;

  functions: {
    access(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    addressCanModifyTrait(
      _addr: string,
      traitId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    addressCanModifyTraits(
      _addr: string,
      traitIds: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    getImplementer(
      traitID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    hasTrait(
      traitID: BigNumberish,
      tokenID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    implementer(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    setAddressAccess(
      _addr: string,
      traitId: BigNumberish,
      mode: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setImplementer(
      traitID: BigNumberish,
      _addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setTrait(
      traitID: BigNumberish,
      tokenID: BigNumberish,
      mode: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setTraitOnMultiple(
      traitIDs: BigNumberish[],
      tokenIDs: BigNumberish[],
      modes: boolean[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    traits(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  access(
    arg0: BigNumberish,
    arg1: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  addressCanModifyTrait(
    _addr: string,
    traitId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  addressCanModifyTraits(
    _addr: string,
    traitIds: BigNumberish[],
    overrides?: CallOverrides
  ): Promise<boolean>;

  getImplementer(
    traitID: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  hasTrait(
    traitID: BigNumberish,
    tokenID: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  implementer(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  setAddressAccess(
    _addr: string,
    traitId: BigNumberish,
    mode: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setImplementer(
    traitID: BigNumberish,
    _addr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setTrait(
    traitID: BigNumberish,
    tokenID: BigNumberish,
    mode: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setTraitOnMultiple(
    traitIDs: BigNumberish[],
    tokenIDs: BigNumberish[],
    modes: boolean[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  traits(
    arg0: BigNumberish,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    access(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    addressCanModifyTrait(
      _addr: string,
      traitId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    addressCanModifyTraits(
      _addr: string,
      traitIds: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<boolean>;

    getImplementer(
      traitID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    hasTrait(
      traitID: BigNumberish,
      tokenID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    implementer(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    setAddressAccess(
      _addr: string,
      traitId: BigNumberish,
      mode: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setImplementer(
      traitID: BigNumberish,
      _addr: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setTrait(
      traitID: BigNumberish,
      tokenID: BigNumberish,
      mode: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setTraitOnMultiple(
      traitIDs: BigNumberish[],
      tokenIDs: BigNumberish[],
      modes: boolean[],
      overrides?: CallOverrides
    ): Promise<void>;

    traits(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {};

  estimateGas: {
    access(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    addressCanModifyTrait(
      _addr: string,
      traitId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    addressCanModifyTraits(
      _addr: string,
      traitIds: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getImplementer(
      traitID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    hasTrait(
      traitID: BigNumberish,
      tokenID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    implementer(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setAddressAccess(
      _addr: string,
      traitId: BigNumberish,
      mode: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setImplementer(
      traitID: BigNumberish,
      _addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setTrait(
      traitID: BigNumberish,
      tokenID: BigNumberish,
      mode: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setTraitOnMultiple(
      traitIDs: BigNumberish[],
      tokenIDs: BigNumberish[],
      modes: boolean[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    traits(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    access(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    addressCanModifyTrait(
      _addr: string,
      traitId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    addressCanModifyTraits(
      _addr: string,
      traitIds: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getImplementer(
      traitID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    hasTrait(
      traitID: BigNumberish,
      tokenID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    implementer(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setAddressAccess(
      _addr: string,
      traitId: BigNumberish,
      mode: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setImplementer(
      traitID: BigNumberish,
      _addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setTrait(
      traitID: BigNumberish,
      tokenID: BigNumberish,
      mode: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setTraitOnMultiple(
      traitIDs: BigNumberish[],
      tokenIDs: BigNumberish[],
      modes: boolean[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    traits(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}