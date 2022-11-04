// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.15;

import { StorageSlot } from "@openzeppelin/contracts/utils/StorageSlot.sol";

/**
 * Library for getting and setting the operator owner.
 */
library OperatorOwner {
    /**
     * Slot where the owner is stored.
     *
     * The XOR operation changes one bit to get a value whose preimage is, hopefully, not known.
     */
    bytes32 private constant OWNER_SLOT = keccak256("owner") ^ bytes32(uint(1));

    /**
     * Get the operator owner.
     *
     * @return owner the operator owner
     */
    function getOwner() internal view returns (address owner) {
        return StorageSlot.getAddressSlot(OWNER_SLOT).value;
    }

    /**
     * Set the operator owner.
     *
     * @param owner the operator owner
     */
    function setOwner(address owner) internal {
        StorageSlot.getAddressSlot(OWNER_SLOT).value = owner;
    }
}
