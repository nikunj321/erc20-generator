#!/usr/bin/env bash

for contract in "BaseToken" "SimpleERC20"
do
  truffle-flattener contracts/token/$contract.sol > dist/$contract.dist.sol
done
