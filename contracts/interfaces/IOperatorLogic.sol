// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

/**
 * Return value of buyAtMarket call.
 */
struct BuyAtMarketResult {
    /**
     * The amount of contracts bought.
     */
    uint256 amountBought;

    /**
     * The amount of base token paid.
     */
    uint256 amountPaid;

    /**
     * True if the operation failed.
     */
    bool failed;

    /**
     * The raw error data.
     */
    bytes error;
}

/**
 * Return value of sellAtMarket call.
 */
struct SellAtMarketResult {
    /**
     * The amount of contracts sold.
     */
    uint256 amountSold;

    /**
     * The amount of traded token received.
     */
    uint256 amountReceived;

    /**
     * True if the operation failed.
     */
    bool failed;

    /**
     * The raw error data.
     */
    bytes error;
}

/**
 * Return value of placeBuyOrder call.
 */
struct PlaceBuyOrderResult {
    /**
     * The amount of contracts bought.
     *
     * This might be non zero even if the operation fails, which means it managed to buy some
     * before failing.
     */
    uint256 amountBought;

    /**
     * The amount of base token paid.
     *
     * This might be non zero even if the operation fails, which means it managed to buy some
     * before failing.
     */
    uint256 amountPaid;

    /**
     * The amount of contracts of the placed order.
     */
    uint256 amountPlaced;

    /**
     * The encoded order id.
     */
    bytes orderId;

    /**
     * True if the operation failed.
     */
    bool failed;

    /**
     * The raw error data.
     */
    bytes error;
}

/**
 * Return value of placeSellOrder call.
 */
struct PlaceSellOrderResult {
    /**
     * The amount of contracts sold.
     *
     * This might be non zero even if the operation fails, which means it managed to sell some
     * before failing.
     */
    uint256 amountSold;

    /**
     * The amount of traded token received.
     *
     * This might be non zero even if the operation fails, which means it managed to sell some
     * before failing.
     */
    uint256 amountReceived;

    /**
     * The amount of contracts of the placed order.
     */
    uint256 amountPlaced;

    /**
     * The encoded order id.
     */
    bytes orderId;

    /**
     * True if the operation failed.
     */
    bool failed;

    /**
     * The raw error data.
     */
    bytes error;
}

/**
 * Return value of claimOrder call.
 */
struct ClaimOrderResult {
    /**
     * The amount of contracts claimed.
     */
    uint256 amountClaimed;

    /**
     * True if the operation failed.
     */
    bool failed;

    /**
     * The raw error data.
     */
    bytes error;
}

/**
 * Return value of transferOrder call.
 */
struct TransferOrderResult {
    /**
     * True if the operation failed.
     */
    bool failed;

    /**
     * The raw error data.
     */
    bytes error;
}

/**
 * Return value of cancelOrder call.
 */
struct CancelOrderResult {
    /**
     * The amount of contracts canceled.
     */
    uint256 amountCanceled;

    /**
     * True if the operation failed.
     */
    bool failed;

    /**
     * The raw error data.
     */
    bytes error;
}

/**
 * Operator logic.
 *
 * All functions must not modify the contract's storage. Because of this, it's
 * preferable that the implementation is provided as a library rather than as a
 * contract.
 *
 * The first argument of all functions must always be the address of the orderbook
 * to operate on. It's the caller's responsibility to check the version of the
 * orderbook and call the appropriate operator logic.
 */
interface IOperatorLogic {
    /**
     * Event emitted to provide feedback when an error is thrown by the orderbook.
     *
     * @param error the raw error data
     */
    event Failed(bytes error);

    /**
     * Event emitted to provide feedback after a buyAtMarket call.
     *
     * @param amountBought  the amount of contracts bought
     * @param amountPaid    the amount of base token paid
     */
    event BoughtAtMarket(uint256 amountBought, uint256 amountPaid);

    /**
     * Event emitted to provide feedback after a sellAtMarket call.
     *
     * @param amountSold        the amount of contracts sold
     * @param amountReceived    the amount of traded token received
     */
    event SoldAtMarket(uint256 amountSold, uint256 amountReceived);

    /**
     * Event emitted to provide feedback after a placeBuyOrder call.
     *
     * @param amount    the amount of contracts of the placed order
     * @param orderId   the encoded order id
     */
    event PlacedBuyOrder(uint256 amount, bytes orderId);

    /**
     * Event emitted to provide feedback after a placeSellOrder call.
     *
     * @param amount    the amount of contracts of the placed order
     * @param orderId   the encoded order id
     */
    event PlacedSellOrder(uint256 amount, bytes orderId);

