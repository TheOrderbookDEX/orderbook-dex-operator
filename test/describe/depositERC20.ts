import { formatValue } from '@frugal-wizard/abi2ts-lib';
import { describeCaller } from './caller';
import { describeOperator } from './operator';

export function describeDepositERC20Action({
    amount,
    ...rest
}: {
    readonly amount: bigint;
} & (
    Parameters<typeof describeCaller>[0] &
    Parameters<typeof describeOperator>[0]
)) {

    return `deposit ${formatValue(amount)} ERC20${
        describeCaller(rest)
    }${
        describeOperator(rest, 'to')
    }`;
}
