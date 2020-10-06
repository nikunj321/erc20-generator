#!/usr/bin/env bash

npm run flat

for contract in "SimpleERC20" "StandardERC20" "CommonERC20"
do
  surya inheritance dist/$contract.dist.sol | dot -Tpng > analysis/inheritance-tree/$contract.png

  surya graph dist/$contract.dist.sol | dot -Tpng > analysis/control-flow/$contract.png

  surya mdreport analysis/description-table/$contract.md dist/$contract.dist.sol

  sol2uml dist/$contract.dist.sol -o analysis/uml/$contract.svg
done
