import { formatValue, Transaction } from 'abi2ts-lib';
import { AddContextFunction } from 'contract-test-helper';
import { BuyAtMarketResult } from '../../src/interfaces/IOperator';
import { OrderbookOperationContext, OrderbookOperationScenario, OrderbookOperationScenarioProperties } from './OrderbookOperationScenario';

export interface BuyAtMarketScenarioProperties extends OrderbookOperationScenarioProperties {
    readonly maxAmount: bigint;
    readonly maxPrice: bigint;
    readonly extraData: string;
}

export class BuyAtMarketScenario extends OrderbookOperationScenario<Transaction, BuyAtMarketResult> {
    readonly maxAmount: bigint;
    readonly maxPrice: bigint;
    readonly extraData: string;

    constructor({
        maxAmount,
        maxPrice,
        extraData,
        ...rest
    }: BuyAtMarketScenarioProperties) {
        super(rest);
        this.maxAmount = maxAmount;
        this.maxPrice = maxPrice;
        this.extraData = extraData;
    }

    addContext(addContext: AddContextFunction): void {
        addContext('maxAmount', String(this.maxAmount));
        addContext('maxPrice', formatValue(this.maxPrice));
        addContext('extraData', this.extraData);
        super.addContext(addContext);
    }

    async execute({ operator, orderbook, [this.caller]: from }: OrderbookOperationContext) {
        return await operator.buyAtMarket(orderbook, this.maxAmount, this.maxPrice, this.extraData, { from });
    }

    async executeStatic({ operator, orderbook, [this.caller]: from }: OrderbookOperationContext) {
        return await operator.callStatic.buyAtMarket(orderbook, this.maxAmount, this.maxPrice, this.extraData, { from });
    }

    get amountBought() {
        return 1n;
    }

    get amountPaid() {
        return 2n;
    }

    get failed() {
        return false;
    }

    get error() {
        return '0x';
    }
}
