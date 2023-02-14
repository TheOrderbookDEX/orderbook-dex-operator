import { describeCaller } from './caller';
import { describeOperatorFactoryScenario } from './factory';
import { describeSetup } from './setup';
import { describeVersion } from './version';

export function describeUpdateOperatorScenario(rest: {
    readonly version: bigint;
} & (
    Parameters<typeof describeUpdateOperatorAction>[0] &
    Parameters<typeof describeCaller>[0] &
    Parameters<typeof describeOperatorFactoryScenario>[0] &
    Parameters<typeof describeSetup>[0]
)) {
    return `${
        describeUpdateOperatorAction(rest)
    }${
        describeCaller(rest)
    }${
        describeOperatorFactoryScenario(rest)
    }${
        describeSetup(rest)
    }`;
}

export function describeUpdateOperatorAction({
    version,
    ...rest
}: {
    readonly version: bigint;
} & (
    Parameters<typeof describeCaller>[0]
)) {
    return `update operator to ${describeVersion(version)}${
        describeCaller(rest)
    }`;
}
