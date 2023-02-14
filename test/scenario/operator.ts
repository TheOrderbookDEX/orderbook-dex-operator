import { parseValue } from '@frugal-wizard/abi2ts-lib';
import { Account, createEthereumScenario, EthereumScenario, EthereumSetupContext, TestSetupContext } from '@frugal-wizard/contract-test-helper';
import { ERC20Mock } from '@theorderbookdex/orderbook-dex/dist/testing/ERC20Mock';
import { OperatorFactory } from '../../src/OperatorFactory';
import { AddressBook } from '@frugal-wizard/addressbook/dist/AddressBook';
import { OperatorV0 } from '../../src/OperatorV0';

export type OperatorScenario<Context> = EthereumScenario<Context> & {
    readonly operatorOwner: Account;
};

export interface OperatorContext {
    readonly addressBook: AddressBook;
    readonly operatorFactory: OperatorFactory;
    readonly erc20: ERC20Mock;
    readonly operator: OperatorV0;
}

export function createOperatorScenario<Context>({
    only,
    description,
    operatorOwner,
    setup,
}: {
    readonly only?: boolean;
    readonly description: string;
    readonly operatorOwner: Account;
    readonly setup: (ctx: TestSetupContext & EthereumSetupContext & OperatorContext) => Context | Promise<Context>;
}): OperatorScenario<Context> {

    return {
        operatorOwner,

        ...createEthereumScenario({
            only,
            description,

            async setup(ctx) {
                ctx.addContext('operatorOwner', operatorOwner);

                const { mainAccount, accounts, [operatorOwner]: operatorOwnerAddress } = ctx;

                const addressBook = await AddressBook.deploy();

                const operatorFactory = await OperatorFactory.deploy(mainAccount, addressBook);
                await operatorFactory.registerVersion(0n, await OperatorV0.deploy());
                for (const from of accounts) {
                    await operatorFactory.createOperator(0n, { from });
                }

                const operator = OperatorV0.at(await operatorFactory.operator(operatorOwnerAddress));

                const erc20 = await ERC20Mock.deploy('Test Token', 'TEST', 18);
                await erc20.giveMultiple(accounts.map(account => [ account, parseValue(1000000) ]));

                return setup({
                    ...ctx,
                    addressBook,
                    operatorFactory,
                    operator,
                    erc20,
                });
            },
        })
    };
}
