import { Account } from '@frugalwizard/contract-test-helper';

export function describeCaller({
    caller,
}: {
    readonly caller: Account;
}): string {

    return caller != Account.MAIN ? ` using ${caller}` : '';
}
