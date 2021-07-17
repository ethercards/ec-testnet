//SPDX-License-Identifier: Unlicensed
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

// contract Data {
    
//     function test() public {

//         uint256 layerLength = 5;


//         uint8[] memory NewSrcLayers;
//         uint8[] memory NewDstLayers;
        
//         assembly {
//             // move and resize internalAddresses in new memory
//             NewSrcLayers := mload(0x40)
//             // set array length in the first 32 bytes
//             mstore( NewSrcLayers, layerLength)
//             // move free memory pointer
//             mstore(0x40, add( NewSrcLayers, mul(layerLength, 32) )) 
//         }

//         assembly {
//             // move and resize internalAddresses in new memory
//             NewDstLayers := mload(0x40)
//             // set array length in the first 32 bytes
//             mstore( NewDstLayers, layerLength)
//             // move free memory pointer
//             mstore(0x40, add( NewDstLayers, mul(layerLength, 32) )) 
//         }

//         NewSrcLayers[4] = 9;
//         NewDstLayers[4] = 7;
        
//         // assembly {
//         //     // move and resize internalAddresses in new memory
//         //     NewDstLayers := mload(0x40)
//         //     // set array length in the first 32 bytes
//         //     mstore( NewDstLayers, layerLength)
            
//         //     // // allocate free space for NewDstLayers
//         //     // for { let n := 0 } lt(n, layerLength) { n := add(n, 1) } {
//         //     //     mstore(
//         //     //         add (
//         //     //             add (NewDstLayers, 32), // offset by 32 ( len )
//         //     //             mul(n, 32)
//         //     //         ), 0
//         //     //     )
//         //     // }

//         //     let x := add( msize(), mul(layerLength, 32) )
            
//         //     // move free memory pointer
//         //     mstore(0x20, x) 
//         //     mstore(0x40, x) 

//         // }
        
        
//         // uint8[1] memory testz = [8];
//         // assembly {
//         //     mstore(0x20, testz) 
//         // }   
//     }

// }

// // import "hardhat/console.sol";

contract Data {
    
    mapping(uint16 => uint8[]) public data;

    constructor() {
        data[10] = [1,2,3,4,5];
        data[14] = [6,7,8,9,10];
    }

    function getValue(uint16 _tokenId) external view returns (uint8[] memory) {
         return data[_tokenId];
    }

    function setValue(uint16 _tokenId, uint8[] memory _value) public {
        data[_tokenId] = _value;
    }

}


contract Tester {

    Data public implementer;

    event LayerTransferEvent(uint16 indexed src, uint16 indexed dst);

    constructor() {
        implementer = new Data();
    }

    function doIt() public {


        uint8[] memory SrcLayers = implementer.getValue(10);
        uint8[] memory DstLayers = implementer.getValue(14);
        uint256 layerLength = SrcLayers.length;

        uint8[] memory NewSrcLayers;
        uint8[] memory NewDstLayers;

        assembly {
            // move and resize internalAddresses in new memory
            NewSrcLayers := mload(0x40)
            // set array length in the first 32 bytes
            mstore( NewSrcLayers, layerLength)

            // copy old values over 
            // for { let n := 0 } lt(n, layerLength) { n := add(n, 1) } {
            //     mstore(  
            //         add ( add (NewSrcLayers, 32), mul(n, 32)  ), 
            //         mload( add ( add (SrcLayers, 32), mul(n, 32) ) )
            //     )
            // }

            // move free memory pointer
            mstore(0x40, add( msize(), mul(layerLength, 32) )) 
        }

        assembly {
            // move and resize internalAddresses in new memory
            NewDstLayers := mload(0x40)
            // set array length in the first 32 bytes
            mstore( NewDstLayers, layerLength)

            // copy old values over 
            // for { let n := 0 } lt(n, layerLength) { n := add(n, 1) } {
            //     mstore(  
            //         add ( add (NewDstLayers, 32), mul(n, 32)  ), 
            //         mload( add ( add (DstLayers, 32), mul(n, 32) ) )
            //     )
            // }

            // move free memory pointer
            mstore(0x40, add( msize(), mul(layerLength, 32) )) 
        }

        bool transferLayer = true;


        for(uint8 i = 0; i < 5; i++) {
            transferLayer = true;

            if(transferLayer) {
                // swap SRC to DST
                NewSrcLayers[i] = DstLayers[i];
                // swap DST to SRC 
                NewDstLayers[i] = SrcLayers[i];
            }
            //  else {
            //     // copy old values
            //     NewSrcLayers[i] = SrcLayers[i];
            //     NewDstLayers[i] = DstLayers[i];
            // }
        }

        // set new values
        implementer.setValue(10, NewSrcLayers);
        implementer.setValue(14, NewDstLayers);
        
        emit LayerTransferEvent(10, 14);
    }
}