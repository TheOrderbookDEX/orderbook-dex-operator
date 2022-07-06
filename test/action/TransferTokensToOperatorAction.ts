import { OperatorContext } from '../scenario/OperatorScenario';
import { OperatorAction, OperatorActionProperties } from './OperatorAction';

export interface TransferTokensToOperatorActionProperties extends OperatorActionProperties {
    readonly amount: bigint;
}

export class TransferTokensToOperatorAction extends OperatorAction {
    readonly amount: bigint;

    constructor({
        amount,
        ...rest
    }: TransferTokensToOperatorActionProperties) {
        super(rest);
        this.amount = amount;
    }

    async execute(ctx: OperatorContext) {
        await ctx.testToken.transfer(ctx.operator, this.amount);
    }

    apply<T>(state: T) {
        return state;
    }
}
