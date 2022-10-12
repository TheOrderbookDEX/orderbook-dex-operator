// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.15;

import { IOperatorFactory } from "./interfaces/IOperatorFactory.sol";
import { IOperatorLogicRegistry } from "./interfaces/IOperatorLogicRegistry.sol";
import { IAddressBook } from "@frugal-wizard/addressbook/contracts/interfaces/IAddressBook.sol";
import { Operator } from "./Operator.sol";

/**
 * Operator factory.
 *
 * All operators created by this factory use the same operator logic registry and
 * address book.
 */
contract OperatorFactory is IOperatorFactory {
    /**
     * The operator logic registry.
     */
    IOperatorLogicRegistry private immutable _logicRegistry;

    /**
     * The address book.
     */
    IAddressBook private immutable _addressBook;

    /**
     * Addresses of operators.
     */
    mapping(address => address) _operator;

    /**
     * Constructor.
     *
     * @param logicRegistry_ the operator logic registry
     * @param addressBook_   the address book
     */
    constructor(IOperatorLogicRegistry logicRegistry_, IAddressBook addressBook_) {
        _logicRegistry = logicRegistry_;
        _addressBook = addressBook_;
    }

    function createOperator() external returns (address) {
        address owner = msg.sender;
        if (_operator[owner] != address(0)) {
            revert OperatorAlreadyCreated();
        }
        address newOperator = address(new Operator(owner, _logicRegistry, _addressBook));
        _operator[owner] = newOperator;
        emit OperatorCreated(owner, newOperator);
        return newOperator;
    }

    function logicRegistry() external view returns (IOperatorLogicRegistry) {
        return _logicRegistry;
    }

    function addressBook() external view returns (IAddressBook) {
        return _addressBook;
    }

    function operator(address owner) external view returns (address) {
        return _operator[owner];
    }
}
