import { describeCaller } from './caller';
import { describeOperatorFactoryScenario } from './factory';
import { describeSetup } from './setup';
import { describeVersion } from './version';

export function describeCreateOperatorScenario(scenario: (
    Parameters<typeof describeCreateOperatorAction>[0] &
    Parameters<typeof describeOperatorFactoryScenario>[0] &
    Parameters<typeof describeSetup>[0]
)) {
    return `${
        describeCreateOperatorAction(scenario)
    }${
        describeOperatorFactoryScenario(scenario)
    }${
        describeSetup(scenario)
    }`;
}

export function describeCreateOperatorAction({
    version,
    ...rest
}: {
    readonly version: bigint;
} & (
    Parameters<typeof describeCaller>[0]
)) {
    return `create operator ${describeVersion(version)}${
        describeCaller(rest)
    }`;
}
