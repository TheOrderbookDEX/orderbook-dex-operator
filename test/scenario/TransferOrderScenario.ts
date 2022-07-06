import { Transaction } from 'abi2ts-lib';
import { Account, AddContextFunction } from 'contract-test-helper';
import { TransferOrderResult } from '../../src/interfaces/IOperator';
import { OrderbookOperationContext, OrderbookOperationScenario, OrderbookOperationScenarioProperties } from './OrderbookOperationScenario';

export interface TransferOrderScenarioProperties extends OrderbookOperationScenarioProperties {
    readonly orderId: string;
    readonly recipient: Account;
}

export class TransferOrderScenario extends OrderbookOperationScenario<Transaction, TransferOrderResult> {
    readonly orderId: string;
    readonly recipient: Account;

    constructor({
        orderId,
        recipient,
        ...rest
    }: TransferOrderScenarioProperties) {
        super(rest);
        this.orderId = orderId;
        this.recipient = recipient;
    }

    addContext(addContext: AddContextFunction): void {
        addContext('orderId', this.orderId);
        addContext('recipient', this.recipient);
        super.addContext(addContext);
    }

    async execute({ operator, orderbook, [this.recipient]: recipient, [this.caller]: from }: OrderbookOperationContext) {
        return await operator.transferOrder(orderbook, this.orderId, recipient, { from });
    }

    async executeStatic({ operator, orderbook, [this.recipient]: recipient, [this.caller]: from }: OrderbookOperationContext) {
        return await operator.callStatic.transferOrder(orderbook, this.orderId, recipient, { from });
    }

    get failed() {
        return false;
    }

    get error() {
        return '0x';
    }
}
