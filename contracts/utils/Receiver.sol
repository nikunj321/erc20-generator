// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

/**
 * @title Receiver
 * @author ERC20 Generator (https://vittominacori.github.io/erc20-generator)
 * @dev Implementation of the Receiver
 */
contract Receiver {

    constructor (address payable feeReceiver) payable {
        require(feeReceiver != address(0), "Receiver: fee to the zero address");
        require(msg.value > 0, "Receiver: fee must be greater than zero");

        feeReceiver.transfer(msg.value);
    }
}
