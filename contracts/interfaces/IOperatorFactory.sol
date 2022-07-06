// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import { IOperatorLogicRegistry } from "./IOperatorLogicRegistry.sol";
import { IAddressBook } from "addressbook/contracts/interfaces/IAddressBook.sol";

/**
 * Operator factory.
 *
 * All operators created by this factory use the same operator logic registry and
 * address book.
 */
interface IOperatorFactory {
    /**
     * Event emitted when an operator is created.
     *
     * @param owner     the owner of the operator
     * @param operator  the address of the operator
     */
    event OperatorCreated(address owner, address operator);

    /**
     * Error thrown when trying to create an operator and the caller has created
     * one already.
     */
    error OperatorAlreadyCreated();

    /**
     * Create an operator.
     *
     * Will fail if the caller has already created an operator.
     *
     * @return the address of the operator
     */
    function createOperator() external returns (address);

    /**
     * The operator logic registry.
     *
     * @return the operator logic registry
     */
    function logicRegistry() external view returns (IOperatorLogicRegistry);

    /**
     * The address book.
     *
     * @return the address book
     */
    function addressBook() external view returns (IAddressBook);

    /**
     * Addresses of operators.
     *
     * @param owner the owner of the operator
     * @return      the address of the operator
     */
    function operator(address owner) external view returns (address);
}
