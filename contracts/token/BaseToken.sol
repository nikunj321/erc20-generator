// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "@vittominacori/erc20-token/contracts/ERC20Base.sol";

import "../utils/GeneratorCopyright.sol";

/**
 * @title BaseToken
 * @author ERC20 Generator (https://vittominacori.github.io/erc20-generator)
 * @dev Implementation of the BaseToken
 */
contract BaseToken is ERC20Base, GeneratorCopyright  {

  constructor (
    string memory name,
    string memory symbol,
    uint8 decimals,
    uint256 cap,
    uint256 initialSupply,
    bool transferEnabled,
    bool mintingFinished
  ) ERC20Base(name, symbol, decimals, cap, initialSupply, transferEnabled, mintingFinished) {}
}
