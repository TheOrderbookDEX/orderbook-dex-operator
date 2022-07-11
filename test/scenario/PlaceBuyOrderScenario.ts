import { formatValue, Transaction } from '@theorderbookdex/abi2ts-lib';
import { AddContextFunction } from '@theorderbookdex/contract-test-helper';
import { PlaceBuyOrderResult } from '../../src/interfaces/IOperator';
import { OrderbookOperationContext, OrderbookOperationScenario, OrderbookOperationScenarioProperties } from './OrderbookOperationScenario';

export interface PlaceBuyOrderScenarioProperties extends OrderbookOperationScenarioProperties {
    readonly maxAmount: bigint;
    readonly price: bigint;
    readonly extraData: string;
}

export class PlaceBuyOrderScenario extends OrderbookOperationScenario<Transaction, PlaceBuyOrderResult> {
    readonly maxAmount: bigint;
    readonly price: bigint;
    readonly extraData: string;

    constructor({
        maxAmount,
        price,
        extraData,
        ...rest
    }: PlaceBuyOrderScenarioProperties) {
        super(rest);
        this.maxAmount = maxAmount;
        this.price = price;
        this.extraData = extraData;
    }

    addContext(addContext: AddContextFunction): void {
        addContext('maxAmount', String(this.maxAmount));
        addContext('price', formatValue(this.price));
        addContext('extraData', this.extraData);
        super.addContext(addContext);
    }

    async execute({ operator, orderbook, [this.caller]: from }: OrderbookOperationContext) {
        return await operator.placeBuyOrder(orderbook, this.maxAmount, this.price, this.extraData, { from });
    }

    async executeStatic({ operator, orderbook, [this.caller]: from }: OrderbookOperationContext) {
        return await operator.callStatic.placeBuyOrder(orderbook, this.maxAmount, this.price, this.extraData, { from });
    }

    get amountBought() {
        return 1n;
    }

    get amountPaid() {
        return 2n;
    }

    get amountPlaced() {
        return 3n;
    }

    get orderId() {
        return '0x04';
    }

    get failed() {
        return false;
    }

    get error() {
        return '0x';
    }
}
