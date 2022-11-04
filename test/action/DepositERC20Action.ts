import { OperatorContext } from '../scenario/OperatorScenario';
import { OperatorAction, OperatorActionProperties } from './OperatorAction';

export interface DepositERC20ActionProperties extends OperatorActionProperties {
    readonly amount: bigint;
}

export class DepositERC20Action extends OperatorAction {
    readonly amount: bigint;

    constructor({
        amount,
        ...rest
    }: DepositERC20ActionProperties) {
        super(rest);
        this.amount = amount;
    }

    async execute(ctx: OperatorContext) {
        await ctx.erc20.transfer(ctx.operator, this.amount);
    }

    apply<T>(state: T) {
        return state;
    }
}
