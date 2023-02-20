import { Account } from '@frugalwizard/contract-test-helper';

export function describeOperator({
    operatorOwner,
}: {
    readonly operatorOwner: Account;
}, preposition: string): string {

    return operatorOwner != Account.MAIN ? ` ${preposition} operator owned by ${operatorOwner}` : '';
}
