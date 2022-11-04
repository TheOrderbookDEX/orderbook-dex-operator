import { Transaction } from '@frugal-wizard/abi2ts-lib';
import { AddContextFunction } from '@frugal-wizard/contract-test-helper';
import { OperatorV0 } from '../../src/OperatorV0';
import { formatVersion } from '../describer/describer';
import { OperatorFactoryContext, OperatorFactoryScenario, OperatorFactoryScenarioProperties } from './OperatorFactoryScenario';

export interface RegisterVersionContext extends OperatorFactoryContext {
    readonly implementation: OperatorV0;
}

export interface RegisterVersionScenarioProperties extends OperatorFactoryScenarioProperties {
    readonly version: bigint;
    readonly implementation?: string;
}

export class RegisterVersionScenario extends OperatorFactoryScenario<RegisterVersionContext, Transaction, void> {
    readonly version: bigint;
    readonly implementation?: string;

    constructor({
        version,
        implementation,
        ...rest
    }: RegisterVersionScenarioProperties) {
        super(rest);
        this.version = version;
        this.implementation = implementation;
    }

    addContext(addContext: AddContextFunction): void {
        addContext('version', formatVersion(this.version));
        if (this.implementation) {
            addContext('implementation', this.implementation);
        }
        super.addContext(addContext);
    }

    async _setup(): Promise<RegisterVersionContext> {
        const ctx = await super._setup();
        const implementation = this.implementation ? OperatorV0.at(this.implementation) : await OperatorV0.deploy();
        return { ...ctx, implementation };
    }

    async setup() {
        return await this._setup();
    }

    async execute(ctx: RegisterVersionContext) {
        const { operatorFactory, implementation, caller } = ctx;
        return await operatorFactory.registerVersion(this.version, implementation, { from: caller });
    }

    async executeStatic(ctx: RegisterVersionContext) {
        const { operatorFactory, implementation, caller } = ctx;
        return await operatorFactory.callStatic.registerVersion(this.version, implementation, { from: caller });
    }
}
