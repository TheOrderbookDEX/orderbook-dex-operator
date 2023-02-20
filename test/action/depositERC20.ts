import { Account } from '@frugalwizard/contract-test-helper';
import { describeDepositERC20Action } from '../describe/depositERC20';
import { OperatorAction } from './operator';

export function createDepositERC20Action({
    amount,
    caller = Account.MAIN,
    operatorOwner = Account.MAIN,
}: {
    readonly amount: bigint;
    readonly caller?: Account;
    readonly operatorOwner?: Account;
}): OperatorAction {

    return {
        description: describeDepositERC20Action({
            amount,
            caller,
            operatorOwner,
        }),

        async execute({ operatorFactory, erc20, [operatorOwner]: operatorOwnerAddress, [caller]: from }) {
            const operator = await operatorFactory.operator(operatorOwnerAddress);
            await erc20.transfer(operator, amount, { from });
        },
    };
}
