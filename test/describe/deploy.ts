import { describeOperatorFactoryScenario } from './factory';

export function describeDeployOperatorFactoryScenario(scenario: (
    Parameters<typeof describeOperatorFactoryScenario>[0]
)): string {

    return `deploy${describeOperatorFactoryScenario(scenario)}`;
}
