// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.15;

import { IOperatorLogicRegistry } from "./interfaces/IOperatorLogicRegistry.sol";

/**
 * Registry of OperatorLogic for each orderbook version.
 *
 * Once a version has been registered, it cannot be changed.
 */
contract OperatorLogicRegistry is IOperatorLogicRegistry {
    /**
     * The owner of the registry (the deployer).
     */
    address private immutable _owner;

    /**
     * The operator logic registry.
     */
    mapping(uint32 => address) private _operatorLogic;

    /**
     * Constructor.
     *
     * Owner is set to deployer.
     */
    constructor() {
        _owner = msg.sender;
    }

    function register(uint32 version, address logic) external {
        require(msg.sender == _owner);
        require(_operatorLogic[version] == address(0));
        _operatorLogic[version] = logic;
    }

    function owner() external view returns(address) {
        return _owner;
    }

    function operatorLogic(uint32 version) external view returns(address) {
        return _operatorLogic[version];
    }
}
