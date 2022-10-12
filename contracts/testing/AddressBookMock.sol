// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.15;

import { IAddressBook } from "@frugal-wizard/addressbook/contracts/interfaces/IAddressBook.sol";

contract AddressBookMock is IAddressBook {
    event RegisterCalled(address sender);

    error NotImplemented();

    function register() external returns (uint40) {
        emit RegisterCalled(msg.sender);
        return 0;
    }

    function lastId() external pure returns (uint40) {
        revert NotImplemented();
    }

    function id(address) external pure returns (uint40) {
        revert NotImplemented();
    }

    function addr(uint40) external pure returns (address) {
        revert NotImplemented();
    }
}
