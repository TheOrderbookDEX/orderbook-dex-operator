// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.20;

import { OperatorBase } from "./OperatorBase.sol";
import { IOperatorBase } from "./interfaces/IOperatorBase.sol";
import { IOperatorERC20, ERC20AndAmount } from "./interfaces/IOperatorERC20.sol";
import { IAddressBook } from "@frugalwizard/addressbook/contracts/interfaces/IAddressBook.sol";
import { IOrderbook } from "@theorderbookdex/orderbook-dex/contracts/interfaces/IOrderbook.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Proxy } from "@openzeppelin/contracts/proxy/Proxy.sol";
import { ERC1967Upgrade } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Upgrade.sol";

/**
 * Operator ERC20 functionality.
 */
contract OperatorERC20 is OperatorBase, IOperatorERC20 {
    function withdrawERC20(ERC20AndAmount[] calldata tokensAndAmounts) external onlyOwner {
        for (uint256 i = 0; i < tokensAndAmounts.length; i++) {
            tokensAndAmounts[i].token.transfer(msg.sender, tokensAndAmounts[i].amount);
        }
    }
}
