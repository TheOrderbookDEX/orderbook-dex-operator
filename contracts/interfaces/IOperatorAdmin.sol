// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

/**
 * Operator admin functionality.
 *
 * These are the functions that only the proxy admin can call.
 */
interface IOperatorAdmin {
    /**
     * Update the proxy implementation.
     *
     * @param implementation the new proxy implementation
     */
    function upgradeTo(address implementation) external;
}
