//SPDX-License-Identifier: Unlicensed
pragma solidity >=0.6.0 <0.8.0;
//pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

/**
 * @dev EtherCardsForge contract
 *
 * v2,
 * - on chain forge protector
 * - layer swapping
 *
 */

interface IECRegistry {
    function getImplementer(uint16 traitID) external view returns (address);
    function addressCanModifyTrait(address, uint16) external view returns (bool);
    function addressCanModifyTraits(address, uint16[] memory) external view returns (bool);
    function hasTrait(uint16 traitID, uint16 tokenID) external view returns (bool);
    function setTrait(uint16 traitID, uint16 tokenID, bool) external;
}

interface IAccidentalCollaboration {
    function getValue(uint16 _tokenId) external view returns (uint8[] memory);
    function setValue(uint16 _tokenId, uint8[] memory _value) external;
}

contract EtherCardsForge is Ownable {
    
    // Events
    event LayerTransferEvent(uint16 indexed src, uint16 indexed dst, bytes callData);
    event LoggedEvent(address indexed from, bytes indexed data);
    event ECRegistryUpdateEvent(address _addr);

    // Addresses
    IERC721         public  NFTContract;
    IECRegistry     public  ECRegistry;
    address         public  Vault;
    
    uint16 traitId_AccidentalCollaboration  = 0;
    uint16 traitId_ForgeProtector           = 9;

    bool public _locked = false;

    constructor(address _NFTContractAddress, address _registry, address _VaultAddress) {
        NFTContract = IERC721(_NFTContractAddress);
        ECRegistry = IECRegistry(_registry);
        Vault = _VaultAddress;
     }

    function updateNFTContractAddress(address _newAddress) external onlyOwner {
        NFTContract = IERC721(_newAddress);
        emit ECRegistryUpdateEvent(_newAddress);
    }

    /**
     * Log Data in the chain
     */
    function logData(bytes calldata _data) external {
        require(!_locked, "Must not be locked");
        emit LoggedEvent(msg.sender, _data);
    }

    function onERC721Received(
        address,    // operator
        address from,
        uint256 receivedTokenId,
        bytes memory data
    ) external returns (bytes4) {

        require(!_locked, "Must not be locked");
        require(
            msg.sender == address(NFTContract),
            "Must be NFTContract address"
        );

        // Parse data
        uint256 dataReadPointer;
        uint8 version;
        uint8 callType;
        uint16 srcTokenId;
        uint16 dstTokenId;

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            // add 32 since input is treated as a variable with 32 bit white space
            dataReadPointer := add(data, 32)

            // hex 0101000b000c0100000101

            // byte 0 - version
            version := byte(0, mload(dataReadPointer))
            dataReadPointer := add(dataReadPointer, 1)

            // byte 1 - call type
            callType := byte(0, mload(dataReadPointer))
            dataReadPointer := add(dataReadPointer, 1)
        }

        // Validate forge type
        require(version == 1, "Binary data version must be 1");

        if (callType == 1) {

            require(
                ECRegistry.addressCanModifyTrait(address(this), traitId_AccidentalCollaboration),
                "Forge must have registry access"
            );

            require(
                ECRegistry.addressCanModifyTrait(address(this), traitId_ForgeProtector),
                "Forge must have registry access"
            );

            assembly {
                // byte [2-3] Load dstTokenId -> mul first byte by 256 and add the rest from byte 2
                dstTokenId := add(
                    mul(byte(0, mload(dataReadPointer)), 256),
                    byte(0, mload(add(dataReadPointer, 1)))
                )
                dataReadPointer := add(dataReadPointer, 2)

                // byte [4-5] Load srcTokenId -> mul first byte by 256 and add the rest from byte 2
                srcTokenId := add(
                    mul(byte(0, mload(dataReadPointer)), 256),
                    byte(0, mload(add(dataReadPointer, 1)))
                )
                dataReadPointer := add(dataReadPointer, 2)
            }

            // Validate that the destination token actually exists by finding out if it has the correct owner
            require(
                NFTContract.ownerOf(dstTokenId) == from,
                "Destination token must be owned by the same address as source token"
            );

            // Make sure our user did not mess with the byte data
            require(
                receivedTokenId == srcTokenId,
                "Token sent to contract must match srcTokenId"
            );

            transferLayers(srcTokenId, dstTokenId, data, dataReadPointer);

            // default receiver for cards.. Vault
            address receiver = Vault;

            // check if received card ( srcTokenId ) has forge protector trait ( 9 )
            if (ECRegistry.hasTrait(srcTokenId, 9)) {
                // yes. Burn trait 
                ECRegistry.setTrait(
                    srcTokenId, 
                    traitId_ForgeProtector,  // 9  
                    false
                );
                // and return it to sender
                receiver = from;
            }

            // transfer but don't call receiver
            // safeTransferFrom would be a bad idea here
            NFTContract.transferFrom(address(this), receiver, srcTokenId);

            return this.onERC721Received.selector;
        } 
        
        revert("Call type not implemented");
        // return this.onERC721Received.selector;
    }
    
    function transferLayers(
        uint16 srcTokenId,
        uint16 dstTokenId,
        bytes memory data,
        uint256 dataReadPointer
    ) public {
        
        // get trait implementer
        IAccidentalCollaboration implementer = IAccidentalCollaboration( 
            ECRegistry.getImplementer(traitId_AccidentalCollaboration) 
        );

        // read original layers
        uint8[] memory SrcLayers = implementer.getValue(srcTokenId);
        uint8[] memory DstLayers = implementer.getValue(dstTokenId);
        uint256 layerLength = SrcLayers.length;

        uint8[] memory NewSrcLayers;
        uint8[] memory NewDstLayers;
        //
        // The getValue method we're calling returns a dynamic array.
        // The setValue method we're calling to change values also uses a dynamic array.
        // Changing that to fixed would mean we can't add more values to it later
        //
        // Since solidity doesn't provide support for pushing into memory arrays
        // ie. NewSrcLayers[0] = 2;     => `Error: invalid opcode`
        // ie. NewSrcLayers.push(2);    => `Error: Member "push" is not available in uint8[] memory outside of storage`
        //
        // COMMENT: Yes.. pushing into an existing array would mean we'd have to move it all into
        //          free storage otherewise we'd end up out of bounds.
        //
        // Dynamic Arrays
        //          - Have a length slot in the first 32 bytes 
        //
        // Fixed Arrays
        //          - Use the type signature to determine the size, and miss the length slot
        //
        // IMPORTANT: 
        //          - Never push more values than you allocate.
        //          - Do not forget to move the variable's location to free memory before allocation!!!
        //              Else you might end up in previous variable storage, even if you declare it later
        //
        //          Example:
        //          -------------
        //          uint8[5] memory FixedArray = [1,2,3,4,1];
        //          uint8[] memory NewDstLayers;   
        //          assembly {
        //              mstore(0x20, FixedArray)    => ends up at 0x80
        //              mstore(0x20, NewDstLayers)  => ends up at 0x60
        //          }
        //          -------------
        //
        //          NewDstLayers ends up allocated in memory BEFORE your FixedArray
        //
        // FIX: 
        //          -  init our variables, then move them to free memory one by one, pre allocate memory space 
        //          or just work with them directly.
        //
        // Optimisation: - just copy old values into new 
        //

        assembly {
            // source token layers
            // move our variable to free memory space
            NewSrcLayers := mload(0x40)
            // set array length in the first 32 bytes
            mstore( NewSrcLayers, layerLength)
            // move free memory pointer
            mstore(0x40, add( msize(), mul(layerLength, 32) )) 

            // destination token layers
            // move our variable to free memory space
            NewDstLayers := mload(0x40)
            // set array length in the first 32 bytes
            mstore( NewDstLayers, layerLength)
            // move free memory pointer
            mstore(0x40, add( msize(), mul(layerLength, 32) )) 
        }

        for(uint8 i = 0; i < 5; i++) {
            bool transferLayer = false;
            assembly {
                // byte 6-11 - layer 1-5
                transferLayer := byte(0, mload(dataReadPointer))
                dataReadPointer := add(dataReadPointer, 1)
            }
            if(transferLayer) {
                // swap SRC to DST
                NewSrcLayers[i] = DstLayers[i];
                // swap DST to SRC 
                NewDstLayers[i] = SrcLayers[i];
            }
            else {
                // copy old values
                NewSrcLayers[i] = SrcLayers[i];
                NewDstLayers[i] = DstLayers[i];
            }
        }

        // set new values
        implementer.setValue(srcTokenId, NewSrcLayers);
        implementer.setValue(dstTokenId, NewDstLayers);

        emit LayerTransferEvent(srcTokenId, dstTokenId, data);
    }

    // lock mechanism
    function lock(bool mode) external onlyOwner {
        _locked = mode;
    }

    // blackhole prevention methods
    function retrieveERC20(address _tracker, uint256 amount) external onlyOwner {
        IERC20(_tracker).transfer(msg.sender, amount);
    }

    function retrieve721(address _tracker, uint256 id) external onlyOwner {
        IERC721(_tracker).transferFrom(address(this), msg.sender, id);
    }
}
