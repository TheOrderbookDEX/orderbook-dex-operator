import { AddContextFunction } from '@theorderbookdex/contract-test-helper';
import { OrderbookMock } from '../../src/testing/OrderbookMock';
import { describeVersion } from '../describer/describer';
import { OperatorContext, OperatorScenario, OperatorScenarioProperties } from './OperatorScenario';

export interface OrderbookOperationContext extends OperatorContext {
    readonly orderbook: OrderbookMock;
}

export interface OrderbookOperationScenarioProperties extends OperatorScenarioProperties {
    readonly orderbookVersion: bigint;
}

export abstract class OrderbookOperationScenario<ExecuteResult, ExecuteStaticResult>
    extends OperatorScenario<OrderbookOperationContext, ExecuteResult, ExecuteStaticResult>
{
    readonly orderbookVersion: bigint;

    constructor({
        orderbookVersion,
        ...rest
    }: OrderbookOperationScenarioProperties) {
        super(rest);
        this.orderbookVersion = orderbookVersion;
    }

    addContext(addContext: AddContextFunction): void {
        addContext('orderbookVersion', describeVersion(this.orderbookVersion));
        super.addContext(addContext);
    }

    async _setup(): Promise<OrderbookOperationContext> {
        const ctx = await super._setup();
        const orderbook = await OrderbookMock.deploy(this.orderbookVersion);
        return { ...ctx, orderbook };
    }

    async setup() {
        return await this._setup();
    }
}
