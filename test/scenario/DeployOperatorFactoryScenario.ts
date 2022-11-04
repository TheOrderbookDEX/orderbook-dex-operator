import { Account, AddContextFunction, BaseTestContext, TestScenario, TestScenarioProperties } from '@frugal-wizard/contract-test-helper';
import { OperatorFactory } from '../../src/OperatorFactory';
import { AddressBook } from '@frugal-wizard/addressbook/dist/AddressBook';

export interface DeployOperatorFactoryContext extends BaseTestContext {
    readonly addressBook: AddressBook;
}

export interface DeployOperatorFactoryScenarioProperties extends TestScenarioProperties<BaseTestContext> {
    readonly versionManager?: Account;
}

export class DeployOperatorFactoryScenario extends TestScenario<DeployOperatorFactoryContext, OperatorFactory, string> {
    readonly versionManager: Account;

    constructor({
        versionManager = Account.MAIN,
        ...rest
    }: DeployOperatorFactoryScenarioProperties) {
        super(rest);
        this.versionManager = versionManager;
    }

    addContext(addContext: AddContextFunction): void {
        addContext('versionManager', this.versionManager);
        super.addContext(addContext);
    }

    async _setup(): Promise<DeployOperatorFactoryContext> {
        const ctx = await super._setup();
        const addressBook = await AddressBook.deploy();
        return { ...ctx, addressBook };
    }

    async setup() {
        return await this._setup();
    }

    async execute(ctx: DeployOperatorFactoryContext) {
        const { [this.versionManager]: versionManager, addressBook } = ctx;
        return await OperatorFactory.deploy(versionManager, addressBook);
    }

    async executeStatic(ctx: DeployOperatorFactoryContext) {
        const { [this.versionManager]: versionManager, addressBook } = ctx;
        return await OperatorFactory.callStatic.deploy(versionManager, addressBook);
    }
}
