import { formatValue, Transaction } from 'abi2ts-lib';
import { AddContextFunction } from 'contract-test-helper';
import { PlaceSellOrderResult } from '../../src/interfaces/IOperator';
import { OrderbookOperationContext, OrderbookOperationScenario, OrderbookOperationScenarioProperties } from './OrderbookOperationScenario';

export interface PlaceSellOrderScenarioProperties extends OrderbookOperationScenarioProperties {
    readonly maxAmount: bigint;
    readonly price: bigint;
    readonly extraData: string;
}

export class PlaceSellOrderScenario extends OrderbookOperationScenario<Transaction, PlaceSellOrderResult> {
    readonly maxAmount: bigint;
    readonly price: bigint;
    readonly extraData: string;

    constructor({
        maxAmount,
        price,
        extraData,
        ...rest
    }: PlaceSellOrderScenarioProperties) {
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
        return await operator.placeSellOrder(orderbook, this.maxAmount, this.price, this.extraData, { from });
    }

    async executeStatic({ operator, orderbook, [this.caller]: from }: OrderbookOperationContext) {
        return await operator.callStatic.placeSellOrder(orderbook, this.maxAmount, this.price, this.extraData, { from });
    }

    get amountSold() {
        return 1n;
    }

    get amountReceived() {
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
