import { parseValue } from '@frugal-wizard/abi2ts-lib';
import { Account, AddContextFunction, BaseTestContext, TestScenario, TestScenarioProperties } from '@frugal-wizard/contract-test-helper';
import { ERC20Mock } from '@theorderbookdex/orderbook-dex/dist/testing/ERC20Mock';
import { IOperator } from '../../src/interfaces/IOperator';
import { Operator } from '../../src/Operator';
import { OperatorLogicRegistry } from '../../src/OperatorLogicRegistry';
import { AddressBookMock } from '../../src/testing/AddressBookMock';

export interface OperatorContext extends BaseTestContext {
    readonly addressBook: AddressBookMock;
    readonly testToken: ERC20Mock;
    readonly logicRegistry: OperatorLogicRegistry;
    readonly operator: IOperator;
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
        const { accounts } = ctx;
        const addressBook = await AddressBookMock.deploy();
        for (const from of accounts.slice(0, 2)) {
            await addressBook.register({ from });
        }
        const testToken = await ERC20Mock.deploy('Test Token', 'TEST', 18);
        await testToken.giveMultiple(accounts.slice(0, 3).map(account => [ account, parseValue(1000000) ]));
        const logicRegistry = await OperatorLogicRegistry.deploy();
        const operator = IOperator.at((await Operator.deploy(accounts[0], logicRegistry, addressBook)).address);
        return { ...ctx, addressBook, testToken, logicRegistry, operator };
    }
}
