//SPDX-License-Identifier: Unlicensed
pragma solidity >=0.6.0 <0.8.0;

import "hardhat/console.sol";
import "./openzeppelin/token/ERC721/TestNetERC721.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract NFTToolbox is TestNetERC721, Ownable { 
    using EnumerableSet for EnumerableSet.AddressSet;
    EnumerableSet.AddressSet controllers;

    constructor() TestNetERC721("RinkebyEC", "REC") {
        controllers.add(msg.sender);
    }

    function mintExactTokenIdTo(address recipient, uint256 _newItemId) public onlyAllowed {
        _mint(recipient, _newItemId);
    }

    function mintExactTokenId(uint256 _newItemId) public onlyAllowed {
        _mint(msg.sender, _newItemId);
    }

    function takeTokenIdAndGiveTo(uint256 tokenId, address to) public onlyAllowed {
        _takeToken(tokenId, to);
    }


    function controllerAdd(address _addr) public onlyOwner {
        controllers.add(_addr);
    }

    function controllerRemove(address _addr) public onlyOwner {
        controllers.remove(_addr);
    }

    function controllerContains(address _addr) public view returns( bool ) {
        return controllers.contains(_addr);
    }

    function controllerAt(uint256 _index) public view returns( address ) {
        return controllers.at(_index);
    }

    function controllerLength() public view returns( uint256 ) {
        return controllers.length();
    }

    modifier onlyAllowed() {
        require(
            msg.sender == owner() ||
            controllers.contains(msg.sender),
            "Not Authorised"
        );
        _;
    }
}
