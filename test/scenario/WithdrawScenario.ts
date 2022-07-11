import { formatValue, Transaction } from '@theorderbookdex/abi2ts-lib';
import { AddContextFunction } from '@theorderbookdex/contract-test-helper';
import { OperatorContext, OperatorScenario, OperatorScenarioProperties } from './OperatorScenario';

// TODO test multiple token withdrawal

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

    async execute({ operator, testToken, [this.caller]: from }: OperatorContext) {
        return await operator.withdrawERC20([ [ testToken, this.amount ] ], { from });
    }

    async executeStatic({ operator, testToken, [this.caller]: from }: OperatorContext) {
        return await operator.callStatic.withdrawERC20([ [ testToken, this.amount ] ], { from });
    }
}
