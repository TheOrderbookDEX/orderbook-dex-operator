import { formatValue, Transaction } from '@frugal-wizard/abi2ts-lib';
import { AddContextFunction } from '@frugal-wizard/contract-test-helper';
import { OperatorContext, OperatorScenario, OperatorScenarioProperties } from './OperatorScenario';

export interface WithdrawERC20ScenarioProperties extends OperatorScenarioProperties {
    readonly amount: bigint;
}

export class WithdrawERC20Scenario extends OperatorScenario<OperatorContext, Transaction, void> {
    readonly amount: bigint;

    constructor({
        amount,
        ...rest
    }: WithdrawERC20ScenarioProperties) {
        super(rest);
        this.amount = amount;
    }

    addContext(addContext: AddContextFunction): void {
        addContext('amount', formatValue(this.amount));
        super.addContext(addContext);
    }

    async setup() {
        return await this._setup();
    }

    async execute(ctx: OperatorContext) {
        const { operator, erc20, caller } = ctx;
        return await operator.withdrawERC20([ [ erc20, this.amount ] ], { from: caller });
    }

    async executeStatic(ctx: OperatorContext) {
        const { operator, erc20, caller } = ctx;
        return await operator.callStatic.withdrawERC20([ [ erc20, this.amount ] ], { from: caller });
    }
}
