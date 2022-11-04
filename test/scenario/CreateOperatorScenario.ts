import { Transaction } from '@frugal-wizard/abi2ts-lib';
import { AddContextFunction } from '@frugal-wizard/contract-test-helper';
import { formatVersion } from '../describer/describer';
import { OperatorFactoryContext, OperatorFactoryScenario, OperatorFactoryScenarioProperties } from './OperatorFactoryScenario';

export interface CreateOperatorScenarioProperties extends OperatorFactoryScenarioProperties {
    readonly version: bigint;
}

export class CreateOperatorScenario extends OperatorFactoryScenario<OperatorFactoryContext, Transaction, string> {
    readonly version: bigint;

    constructor({
        version,
        ...rest
    }: CreateOperatorScenarioProperties) {
        super(rest);
        this.version = version;
    }

    addContext(addContext: AddContextFunction): void {
        addContext('version', formatVersion(this.version));
        super.addContext(addContext);
    }

    async setup() {
        return await this._setup();
    }

    async execute(ctx: OperatorFactoryContext) {
        const { operatorFactory, caller } = ctx;
        return await operatorFactory.createOperator(this.version, { from: caller });
    }

    async executeStatic(ctx: OperatorFactoryContext) {
        const { operatorFactory, caller } = ctx;
        return await operatorFactory.callStatic.createOperator(this.version, { from: caller });
    }
}