    /**
     * Event emitted to provide feedback after a claimOrder call.
     *
     * @param amount    the amount of contracts claimed
     */
    event OrderClaimed(uint256 amount);

    /**
     * Event emitted to provide feedback after a transferOrder call.
     */
    event OrderTransfered();

    /**
     * Event emitted to provide feedback after a cancelOrder call.
     *
     * @param amount    the amount of contracts canceled
     */
    event OrderCanceled(uint256 amount);

    /**
     * Buy at market.
     *
     * @param orderbook the orderbook
     * @param maxAmount the maximum amount of contracts to buy
     * @param maxPrice  the maximum price to pay for contract
     * @param extraData extra data that might be required by the operation
     *
     * Emits a {BoughtAtMarket} event if it manages to buy any amount.
     *
     * Emits a {Failed} if there is an error when calling the orderbook contract.
     */
    function buyAtMarket(address orderbook, uint256 maxAmount, uint256 maxPrice, bytes calldata extraData) external
        returns (BuyAtMarketResult memory result);

    /**
     * Sell at market.
     *
     * @param orderbook the orderbook
     * @param maxAmount the maximum amount of contracts to sell
     * @param minPrice  the minimum price to pay for contract
     * @param extraData extra data that might be required by the operation
     *
     * Emits a {SoldAtMarket} event if it manages to sell any amount.
     *
     * Emits a {Failed} if there is an error when calling the orderbook contract.
     */
    function sellAtMarket(address orderbook, uint256 maxAmount, uint256 minPrice, bytes calldata extraData) external
        returns (SellAtMarketResult memory result);

    /**
     * Place buy order.
     *
     * If the bid price is at or above the provided price, it will attempt to buy at market first, and place an
     * order for the remainder.
     *
     * @param orderbook the orderbook
     * @param maxAmount the maximum amount of contracts to buy
     * @param price     the price to pay for contract
     * @param extraData extra data that might be required by the operation
     *
     * Emits a {BoughtAtMarket} event if it manages to buy any amount.
     *
     * Emits a {PlacedBuyOrder} event if it manages to place an order.
     *
     * Emits a {Failed} if there is an error when calling the orderbook contract.
     */
    function placeBuyOrder(address orderbook, uint256 maxAmount, uint256 price, bytes calldata extraData) external
        returns (PlaceBuyOrderResult memory result);

    /**
     * Place sell order.
     *
     * If the ask price is at or below the provided price, it will attempt to sell at market first, and place an
     * order for the remainder.
     *
     * Emits a {SoldAtMarket} event if it manages to sell any amount.
     *
     * Emits a {PlacedSellOrder} event if it manages to place an order.
     *
     * Emits a {Failed} if there is an error when calling the orderbook contract.
     *
     * @param orderbook the orderbook
     * @param maxAmount the maximum amount of contracts to sell
     * @param price     the price to pay for contract
     * @param extraData extra data that might be required by the operation
     */
    function placeSellOrder(address orderbook, uint256 maxAmount, uint256 price, bytes calldata extraData) external
        returns (PlaceSellOrderResult memory result);

    /**
     * Claim an order.
     *
     * Emits a {OrderClaimed} event if it manages to claim any amount.
     *
     * Emits a {Failed} if there is an error when calling the orderbook contract.
     *
     * @param orderbook the orderbook
     * @param orderId   the encoded order id
     * @param extraData extra data that might be required by the operation
     */
    function claimOrder(address orderbook, bytes calldata orderId, bytes calldata extraData) external
        returns (ClaimOrderResult memory result);

    /**
     * Transfer an order.
     *
     * Emits a {OrderTransfered} event if it manages to transfer the order.
     *
     * Emits a {Failed} if there is an error when calling the orderbook contract.
     *
     * @param orderbook the orderbook
     * @param orderId   the encoded order id
     * @param recipient the recipient of the transfer
     */
    function transferOrder(address orderbook, bytes calldata orderId, address recipient) external
        returns (TransferOrderResult memory result);

    /**
     * Cancel an order.
     *
     * Emits a {OrderCanceled} event if it manages to cancel the order.
     *
     * Emits a {Failed} if there is an error when calling the orderbook contract.
     *
     * @param orderbook the orderbook
     * @param orderId   the encoded order id
     * @param extraData extra data that might be required by the operation
     */
    function cancelOrder(address orderbook, bytes calldata orderId, bytes calldata extraData) external
        returns (CancelOrderResult memory result);
}
