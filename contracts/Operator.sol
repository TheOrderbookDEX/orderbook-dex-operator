// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.15;

import { IOperatorBase, ERC20AndAmount } from "./interfaces/IOperatorBase.sol";
import { IOperatorLogicRegistry } from "./interfaces/IOperatorLogicRegistry.sol";
import { IAddressBook } from "@theorderbookdex/addressbook/contracts/interfaces/IAddressBook.sol";
import { IOrderbook } from "@theorderbookdex/orderbook-dex/contracts/interfaces/IOrderbook.sol";
import { Address } from "@openzeppelin/contracts/utils/Address.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// TODO add withdrawERC721
// TODO add withdrawERC1155

/**
 * Operator.
 *
 * This contract interacts with orderbooks on behalf of an user, providing
 * a more user friendly interface. It acts as wallet for assets to be traded,
 * the user has to transfer the funds they want to trade with to the operator.
 *
 * All functions can only be called by the owner.
 */
contract Operator is IOperatorBase {
    using Address for address;

    /**
     * The owner of the operator.
     */
    address private immutable _owner;

    /**
     * The operator logic registry used by the operator.
     */
    IOperatorLogicRegistry private immutable _logicRegistry;

    /**
     * Constructor.
     *
     * The operator registers itself to the address book on creation.
     *
     * @param owner_         the owner of the operator
     * @param logicRegistry_ the operator logic registry used by the operator
     * @param addressBook    the address book
     */
    constructor(address owner_, IOperatorLogicRegistry logicRegistry_, IAddressBook addressBook) {
        _owner = owner_;
        _logicRegistry = logicRegistry_;
        addressBook.register();
    }

    function withdrawERC20(ERC20AndAmount[] calldata tokensAndAmounts) external {
        if (msg.sender != _owner) {
            revert Unauthorized();
        }
        for (uint256 i = 0; i < tokensAndAmounts.length; i++) {
            tokensAndAmounts[i].token.transfer(msg.sender, tokensAndAmounts[i].amount);
        }
    }

    function owner() external view returns(address) {
        return _owner;
    }

    function logicRegistry() external view returns(IOperatorLogicRegistry) {
        return _logicRegistry;
    }

    fallback(bytes calldata input) external returns (bytes memory) {
        if (msg.sender != _owner) {
            revert Unauthorized();
        }
        // First argument should always be the orderbook address
        IOrderbook orderbook = IOrderbook(abi.decode(input[4:], (address)));
        // Get the operator logic for the orderbook version
        address operatorLogic = _logicRegistry.operatorLogic(orderbook.version());
        if (operatorLogic == address(0)) {
            revert OrderbookVersionNotSupported();
        }
        return operatorLogic.functionDelegateCall(input);
    }
}
