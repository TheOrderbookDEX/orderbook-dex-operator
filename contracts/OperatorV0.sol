// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.15;

import { OperatorBase } from "./OperatorBase.sol";
import { OperatorERC20 } from "./OperatorERC20.sol";
import { IOperatorV0 } from "./interfaces/IOperatorV0.sol";

contract OperatorV0 is OperatorBase, OperatorERC20, IOperatorV0 {
}
