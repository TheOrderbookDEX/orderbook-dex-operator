import { ContractError, Transaction } from '@frugalwizard/abi2ts-lib';
import { Account, EthereumSetupContext, executeSetupActions, TestSetupContext } from '@frugalwizard/contract-test-helper';
import { OperatorFactoryAction } from '../action/factory';
import { describeCreateOperatorScenario } from '../describe/createOperator';
import { describeVersion } from '../describe/version';
import { createOperatorFactoryScenario, OperatorFactoryContext, OperatorFactoryScenario } from './factory';

export type CreateOperatorScenario = OperatorFactoryScenario<TestSetupContext & EthereumSetupContext & OperatorFactoryContext & {
    readonly caller: string;
    execute(): Promise<Transaction>;
    executeStatic(): Promise<string>;
}> & {
    readonly version: bigint;
    readonly expectedError?: ContractError;
};

export function createCreateOperatorScenario({
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
}): CreateOperatorScenario {

    return {
        version,
        expectedError,

        ...createOperatorFactoryScenario({
            only,
            description: description ?? describeCreateOperatorScenario({
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
                    execute: () => ctx.operatorFactory.createOperator(version, { from: ctx[caller] }),
                    executeStatic: () => ctx.operatorFactory.callStatic.createOperator(version, { from: ctx[caller] }),
                };
            },
        }),
    };
}
