import { Account } from '@frugal-wizard/contract-test-helper';

export function describeOperatorFactoryScenario({
    versionManager,
}: {
    versionManager: string;
}): string {

    return versionManager != Account.MAIN ? ` with versionManager = ${versionManager}` : '';
}
