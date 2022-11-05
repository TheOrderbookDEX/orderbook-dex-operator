import { Account } from '@frugal-wizard/contract-test-helper';
import { OperatorContext } from '../scenario/OperatorScenario';
import { OperatorAction, OperatorActionProperties } from './OperatorAction';

export interface DepositERC20ActionProperties extends OperatorActionProperties {
    readonly amount: bigint;
    readonly caller?: Account;
    readonly operatorOwner?: Account;
}

export class DepositERC20Action extends OperatorAction {
    readonly amount: bigint;
    readonly caller: Account;
    readonly operatorOwner: Account;

    constructor({
        amount,
        caller = Account.MAIN,
        operatorOwner = Account.MAIN,
        ...rest
    }: DepositERC20ActionProperties) {
        super(rest);
        this.amount = amount;
        this.caller = caller;
        this.operatorOwner = operatorOwner;
    }

    async execute(ctx: OperatorContext) {
        const { operatorFactory, erc20, [this.operatorOwner]: operatorOwner, [this.caller]: from } = ctx;
        const operator = await operatorFactory.operator(operatorOwner);
        await erc20.transfer(operator, this.amount, { from });
    }

    apply<T>(state: T) {
        return state;
    }
}
