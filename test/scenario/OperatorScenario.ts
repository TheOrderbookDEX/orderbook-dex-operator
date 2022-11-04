import { parseValue } from '@frugal-wizard/abi2ts-lib';
import { Account, AddContextFunction, BaseTestContext, TestScenario, TestScenarioProperties } from '@frugal-wizard/contract-test-helper';
import { ERC20Mock } from '@theorderbookdex/orderbook-dex/dist/testing/ERC20Mock';
import { OperatorFactory } from '../../src/OperatorFactory';
import { AddressBook } from '@frugal-wizard/addressbook/dist/AddressBook';
import { OperatorV0 } from '../../src/OperatorV0';

export interface OperatorContext extends BaseTestContext {
    readonly caller: string;
    readonly addressBook: AddressBook;
    readonly operatorFactory: OperatorFactory;
    readonly erc20: ERC20Mock;
    readonly operator: OperatorV0;
}

export interface OperatorScenarioProperties extends TestScenarioProperties<OperatorContext> {
    readonly caller?: Account;
}

export abstract class OperatorScenario<TestContext extends OperatorContext, ExecuteResult, ExecuteStaticResult>
    extends TestScenario<TestContext, ExecuteResult, ExecuteStaticResult>
{
    readonly caller: Account;

    constructor({
        caller = Account.MAIN,
        ...rest
    }: OperatorScenarioProperties) {
        super(rest);
        this.caller = caller;
    }

    addContext(addContext: AddContextFunction): void {
        addContext('caller', this.caller);
        super.addContext(addContext);
    }

    async _setup(): Promise<OperatorContext> {
        const ctx = await super._setup();
        const { mainAccount, accounts, [this.caller]: caller } = ctx;
        const addressBook = await AddressBook.deploy();
        const operatorFactory = await OperatorFactory.deploy(mainAccount, addressBook);
        await operatorFactory.registerVersion(0n, await OperatorV0.deploy());
        for (const from of accounts) {
            await operatorFactory.createOperator(0n, { from });
        }
        const operator = OperatorV0.at(await operatorFactory.operator(caller));
        const erc20 = await ERC20Mock.deploy('Test Token', 'TEST', 18);
        await erc20.giveMultiple(accounts.map(account => [ account, parseValue(1000000) ]));
        return { ...ctx, caller, addressBook, operatorFactory, erc20, operator };
    }
}
