import { Account, createEthereumScenario, EthereumScenario, EthereumSetupContext, TestSetupContext } from '@frugal-wizard/contract-test-helper';
import { OperatorFactory } from '../../src/OperatorFactory';
import { AddressBook } from '@frugal-wizard/addressbook/dist/AddressBook';

export type OperatorFactoryScenario<Context> = EthereumScenario<Context> & {
    readonly versionManager: Account;
};

export interface OperatorFactoryContext {
    readonly addressBook: AddressBook;
    readonly operatorFactory: OperatorFactory;
}

export function createOperatorFactoryScenario<Context>({
    only,
    description,
    versionManager,
    setup,
}: {
    readonly only?: boolean;
    readonly description: string;
    readonly versionManager: Account;
    readonly setup: (ctx: TestSetupContext & EthereumSetupContext & OperatorFactoryContext) => Context | Promise<Context>;
}): OperatorFactoryScenario<Context> {

    return {
        versionManager,

        ...createEthereumScenario({
            only,
            description,

            async setup(ctx) {
                ctx.addContext('versionManager', versionManager);

                const { [versionManager]: versionManagerAddress } = ctx;
                const addressBook = await AddressBook.deploy();
                const operatorFactory = await OperatorFactory.deploy(versionManagerAddress, addressBook);

                return setup({
                    ...ctx,
                    addressBook,
                    operatorFactory,
                });
            },
        })
    };
}
