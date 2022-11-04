import { Transaction } from '@frugal-wizard/abi2ts-lib';
import { AddContextFunction } from '@frugal-wizard/contract-test-helper';
import { formatVersion } from '../describer/describer';
import { OperatorFactoryContext, OperatorFactoryScenario, OperatorFactoryScenarioProperties } from './OperatorFactoryScenario';

export interface UpdateOperatorScenarioProperties extends OperatorFactoryScenarioProperties {
    readonly version: bigint;
}

export class UpdateOperatorScenario extends OperatorFactoryScenario<OperatorFactoryContext, Transaction, void> {
    readonly version: bigint;

    constructor({
        version,
        ...rest
    }: UpdateOperatorScenarioProperties) {
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
        return await operatorFactory.updateOperator(this.version, { from: caller });
    }

    async executeStatic(ctx: OperatorFactoryContext) {
        const { operatorFactory, caller } = ctx;
        return await operatorFactory.callStatic.updateOperator(this.version, { from: caller });
    }
}
