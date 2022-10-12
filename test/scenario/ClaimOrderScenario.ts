import { Transaction } from '@frugal-wizard/abi2ts-lib';
import { AddContextFunction } from '@frugal-wizard/contract-test-helper';
import { ClaimOrderResult } from '../../src/interfaces/IOperator';
import { OrderbookOperationContext, OrderbookOperationScenario, OrderbookOperationScenarioProperties } from './OrderbookOperationScenario';

export interface ClaimOrderScenarioProperties extends OrderbookOperationScenarioProperties {
    readonly orderId: string;
    readonly extraData: string;
}

export class ClaimOrderScenario extends OrderbookOperationScenario<Transaction, ClaimOrderResult> {
    readonly orderId: string;
    readonly extraData: string;

    constructor({
        orderId,
        extraData,
        ...rest
    }: ClaimOrderScenarioProperties) {
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
        return await operator.claimOrder(orderbook, this.orderId, this.extraData, { from });
    }

    async executeStatic({ operator, orderbook, [this.caller]: from }: OrderbookOperationContext) {
        return await operator.callStatic.claimOrder(orderbook, this.orderId, this.extraData, { from });
    }

    get amountClaimed() {
        return 1n;
    }

    get failed() {
        return false;
    }

    get error() {
        return '0x';
    }
}
