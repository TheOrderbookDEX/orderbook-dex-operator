// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.20;

import { IOperatorAdmin } from "./interfaces/IOperatorAdmin.sol";
import { IAddressBook } from "@frugalwizard/addressbook/contracts/interfaces/IAddressBook.sol";
import { Proxy } from "@openzeppelin/contracts/proxy/Proxy.sol";
import { ERC1967Upgrade } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Upgrade.sol";
import { OperatorOwner } from "./OperatorOwner.sol";

/**
 * The Operator.
 *
 * This contract is based on OpenZeppelin's TransparentUpgradeableProxy.
 */
contract Operator is Proxy, ERC1967Upgrade, IOperatorAdmin {
    /**
     * Constructor.
     *
     * The proxy admin should be the OperatorFactory creating this Operator.
     *
     * The operator registers itself to the address book on creation.
     *
     * @param admin          the proxy admin
     * @param owner          the operator owner
     * @param implementation the operator implementation
     * @param addressBook    the address book
     */
    constructor(address admin, address owner, address implementation, IAddressBook addressBook) {
        _changeAdmin(admin);
        OperatorOwner.setOwner(owner);
        _upgradeTo(implementation);
        addressBook.register();
    }

    /**
     * Modifier for functions that are only accessible to the proxy admin.
     */
    modifier ifAdmin() {
        if (msg.sender == _getAdmin()) {
            _;
        } else {
            _fallback();
        }
    }

    function upgradeTo(address implementation) external ifAdmin {
        _upgradeTo(implementation);
    }

    function _implementation() internal view override returns (address) {
        return _getImplementation();
    }

    function _beforeFallback() internal override {
        // The proxy admin should not have access to the fallback
        // check OpenZeppelin's docs of TransparentUpgradeableProxy for the reason why
        require(msg.sender != _getAdmin());
        super._beforeFallback();
    }
}
