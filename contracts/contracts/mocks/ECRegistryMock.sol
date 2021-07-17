
//SPDX-License-Identifier: Unlicensed
pragma solidity >=0.6.0 <0.8.0;

contract ECRegistryMock {

    mapping ( uint16 => address ) public implementer;
    mapping ( uint16 => mapping ( address => bool ) ) public access;
    mapping ( uint16 => mapping ( uint16 => bool ) ) public traits;

    /* 
    * Test methods
    */
    function setImplementer(uint16 traitID, address _addr) public {
        implementer[traitID] = _addr;
    }

    /* 
    * Actual methods 
    */
    function getImplementer(uint16 traitID) public view returns (address) {
        return implementer[traitID];
    }

    function setAddressAccess(address _addr, uint16 traitId, bool mode) public {
        access[traitId][_addr] = mode;
    }

    function addressCanModifyTrait(address _addr, uint16 traitId) public view returns (bool) {
        return access[traitId][_addr];
    }

    function addressCanModifyTraits(address _addr, uint16[] memory traitIds) public view returns (bool) {
        bool retval = true;
        for(uint16 i = 0; i < traitIds.length; i++) {
            if(!addressCanModifyTrait(_addr, traitIds[i])) {
                return false;
            }
        }
        return retval;
    }

    function hasTrait(uint16 traitID, uint16 tokenID) public view returns (bool) {
        return traits[traitID][tokenID];
    }

    function setTrait(uint16 traitID, uint16 tokenID, bool mode) external {
        traits[traitID][tokenID] = mode;
    }

    function setTraitOnMultiple(uint16[] memory traitIDs, uint16[] memory tokenIDs, bool[] memory modes) external {
        for(uint16 i = 0; i < traitIDs.length; i++) {
            traits[traitIDs[i]][tokenIDs[i]] = modes[i];
        }
    }    
}