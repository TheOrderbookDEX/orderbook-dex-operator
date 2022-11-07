import { Transaction } from '@frugal-wizard/abi2ts-lib';
import { IOperatorAdmin } from '../../src/interfaces/IOperatorAdmin';
import { OperatorContext, OperatorScenario } from './OperatorScenario';

// this is mostly ad-hoc just to test that upgradeTo cannot be called directly

export class UpgradeToScenario extends OperatorScenario<OperatorContext, Transaction, void> {
    constructor() {
        super({
            describer: 'call upgradeTo directly'
        });
    }

    async setup() {
        return await this._setup();
    }

    async execute(ctx: OperatorContext) {
        const { operatorFactory, operator, caller } = ctx;
        const implementation = await operatorFactory.versionImplementation(0n);
        return await IOperatorAdmin.at(operator.address).upgradeTo(implementation, { from: caller });
    }

    async executeStatic(ctx: OperatorContext) {
        const { operatorFactory, operator, caller } = ctx;
        const implementation = await operatorFactory.versionImplementation(0n);
        return await IOperatorAdmin.at(operator.address).callStatic.upgradeTo(implementation, { from: caller });
    }
}
