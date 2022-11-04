import { Account } from '@frugal-wizard/contract-test-helper';
import { OperatorFactoryContext } from '../scenario/OperatorFactoryScenario';
import { OperatorFactoryAction, OperatorFactoryActionProperties } from './OperatorFactoryAction';

export interface CreateOperatorActionProperties extends OperatorFactoryActionProperties {
    readonly version: bigint;
    readonly caller?: Account;
}

export class CreateOperatorAction extends OperatorFactoryAction {
    readonly version: bigint;
    readonly caller: Account;

    constructor({
        version,
        caller = Account.MAIN,
        ...rest
    }: CreateOperatorActionProperties) {
        super(rest);
        this.version = version;
        this.caller = caller;
    }

    async execute(ctx: OperatorFactoryContext) {
        const { operatorFactory, caller } = ctx;
        await operatorFactory.createOperator(this.version, { from: caller });
    }

    apply<T>(state: T) {
        return state;
    }
}
