// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title StandardERC20
 * @author ERC20 Generator (https://vittominacori.github.io/erc20-generator)
 * @dev Implementation of the StandardERC20
 */
contract StandardERC20 is ERC20 {

    constructor (
        string memory name,
        string memory symbol,
        uint256 initialBalance
    ) ERC20(name, symbol) {
        require(initialBalance > 0, "StandardERC20: supply cannot be zero");

        _mint(_msgSender(), initialBalance);
    }
}
