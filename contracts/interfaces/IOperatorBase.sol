// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

/**
 * Operator implementation base functionality.
 */
interface IOperatorBase {
    /**
     * Event emitted to log an error.
     *
     * @param error the raw error data
     */
    event Failed(bytes error);

    /**
     * Error thrown when a function is called by someone not allowed to.
     */
    error Unauthorized();

    /**
     * Get the operator owner.
     *
     * @return owner the operator owner
     */
    function owner() external view returns (address owner);

    /**
     * Get the implementation.
     *
     * @return implementation the operator implementation
     */
    function implementation() external view returns (address implementation);
}
