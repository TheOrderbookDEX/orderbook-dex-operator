import { formatValue, Transaction } from '@frugal-wizard/abi2ts-lib';
import { AddContextFunction } from '@frugal-wizard/contract-test-helper';
import { SellAtMarketResult } from '../../src/interfaces/IOperator';
import { OrderbookOperationContext, OrderbookOperationScenario, OrderbookOperationScenarioProperties } from './OrderbookOperationScenario';

export interface SellAtMarketScenarioProperties extends OrderbookOperationScenarioProperties {
    readonly maxAmount: bigint;
    readonly minPrice: bigint;
    readonly extraData: string;
}

export class SellAtMarketScenario extends OrderbookOperationScenario<Transaction, SellAtMarketResult> {
    readonly maxAmount: bigint;
    readonly minPrice: bigint;
    readonly extraData: string;

    constructor({
        maxAmount,
        minPrice,
        extraData,
        ...rest
    }: SellAtMarketScenarioProperties) {
        super(rest);
        this.maxAmount = maxAmount;
        this.minPrice = minPrice;
        this.extraData = extraData;
    }

    addContext(addContext: AddContextFunction): void {
        addContext('maxAmount', String(this.maxAmount));
        addContext('minPrice', formatValue(this.minPrice));
        addContext('extraData', this.extraData);
        super.addContext(addContext);
    }

    async execute({ operator, orderbook, [this.caller]: from }: OrderbookOperationContext) {
        return await operator.sellAtMarket(orderbook, this.maxAmount, this.minPrice, this.extraData, { from });
    }

    async executeStatic({ operator, orderbook, [this.caller]: from }: OrderbookOperationContext) {
        return await operator.callStatic.sellAtMarket(orderbook, this.maxAmount, this.minPrice, this.extraData, { from });
    }

    get amountSold() {
        return 1n;
    }

    get amountReceived() {
        return 2n;
    }

    get failed() {
        return false;
    }

    get error() {
        return '0x';
    }
}
