import { Account, AddContextFunction, BaseTestContext, TestScenario, TestScenarioProperties } from 'contract-test-helper';
import { ERC20Mock } from 'orderbook-dex/dist/testing/ERC20Mock';
import { OperatorLogicRegistry } from '../../src/OperatorLogicRegistry';
import { Operator } from '../../src/Operator';
import { AddressBookMock } from '../../src/testing/AddressBookMock';
import { parseValue } from 'abi2ts-lib';

export interface DeployOperatorContext extends BaseTestContext {
    readonly addressBook: AddressBookMock;
    readonly testToken: ERC20Mock;
    readonly logicRegistry: OperatorLogicRegistry;
}

export interface DeployOperatorScenarioProperties extends TestScenarioProperties<BaseTestContext> {
    readonly owner?: Account;
}

export class DeployOperatorScenario extends TestScenario<DeployOperatorContext, Operator, string> {
    readonly owner: Account;

    constructor({
        owner = Account.MAIN,
        ...rest
    }: DeployOperatorScenarioProperties) {
        super(rest);
        this.owner = owner;
    }

    addContext(addContext: AddContextFunction): void {
        if (this.owner != Account.MAIN) {
            addContext('owner', this.owner);
        }
        super.addContext(addContext);
    }

    async _setup(): Promise<DeployOperatorContext> {
        const ctx = await super._setup();
        const { accounts } = ctx;
        const addressBook = await AddressBookMock.deploy();
        for (const from of accounts.slice(0, 2)) {
            await addressBook.register({ from });
        }
        const testToken = await ERC20Mock.deploy('Test Token', 'TEST', 18);
        await testToken.giveMultiple(accounts.slice(0, 3).map(account => [ account, parseValue(1000000) ]));
        const logicRegistry = await OperatorLogicRegistry.deploy();
        return { ...ctx, addressBook, testToken, logicRegistry };
    }

    async setup() {
        return await this._setup();
    }

    async execute(ctx: DeployOperatorContext) {
        const { logicRegistry, addressBook } = ctx;
        return await Operator.deploy(ctx[this.owner], logicRegistry, addressBook);
    }

    async executeStatic(ctx: DeployOperatorContext) {
        const { logicRegistry, addressBook } = ctx;
        return await Operator.callStatic.deploy(ctx[this.owner], logicRegistry, addressBook);
    }
}
