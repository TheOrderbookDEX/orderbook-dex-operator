import { DeployAddress } from '../utils/addresses';
import { describeCaller } from './caller';
import { describeOperatorFactoryScenario } from './factory';
import { describeSetup } from './setup';
import { describeVersion } from './version';

export function describeRegisterVersionScenario(scenario: (
    Parameters<typeof describeRegisterVersionAction>[0] &
    Parameters<typeof describeCaller>[0] &
    Parameters<typeof describeOperatorFactoryScenario>[0] &
    Parameters<typeof describeSetup>[0]
)): string {

    return `${
        describeRegisterVersionAction(scenario)
    }${
        describeCaller(scenario)
    }${
        describeOperatorFactoryScenario(scenario)
    }${
        describeSetup(scenario)
    }`;
}

export function describeRegisterVersionAction({
    version,
    implementationAddress,
}: {
    readonly version: bigint;
    readonly implementationAddress: string;
}): string {

    return `register ${describeVersion(version)}${
        implementationAddress != DeployAddress ? ` to ${implementationAddress}` : ''
    }`;
}
