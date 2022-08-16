// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import { IOperatorLogicRegistry } from "./IOperatorLogicRegistry.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * A ERC20 token and amount tuple.
 */
struct ERC20AndAmount {
    IERC20 token;
    uint256 amount;
}

/**
 * Operator base functionality.
 *
 * These are all the functions that the operator must provide itself, not proxy
 * to the OperatorLogic.
 */
interface IOperatorBase {
    /**
     * Error thrown when a function is called by someone not allowed to.
     */
    error Unauthorized();

    /**
     * Error thrown when the orderbook version is not yet supported by the operator.
     */
    error OrderbookVersionNotSupported();

    /**
     * Withdraw ERC20 tokens from the operator.
     *
     * @param tokensAndAmounts the tokens and amounts to withdraw
     */
    function withdrawERC20(ERC20AndAmount[] calldata tokensAndAmounts) external;

    /**
     * The owner of the operator.
     *
     * @return the owner of the operator
     */
    function owner() external view returns(address);

    /**
     * The operator logic registry used by the operator.
     *
     * @return the operator logic registry used by the operator
     */
    function logicRegistry() external view returns(IOperatorLogicRegistry);
}
