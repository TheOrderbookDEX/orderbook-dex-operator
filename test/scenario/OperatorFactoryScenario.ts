import { Account, AddContextFunction, BaseTestContext, TestScenario, TestScenarioProperties } from '@frugal-wizard/contract-test-helper';
import { OperatorFactory } from '../../src/OperatorFactory';
import { AddressBook } from '@frugal-wizard/addressbook/dist/AddressBook';

export interface OperatorFactoryContext extends BaseTestContext {
    readonly caller: string;
    readonly addressBook: AddressBook;
    readonly operatorFactory: OperatorFactory;
}

export interface OperatorFactoryScenarioProperties extends TestScenarioProperties<OperatorFactoryContext> {
    readonly versionManager?: Account;
    readonly caller?: Account;
}

export abstract class OperatorFactoryScenario<TestContext extends OperatorFactoryContext, ExecuteResult, ExecuteStaticResult>
    extends TestScenario<TestContext, ExecuteResult, ExecuteStaticResult>
{
    readonly versionManager: Account;
    readonly caller: Account;

    constructor({
        versionManager = Account.MAIN,
        caller = Account.MAIN,
        ...rest
    }: OperatorFactoryScenarioProperties) {
        super(rest);
        this.versionManager = versionManager;
        this.caller = caller;
    }

    addContext(addContext: AddContextFunction): void {
        addContext('versionManager', this.versionManager);
        addContext('caller', this.caller);
        super.addContext(addContext);
    }

    async _setup(): Promise<OperatorFactoryContext> {
        const ctx = await super._setup();
        const { [this.versionManager]: versionManager, [this.caller]: caller } = ctx;
        const addressBook = await AddressBook.deploy();
        const operatorFactory = await OperatorFactory.deploy(versionManager, addressBook);
        return { ...ctx, caller, addressBook, operatorFactory };
    }
}
