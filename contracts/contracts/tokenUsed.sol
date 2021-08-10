//SPDX-License-Identifier: Unlicensed
pragma solidity >=0.6.0 <0.8.0;

contract tokenUsed { 

    constructor() {
        
    }

    mapping( uint16 => uint8 ) public tokenData;

    function isUsed(uint16 _position) public view returns (bool result)
    {
        uint16 byteNum = uint16(_position / 8);
        uint16 bitPos = uint8(_position - byteNum * 8);
        if(tokenData[byteNum] == 0 ) return false;
        return tokenData[byteNum] & (0x01 * 2**bitPos) != 0;
    }
    
    function setUsed(uint16 _position) public {
        uint16 byteNum = uint16(_position / 8);
        uint16 bitPos = uint8(_position - byteNum * 8);
//        tokenData[byteNum] = uint8(tokenData[byteNum] | (1 << bitPos));
        tokenData[byteNum] = uint8(tokenData[byteNum] | 2**bitPos);
    }

    function setData(uint16 _index, uint8[] calldata _data) public {
        uint16 j = 0;
        for(uint16 i = _index; i < _index+_data.length; i++) {
           tokenData[i] = _data[j];
           j++;
        }
    }
    
    function getData(uint8 _page, uint16 _perPage) public view returns (uint8[] memory) {
        _perPage = _perPage/8;
        uint16 i = _perPage * _page;
        uint16 max = i + (_perPage);
        uint16 j = 0;
        uint8[] memory retValues;
        
        assembly {
            mstore(retValues, _perPage)
        }

        while(i < max) {
            retValues[j] = tokenData[i];
            j++;
            i++;
        }
        
        assembly {
            // move pointer to freespace otherwise return calldata gets messed up
            mstore(0x40, msize()) 
        }
        return retValues;
    }
    
    function setUsedFromAndLength( uint16 _start, uint16 _len) public {
        for(uint16 i = _start; i < _start+_len; i ++) {
            setUsed(i);
        }
    }
    
    
}