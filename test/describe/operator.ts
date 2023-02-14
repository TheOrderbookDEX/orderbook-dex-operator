import { Account } from '@frugal-wizard/contract-test-helper';

export function describeOperator({
    operatorOwner,
}: {
    readonly operatorOwner: Account;
}, preposition: string): string {

    return operatorOwner != Account.MAIN ? ` ${preposition} operator owned by ${operatorOwner}` : '';
}
