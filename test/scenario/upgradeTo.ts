import { Transaction, ZERO_ADDRESS } from '@frugalwizard/abi2ts-lib';
import { Account, EthereumSetupContext, TestSetupContext } from '@frugalwizard/contract-test-helper';
import { IOperatorAdmin } from '../../src/interfaces/IOperatorAdmin';
import { createOperatorScenario, OperatorContext, OperatorScenario } from './operator';

// this is mostly ad-hoc just to test that upgradeTo cannot be called directly

export type UpgradeToScenario = OperatorScenario<TestSetupContext & EthereumSetupContext & OperatorContext & {
    execute(): Promise<Transaction>;
    executeStatic(): Promise<void>;
}>;

export function createUpgradeToScenario(): UpgradeToScenario {

    return {
        ...createOperatorScenario({
            description: 'call upgradeTo directly',
            operatorOwner: Account.MAIN,

            async setup(ctx) {
                return {
                    ...ctx,
                    execute: () => IOperatorAdmin.at(ctx.operator.address).upgradeTo(ZERO_ADDRESS),
                    executeStatic: () => IOperatorAdmin.at(ctx.operator.address).callStatic.upgradeTo(ZERO_ADDRESS),
                };
            },
        }),
    };
}
