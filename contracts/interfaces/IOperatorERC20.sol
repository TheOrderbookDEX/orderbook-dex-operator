// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import { IOperatorBase } from "./IOperatorBase.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * Operator ERC20 functionality.
 */
interface IOperatorERC20 is IOperatorBase {
    /**
     * Withdraw ERC20 tokens from the operator.
     *
     * @param tokensAndAmounts the tokens and amounts to withdraw
     */
    function withdrawERC20(ERC20AndAmount[] calldata tokensAndAmounts) external;
}

/**
 * A ERC20 token and amount tuple.
 */
struct ERC20AndAmount {
    IERC20 token;
    uint256 amount;
}
