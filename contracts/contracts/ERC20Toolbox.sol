//SPDX-License-Identifier: Unlicensed
pragma solidity >=0.6.0 <0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 
contract ERC20Toolbox is ERC20 {

    constructor() ERC20("Test20", "ERC20") {
        _mint(msg.sender, 1000 * 10 ** 18);
    }
}
