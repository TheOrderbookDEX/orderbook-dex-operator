import { Transaction } from '@theorderbookdex/abi2ts-lib';
import { AddContextFunction } from '@theorderbookdex/contract-test-helper';
import { CancelOrderResult } from '../../src/interfaces/IOperator';
import { OrderbookOperationContext, OrderbookOperationScenario, OrderbookOperationScenarioProperties } from './OrderbookOperationScenario';

export interface CancelOrderScenarioProperties extends OrderbookOperationScenarioProperties {
    readonly orderId: string;
    readonly extraData: string;
}

export class CancelOrderScenario extends OrderbookOperationScenario<Transaction, CancelOrderResult> {
    readonly orderId: string;
    readonly extraData: string;

    constructor({
        orderId,
        extraData,
        ...rest
    }: CancelOrderScenarioProperties) {
        super(rest);
        this.orderId = orderId;
        this.extraData = extraData;
    }

    addContext(addContext: AddContextFunction): void {
        addContext('orderId', this.orderId);
        addContext('extraData', this.extraData);
        super.addContext(addContext);
    }

    async execute({ operator, orderbook, [this.caller]: from }: OrderbookOperationContext) {
        return await operator.cancelOrder(orderbook, this.orderId, this.extraData, { from });
    }

    async executeStatic({ operator, orderbook, [this.caller]: from }: OrderbookOperationContext) {
        return await operator.callStatic.cancelOrder(orderbook, this.orderId, this.extraData, { from });
    }

    get amountCanceled() {
        return 1n;
    }

    get failed() {
        return false;
    }

    get error() {
        return '0x';
    }
}
