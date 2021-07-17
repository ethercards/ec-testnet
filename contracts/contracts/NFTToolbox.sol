//SPDX-License-Identifier: Unlicensed
pragma solidity >=0.6.0 <0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTToolbox is ERC721, Ownable {
    using Counters for Counters.Counter; 
    Counters.Counter private _tokenIds;
    uint256 public wallet = 0;

    constructor() public ERC721("NFTToolbox", "TBX") {}

    function mintTo(address recipient, string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function mint(string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function mintExactTokenIdTo(address recipient, uint256 _newItemId)
        public
        // onlyOwner
        returns (uint256)
    {
        _mint(recipient, _newItemId);
        return _newItemId;
    }

    function mintExactTokenId(uint256 _newItemId)
        public
        // onlyOwner
        returns (uint256)
    {
        _mint(msg.sender, _newItemId);
        return _newItemId;
    }

}
