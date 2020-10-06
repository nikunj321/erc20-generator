#!/usr/bin/env bash

for contract in "SimpleERC20" "StandardERC20" "CommonERC20"
do
  truffle-flattener contracts/token/ERC20/$contract.sol > dist/$contract.dist.sol
done
