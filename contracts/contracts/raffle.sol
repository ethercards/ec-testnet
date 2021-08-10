// //SPDX-License-Identifier: Unlicensed
// pragma solidity >=0.6.0 <0.8.0;

// import "hardhat/console.sol";
// import "@openzeppelin/contracts/utils/EnumerableSet.sol";
// import "../interfaces/IRNG.sol";

// contract raffle { 

//     enum PoolIds {
//         __IGNORED__,
//         RED_MARS,
//         BLUE_NEPTUNE,
//         SILVER
//     }

    

//     EnumerableSet.UintSet                           usedTokenIds;

//     mapping( address => uint16 )                    public participantAddressToId;
//     // for frontend
//     // participantId => poolID => tokenCount
//     mapping( uint16 => mapping(uint8 => uint16) )   public participantPoolCount;

//     //      poolId         => entryId => participantId
//     mapping( uint8 => mapping( uint16 => uint16 ) ) public entryToParticipantId;
//     mapping( uint8 => uint16 )                      public poolCount;

//     bytes32     public requestHash;
//     bool        public canResolve = false;
//     bool        public resolved = false;
//     uint256     public random = 0;

//     bool        public hasPrizes = false;


//     // contracts
//     ERC721      public lameloContract = "";
//     IRNG        public rnd;



//     function getUsedTokenIds(uint256 _page) public returns( uint256[100] memory ) {
        
//         uint256[100] memory retValues;

//         for(uint256 i = 0; i < 100; i ++) {
//             retValues 
//         }

//         usedTokenIds

//         return usedTokenIds
//     }

//     constructor() {
//         // set lameloContract = ERC721(0x163883263274e8ef6332cfa84f35b23c6c51df72)
//         // set start / end times
//         rnd = _rnd;

//     }

//     function onERC721Received(
//         address,    // operator
//         address,    // from,
//         uint256 receivedTokenId,
//         bytes       // memory data
//     ) external returns (bytes4) {

//         require(
//             msg.sender == address(lameloContract),
//             "Must be lameloContract address"
//         );

//         if(receivedTokenId == 498 ||receivedTokenId == 499 || receivedTokenId == 500) {
//             if(
//                 lameloContract.ownerOf(498) == address(this) && 
//                 lameloContract.ownerOf(499) == address(this) && 
//                 lameloContract.ownerOf(500) == address(this)
//             ) 
//             {
//                 hasPrizes = true;
//             }

//         }

//         revert("bad token received");
//     }

//     // 1 - receive token id array uint16[]
//     function registerForDrop(uint16[] tonekIds) public {

//         require(hasPrizes, "Does not have prize tokens");
//         require(getTimestamp() > startTime, "Not started");
//         require(getTimestamp() < endTime, "Already ended");
        
//         for(uint16 i = 0 ; i < tonekIds.length; i++) {
//             uint16 thisId = tonekIds[i];

//             // 1 - check if token was previously used
//             require(!usedTokenIds.contains(thisId), "Already has a ticket");

//             // 2 - check ownership
//             if(!lameloContract.ownerOf(thisId) == msg.sender) {
//                 revert("not owner");
//             }
            
//             // 3 get pool id from token id
//             /*
            
//                 silver - 500-1500
//                 blue - 1500-3500
//                 mars - 3500-10000
            
//             */

//             // 4 - register entry            
//             uint16 myID = participantAddressToId[msg.sender];

//             if(thisId <= 1500) {
//                 // is silver.. increase count de silver la adresa mea
//                 participantPoolCount[PoolIds.SILVER][myID]++;
//                 poolCount[PoolIds.SILVER]++;
//                 entryToParticipantId[PoolIds.SILVER][poolCount[PoolIds.SILVER]] = myID;

//             } else if(thisId <= 3500) {
//                 // is silver.. increase count de silver la adresa mea
//                 participantPoolCount[PoolIds.BLUE_NEPTUNE][myID]++;
//                 poolCount[PoolIds.BLUE_NEPTUNE]++;
//                 entryToParticipantId[PoolIds.BLUE_NEPTUNE][poolCount[PoolIds.BLUE_NEPTUNE]]= myID;

//             } else if(thisId <= 10000) {
//                 poolCount[PoolIds.RED]++;
//                 participantPoolCount[PoolIds.RED][myID]++;
//                 entryToParticipantId[PoolIds.RED][poolCount[PoolIds.RED]]= myID;
//             }
            
//             // register as used
//             usedTokenIds.add(thisId);
            
            
//         }

//     }

//     function requestVRF() onlyOwner {
//         requestHash = rnd.requestRandomNumberWithCallback();
//     }

//     function process(uint256 _random, bytes32 _requestId) external onlyRNDContract {
//         require(msg.sender == address(rnd), "Unauthorised");
//         require(requestHash == _requestId, "Unauthorised");
//         require(!canResolve, "VRF already received");
//         require(!resolved, "Already resolved");

//         canResolve = true;
//         random = _random;
//         // my_process(random,_requestId);
//     }


//     function resolveDrop() onlyOwner {
//         require(canResolve, "NO VRF YET");
//         require(!resolved, "Already resolved");
//         require(getTimestamp() > endTime, "Already ended");

//         // take VRF

//         uint16 count = poolCount[PoolIds.RED];
//         // random % count
//         uint16 _index = random % count;
//         uint16 winnerId = entryToParticipantId[PoolIds.RED][poolCount[PoolIds.RED]][_index];
//         address winner_address = participantAddressToId[winnerId];

//         // entryToParticipantId[PoolIds.BLUE_NEPTUNE][poolCount[PoolIds.BLUE_NEPTUNE]]= myID;
//         // entryToParticipantId[PoolIds.SILVER][poolCount[PoolIds.SILVER]]= myID;


//         resolved = true;

//         // transfer tokens to new owners
//         // cu normal transfer.. no safe

//     }

//     function recoverTokens() onlyOwner {
//         require(hasPrizes, "Does not have prize tokens");
//         require(!canResolve, "VRF already received");
//         require(!resolved, "Already resolved");
//         // if shit hits the fan recover stuff

//         // transfer tokens to msg.sender // owner
//     }

// }