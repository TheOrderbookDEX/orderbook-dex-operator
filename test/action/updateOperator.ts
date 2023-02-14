import { Account } from '@frugal-wizard/contract-test-helper';
import { describeUpdateOperatorAction } from '../describe/updateOperator';
import { OperatorFactoryAction } from './factory';

export function createUpdateOperatorAction({
    version,
    caller = Account.MAIN,
}: {
    readonly version: bigint;
    readonly caller?: Account;
}): OperatorFactoryAction {

    return {
        description: describeUpdateOperatorAction({
            version,
            caller,
        }),

        async execute({ operatorFactory, [caller]: from }) {
            await operatorFactory.updateOperator(version, { from });
        },
    };
}
