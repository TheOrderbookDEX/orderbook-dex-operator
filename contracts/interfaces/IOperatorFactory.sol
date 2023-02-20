// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import { IAddressBook } from "@frugalwizard/addressbook/contracts/interfaces/IAddressBook.sol";

/**
 * The Operator factory.
 *
 * Operator implementation is determined by a version number. Creating or updating
 * an operator requires a version number is provided, and that version number has
 * a corresponding implementation registered.
 *
 * Operator versions can only be registered by the version manager. Once a version
 * has been registered it cannot be changed.
 *
 * All operators created by a factory use the address book defined by the factory.
 */
interface IOperatorFactory {
    /**
     * Event emitted when an operator version is registered.
     *
     * @param version        the operator version
     * @param implementation the operator implementation
     */
    event OperatorVersionRegistered(uint32 version, address implementation);

    /**
     * Event emitted when an operator is created.
     *
     * @param owner    the operator owner
     * @param operator the operator
     */
    event OperatorCreated(address owner, address operator);

    /**
     * Error thrown when a function is called by someone not allowed to.
     */
    error Unauthorized();

    /**
     * Error thrown when trying to register an already registered operator version.
     */
    error VersionAlreadyRegistered();

    /**
     * Error thrown when trying to create an operator and the caller has created
     * one already.
     */
    error OperatorAlreadyCreated();

    /**
     * Error thrown when trying to update an operator without having created one.
     */
    error NoOperatorCreated();

    /**
     * Error thrown when using an operator version with no implementation.
     */
    error InvalidVersion();

    /**
     * Error thrown when trying to register an implementation that is not a contract.
     */
    error InvalidImplementation();

    /**
     * Register an operator version.
     *
     * Can only be called by the version manager.
     *
     * Will fail if the operator version has already been registered.
     *
     * @param version        the operator version
     * @param implementation the operator implementation
     */
    function registerVersion(uint32 version, address implementation) external;

    /**
     * Create an operator.
     *
     * Will fail if the caller has already created an operator.
     *
     * @param  version  the operator version
     * @return operator the created operator
     */
    function createOperator(uint32 version) external returns (address operator);

    /**
     * Update an operator.
     *
     * Will fail if the caller has not created an operator.
     *
     * @param version the operator version to update to
     */
    function updateOperator(uint32 version) external;

    /**
     * Get the operator version manager.
     *
     * @return versionManager the operator version manager
     */
    function versionManager() external view returns (address versionManager);

    /**
     * Get the implementation of an operator version.
     *
     * @param  version        the operator version
     * @return implementation the operator implementation
     */
    function versionImplementation(uint32 version) external view returns (address implementation);

    /**
     * Get the address book used by the factory.
     *
     * @return addressBook the address book
     */
    function addressBook() external view returns (IAddressBook addressBook);

    /**
     * Get the operator by owner.
     *
     * @param  owner    the operator owner
     * @return operator the operator
     */
    function operator(address owner) external view returns (address operator);
}
