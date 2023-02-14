import { ContractError, Transaction } from '@frugal-wizard/abi2ts-lib';
import { Account, EthereumSetupContext, executeSetupActions, TestSetupContext } from '@frugal-wizard/contract-test-helper';
import { OperatorFactoryAction } from '../action/factory';
import { describeUpdateOperatorScenario } from '../describe/updateOperator';
import { describeVersion } from '../describe/version';
import { createOperatorFactoryScenario, OperatorFactoryContext, OperatorFactoryScenario } from './factory';

export type UpdateOperatorScenario = OperatorFactoryScenario<TestSetupContext & EthereumSetupContext & OperatorFactoryContext & {
    readonly caller: string;
    execute(): Promise<Transaction>;
    executeStatic(): Promise<void>;
}> & {
    readonly version: bigint;
    readonly expectedError?: ContractError;
};

export function createUpdateOperatorScenario({
    only,
    description,
    version,
    caller = Account.MAIN,
    versionManager = Account.MAIN,
    expectedError,
    setupActions = [],
}: {
    readonly only?: boolean;
    readonly description?: string;
    readonly version: bigint;
    readonly caller?: Account;
    readonly versionManager?: Account;
    readonly expectedError?: ContractError;
    readonly setupActions?: OperatorFactoryAction[];
}): UpdateOperatorScenario {

    return {
        version,
        expectedError,

        ...createOperatorFactoryScenario({
            only,
            description: description ?? describeUpdateOperatorScenario({
                version,
                caller,
                versionManager,
                setupActions,
            }),
            versionManager,

            async setup(ctx) {
                ctx.addContext('version', describeVersion(version));
                ctx.addContext('caller', caller);

                await executeSetupActions(setupActions, ctx);

                return {
                    ...ctx,
                    caller: ctx[caller],
                    execute: () => ctx.operatorFactory.updateOperator(version, { from: ctx[caller] }),
                    executeStatic: () => ctx.operatorFactory.callStatic.updateOperator(version, { from: ctx[caller] }),
                };
            },
        }),
    };
}
