import { Account } from '@frugal-wizard/contract-test-helper';
import { describeCreateOperatorAction } from '../describe/createOperator';
import { OperatorFactoryAction } from './factory';

export function createCreateOperatorAction({
    version,
    caller = Account.MAIN,
}: {
    readonly version: bigint;
    readonly caller?: Account;
}): OperatorFactoryAction {

    return {
        description: describeCreateOperatorAction({
            version,
            caller,
        }),

        async execute({ operatorFactory, [caller]: from }) {
            await operatorFactory.createOperator(version, { from });
        },
    };
}
