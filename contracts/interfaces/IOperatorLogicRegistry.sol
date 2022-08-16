// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

/**
 * Registry of OperatorLogic for each orderbook version.
 *
 * Once a version has been registered, it cannot be changed.
 */
interface IOperatorLogicRegistry {
    /**
     * Register the OperatorLogic of an orderbook version.
     *
     * Once a version has been registered, it cannot be changed.
     *
     * @param version the orderbook version
     * @param logic   the address of the OperatorLogic
     */
    function register(uint32 version, address logic) external;

    /**
     * The owner of the registry (the deployer).
     *
     * @return the owner of the registry (the deployer)
     */
    function owner() external view returns(address);

    /**
     * The operator logic registry.
     *
     * @param version the orderbook version
     * @return the address of the operator logic
     */
    function operatorLogic(uint32 version) external view returns(address);
}
