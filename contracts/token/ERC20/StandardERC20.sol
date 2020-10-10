// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../../utils/Receiver.sol";

/**
 * @title StandardERC20
 * @author ERC20 Generator (https://vittominacori.github.io/erc20-generator)
 * @dev Implementation of the StandardERC20
 */
contract StandardERC20 is ERC20, Receiver {

    constructor (
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 initialBalance,
        address payable feeReceiver
    ) ERC20(name, symbol) Receiver(feeReceiver) payable {
        require(initialBalance > 0, "StandardERC20: supply cannot be zero");

        _setupDecimals(decimals);

        _mint(_msgSender(), initialBalance);
    }
}
