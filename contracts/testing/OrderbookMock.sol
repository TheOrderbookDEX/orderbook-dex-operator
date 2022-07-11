// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.15;

import { IOrderbook } from "@theorderbookdex/orderbook-dex/contracts/interfaces/IOrderbook.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract OrderbookMock is IOrderbook {
    uint32 _version;

    constructor(uint32 version_) {
        _version = version_;
    }

    function version() external view returns (uint32) {
        return _version;
    }

    function tradedToken() external pure returns (IERC20) {
        revert("Not implemented");
    }

    function baseToken() external pure returns (IERC20) {
        revert("Not implemented");
    }

    function contractSize() external pure returns (uint256) {
        revert("Not implemented");
    }

    function priceTick() external pure returns (uint256) {
        revert("Not implemented");
    }
}
