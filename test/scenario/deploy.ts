import { Account, createEthereumScenario, EthereumScenario, EthereumSetupContext, TestSetupContext } from '@frugalwizard/contract-test-helper';
import { OperatorFactory } from '../../src/OperatorFactory';
import { AddressBook } from '@frugalwizard/addressbook/dist/AddressBook';
import { ContractError } from '@frugalwizard/abi2ts-lib';
import { describeDeployOperatorFactoryScenario } from '../describe/deploy';

export type DeployOperatorFactoryScenario = {
    readonly versionManager: Account;
    readonly expectedError?: ContractError;
} & EthereumScenario<TestSetupContext & EthereumSetupContext & {
    readonly addressBook: AddressBook;
    execute(): Promise<OperatorFactory>;
    executeStatic(): Promise<string>;
}>;

export function createDeployOperatorFactoryScenario({
    only,
    description,
    versionManager = Account.MAIN,
    expectedError,
}: {
    readonly only?: boolean;
    readonly description?: string;
    readonly versionManager?: Account;
    readonly expectedError?: ContractError;
}): DeployOperatorFactoryScenario {

    return {
        versionManager,
        expectedError,

        ...createEthereumScenario({
            only,
            description: description ?? describeDeployOperatorFactoryScenario({
                versionManager,
            }),

            async setup(ctx) {
                ctx.addContext('versionManager', versionManager);

                const addressBook = await AddressBook.deploy();

                return {
                    ...ctx,
                    addressBook,
                    execute: () => OperatorFactory.deploy(ctx[versionManager], addressBook),
                    executeStatic: () => OperatorFactory.callStatic.deploy(ctx[versionManager], addressBook),
                };
            },
        })
    };
}
