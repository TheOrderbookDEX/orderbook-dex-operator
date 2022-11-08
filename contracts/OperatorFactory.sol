// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.17;

import { IOperatorFactory } from "./interfaces/IOperatorFactory.sol";
import { IAddressBook } from "@frugal-wizard/addressbook/contracts/interfaces/IAddressBook.sol";
import { Operator } from "./Operator.sol";
import { Address } from "@openzeppelin/contracts/utils/Address.sol";

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
 *
 * The factory acts as the proxy admin of the operators created by it.
 */
contract OperatorFactory is IOperatorFactory {
    /**
     * The operator version manager.
     */
    address private immutable _versionManager;

    /**
     * The address book.
     */
    IAddressBook private immutable _addressBook;

    /**
     * Operator version implementations.
     */
    mapping(uint32 => address) private _implementations;

    /**
     * Operators.
     */
    mapping(address => Operator) private _operators;

    /**
     * Constructor.
     *
     * @param versionManager_ the operator version manager
     * @param addressBook_    the address book
     */
    constructor(address versionManager_, IAddressBook addressBook_) {
        _versionManager = versionManager_;
        _addressBook = addressBook_;
    }

    function registerVersion(uint32 version_, address implementation_) external {
        if (msg.sender != _versionManager) {
            revert Unauthorized();
        }
        if (_implementations[version_] != address(0)) {
            revert VersionAlreadyRegistered();
        }
        if (!Address.isContract(implementation_)) {
            revert InvalidImplementation();
        }
        _implementations[version_] = implementation_;
        emit OperatorVersionRegistered(version_, implementation_);
    }

    function createOperator(uint32 version_) external returns (address) {
        address owner_ = msg.sender;
        if (address(_operators[owner_]) != address(0)) {
            revert OperatorAlreadyCreated();
        }
        address implementation_ = _implementations[version_];
        if (implementation_ == address(0)) {
            revert InvalidVersion();
        }
        Operator newOperator = new Operator(address(this), owner_, implementation_, _addressBook);
        _operators[owner_] = newOperator;
        emit OperatorCreated(owner_, address(newOperator));
        return address(newOperator);
    }

    function updateOperator(uint32 version_) external {
        Operator operator_ = _operators[msg.sender];
        if (address(operator_) == address(0)) {
            revert NoOperatorCreated();
        }
        address implementation_ = _implementations[version_];
        if (implementation_ == address(0)) {
            revert InvalidVersion();
        }
        operator_.upgradeTo(implementation_);
    }

    function versionManager() public view returns (address) {
        return _versionManager;
    }

    function versionImplementation(uint32 version_) public view returns (address) {
        return _implementations[version_];
    }

    function addressBook() public view returns (IAddressBook) {
        return _addressBook;
    }

    function operator(address owner_) public view returns (address) {
        return address(_operators[owner_]);
    }
}
