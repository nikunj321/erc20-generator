#!/usr/bin/env bash

for contract in "SimpleERC20" "MintableBurnableERC20"
do
  truffle-flattener contracts/token/$contract.sol > dist/$contract.dist.sol
done
