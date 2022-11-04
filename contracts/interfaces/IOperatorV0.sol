// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import { IOperatorBase } from "./IOperatorBase.sol";
import { IOperatorERC20 } from "./IOperatorERC20.sol";

interface IOperatorV0 is IOperatorBase, IOperatorERC20 {
}
