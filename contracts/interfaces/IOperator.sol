// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import { IOperatorBase } from "./IOperatorBase.sol";
import { IOperatorLogic } from "./IOperatorLogic.sol";

/**
 * Operator.
 *
 * This contract interacts with orderbooks on behalf of an user, providing
 * a more user friendly interface. It acts as wallet for assets to be traded,
 * the user has to transfer the funds they want to trade with to the operator.
 *
 * All functions can only be called by the owner.
 */
interface IOperator is IOperatorBase, IOperatorLogic {
}
