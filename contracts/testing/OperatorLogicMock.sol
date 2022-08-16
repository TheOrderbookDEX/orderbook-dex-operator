// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.15;

import {
    BuyAtMarketResult, SellAtMarketResult, PlaceBuyOrderResult, PlaceSellOrderResult, ClaimOrderResult,
    TransferOrderResult, CancelOrderResult
} from "../interfaces/IOperatorLogic.sol";

library OperatorLogicMock {
    event BuyAtMarketCalled(address sender, address orderbook, uint256 maxAmount, uint256 maxPrice, bytes extraData);

    event SellAtMarketCalled(address sender, address orderbook, uint256 maxAmount, uint256 maxPrice, bytes extraData);

    event PlaceBuyOrderCalled(address sender, address orderbook, uint256 maxAmount, uint256 price, bytes extraData);

    event PlaceSellOrderCalled(address sender, address orderbook, uint256 maxAmount, uint256 price, bytes extraData);

    event ClaimOrderCalled(address sender, address orderbook, bytes orderId, bytes extraData);

    event TransferOrderCalled(address sender, address orderbook, bytes orderId, address recipient);

    event CancelOrderCalled(address sender, address orderbook, bytes orderId, bytes extraData);

    function buyAtMarket(address orderbook, uint256 maxAmount, uint256 maxPrice, bytes calldata extraData) external
        returns (BuyAtMarketResult memory result)
    {
        emit BuyAtMarketCalled(msg.sender, orderbook, maxAmount, maxPrice, extraData);
        result.amountBought = 1;
        result.amountPaid = 2;
    }

    function sellAtMarket(address orderbook, uint256 maxAmount, uint256 minPrice, bytes calldata extraData) external
        returns (SellAtMarketResult memory result)
    {
        emit SellAtMarketCalled(msg.sender, orderbook, maxAmount, minPrice, extraData);
        result.amountSold = 1;
        result.amountReceived = 2;
    }

    function placeBuyOrder(address orderbook, uint256 maxAmount, uint256 price, bytes calldata extraData) external
        returns (PlaceBuyOrderResult memory result)
    {
        emit PlaceBuyOrderCalled(msg.sender, orderbook, maxAmount, price, extraData);
        result.amountBought = 1;
        result.amountPaid = 2;
        result.amountPlaced = 3;
        result.orderId = hex'04';
    }

    function placeSellOrder(address orderbook, uint256 maxAmount, uint256 price, bytes calldata extraData) external
        returns (PlaceSellOrderResult memory result)
    {
        emit PlaceSellOrderCalled(msg.sender, orderbook, maxAmount, price, extraData);
        result.amountSold = 1;
        result.amountReceived = 2;
        result.amountPlaced = 3;
        result.orderId = hex'04';
    }

    function claimOrder(address orderbook, bytes calldata orderId, bytes calldata extraData) external
        returns (ClaimOrderResult memory result)
    {
        emit ClaimOrderCalled(msg.sender, orderbook, orderId, extraData);
        result.amountClaimed = 1;
    }

    function transferOrder(address orderbook, bytes calldata orderId, address recipient) external
        returns (TransferOrderResult memory result)
    {
        emit TransferOrderCalled(msg.sender, orderbook, orderId, recipient);
        result.failed = false;
    }

    function cancelOrder(address orderbook, bytes calldata orderId, bytes calldata extraData) external
        returns (CancelOrderResult memory result)
    {
        emit CancelOrderCalled(msg.sender, orderbook, orderId, extraData);
        result.failed = false;
        result.amountCanceled = 1;
    }
}
