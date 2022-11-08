// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.17;

import { IOperatorBase } from "./interfaces/IOperatorBase.sol";
import { OperatorOwner } from "./OperatorOwner.sol";
import { StorageSlot } from "@openzeppelin/contracts/utils/StorageSlot.sol";

/**
 * Operator implementation base contract.
 *
 * Operator implementations MUST have this contract as the first inherited.
 *
 * Operator implementations SHOULD NOT have a constructor.
 *
 * Operator implementations SHOULD NOT have state variables nor change the
 * contract state in any way.
 */
contract OperatorBase is IOperatorBase {
    /**
     * Modifier for functions that can only be called by the owner.
     *
     * All state modifying functions should be marked as onlyOwner.
     */
    modifier onlyOwner() {
        if (msg.sender != owner()) {
            revert Unauthorized();
        }
        _;
    }

    function owner() public view returns (address) {
        return OperatorOwner.getOwner();
    }

    function implementation() public view returns (address) {
        // Storage slot for the implementation as defined by EIP-1967
        return StorageSlot.getAddressSlot(0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc).value;
    }
}
