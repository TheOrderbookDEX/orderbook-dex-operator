import { Account } from '@frugal-wizard/contract-test-helper';
import { OperatorFactoryContext } from '../scenario/OperatorFactoryScenario';
import { OperatorFactoryAction, OperatorFactoryActionProperties } from './OperatorFactoryAction';

export interface UpdateOperatorActionProperties extends OperatorFactoryActionProperties {
    readonly version: bigint;
    readonly caller?: Account;
}

export class UpdateOperatorAction extends OperatorFactoryAction {
    readonly version: bigint;
    readonly caller: Account;

    constructor({
        version,
        caller = Account.MAIN,
        ...rest
    }: UpdateOperatorActionProperties) {
        super(rest);
        this.version = version;
        this.caller = caller;
    }

    async execute(ctx: OperatorFactoryContext) {
        const { operatorFactory, caller } = ctx;
        await operatorFactory.updateOperator(this.version, { from: caller });
    }

    apply<T>(state: T) {
        return state;
    }
}
