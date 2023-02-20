import { formatValue } from '@frugalwizard/abi2ts-lib';
import { describeCaller } from './caller';
import { describeOperator } from './operator';
import { describeSetup } from './setup';

export function describeWithdrawERC20Scenario({
    amount,
    ...rest
}: {
    readonly amount: bigint;
} & (
    Parameters<typeof describeCaller>[0] &
    Parameters<typeof describeOperator>[0] &
    Parameters<typeof describeSetup>[0]
)): string {

    return `withdraw ${formatValue(amount)} ERC20${
        describeCaller(rest)
    }${
        describeOperator(rest, 'from')
    }${
        describeSetup(rest)
    }`;
}
