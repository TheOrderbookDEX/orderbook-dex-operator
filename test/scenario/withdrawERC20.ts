import { ContractError, formatValue, Transaction } from '@frugal-wizard/abi2ts-lib';
import { Account, EthereumSetupContext, executeSetupActions, TestSetupContext } from '@frugal-wizard/contract-test-helper';
import { OperatorAction } from '../action/operator';
import { describeWithdrawERC20Scenario } from '../describe/withdrawERC20';
import { createOperatorScenario, OperatorContext, OperatorScenario } from './operator';

export type WithdrawERC20Scenario = OperatorScenario<TestSetupContext & EthereumSetupContext & OperatorContext & {
    readonly caller: string;
    execute(): Promise<Transaction>;
    executeStatic(): Promise<void>;
}> & {
    readonly amount: bigint;
    readonly expectedError?: ContractError;
};

export function createWithdrawERC20Scenario({
    only,
    description,
    amount,
    caller = Account.MAIN,
    operatorOwner = Account.MAIN,
    expectedError,
    setupActions = [],
}: {
    readonly only?: boolean;
    readonly description?: string;
    readonly amount: bigint;
    readonly caller?: Account;
    readonly operatorOwner?: Account;
    readonly expectedError?: ContractError;
    readonly setupActions?: OperatorAction[];
}): WithdrawERC20Scenario {

    return {
        amount,
        expectedError,

        ...createOperatorScenario({
            only,
            description: description ?? describeWithdrawERC20Scenario({
                amount,
                caller,
                operatorOwner,
                setupActions,
            }),
            operatorOwner,

            async setup(ctx) {
                ctx.addContext('amount', formatValue(amount));
                ctx.addContext('caller', caller);

                await executeSetupActions(setupActions, ctx);

                return {
                    ...ctx,
                    caller: ctx[caller],
                    execute: () => ctx.operator.withdrawERC20([ [ ctx.erc20, amount ] ], { from: ctx[caller] }),
                    executeStatic: () => ctx.operator.callStatic.withdrawERC20([ [ ctx.erc20, amount ] ], { from: ctx[caller] }),
                };
            },
        }),
    };
}
