import { OperatorV0 } from '../../src/OperatorV0';
import { describeRegisterVersionAction } from '../describe/registerVersion';
import { DeployAddress } from '../utils/addresses';
import { OperatorFactoryAction } from './factory';

export function createRegisterVersionAction({
    version,
}: {
    readonly version: bigint;
}): OperatorFactoryAction {

    return {
        description: describeRegisterVersionAction({
            version,
            implementationAddress: DeployAddress,
        }),

        async execute({ operatorFactory }) {
            const implementation = await OperatorV0.deploy();
            const from = await operatorFactory.versionManager();
            await operatorFactory.registerVersion(version, implementation, { from });
        },
    };
}
