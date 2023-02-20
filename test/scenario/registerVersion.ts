import { ContractError, Transaction } from '@frugalwizard/abi2ts-lib';
import { Account, Addresses, EthereumSetupContext, executeSetupActions, TestSetupContext } from '@frugalwizard/contract-test-helper';
import { OperatorV0 } from '../../src/OperatorV0';
import { OperatorFactoryAction } from '../action/factory';
import { describeRegisterVersionScenario } from '../describe/registerVersion';
import { describeVersion } from '../describe/version';
import { DeployAddress } from '../utils/addresses';
import { createOperatorFactoryScenario, OperatorFactoryContext, OperatorFactoryScenario } from './factory';

export type RegisterVersionScenario = OperatorFactoryScenario<TestSetupContext & EthereumSetupContext & OperatorFactoryContext & {
    readonly implementation: OperatorV0;
    readonly caller: string;
    execute(): Promise<Transaction>;
    executeStatic(): Promise<void>;
}> & {
    readonly version: bigint;
    readonly implementationAddress: string;
    readonly expectedError?: ContractError;
};

export function createRegisterVersionScenario({
    only,
    description,
    version,
    implementationAddress = DeployAddress,
    caller = Account.MAIN,
    versionManager = Account.MAIN,
    expectedError,
    setupActions = [],
}: {
    readonly only?: boolean;
    readonly description?: string;
    readonly version: bigint;
    readonly implementationAddress?: DeployAddress | Addresses;
    readonly caller?: Account;
    readonly versionManager?: Account;
    readonly expectedError?: ContractError;
    readonly setupActions?: OperatorFactoryAction[];
}): RegisterVersionScenario {

    return {
        expectedError,
        version,
        implementationAddress,

        ...createOperatorFactoryScenario({
            only,
            description: description ?? describeRegisterVersionScenario({
                version,
                implementationAddress,
                caller,
                versionManager,
                setupActions,
            }),
            versionManager,

            async setup(ctx) {
                ctx.addContext('version', describeVersion(version));
                ctx.addContext('implementation', implementationAddress);
                ctx.addContext('caller', caller);

                const implementation = implementationAddress == DeployAddress ?
                    await OperatorV0.deploy() :
                    OperatorV0.at(ctx[implementationAddress]);

                await executeSetupActions(setupActions, ctx);

                return {
                    ...ctx,
                    implementation,
                    caller: ctx[caller],
                    execute: () => ctx.operatorFactory.registerVersion(version, implementation, { from: ctx[caller] }),
                    executeStatic: () => ctx.operatorFactory.callStatic.registerVersion(version, implementation, { from: ctx[caller] }),
                };
            },
        }),
    };
}
