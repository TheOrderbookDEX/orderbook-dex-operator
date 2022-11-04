import { DeployOperatorFactoryScenario } from '../scenario/DeployOperatorFactoryScenario';
import { Account, generatorChain } from '@frugal-wizard/contract-test-helper';
import { describer } from '../describer/describer';

export const deployOperatorFactoryScenarios = generatorChain(function*() {
    yield {
        describer,
        versionManager: Account.MAIN,
    };
    yield {
        describer,
        versionManager: Account.SECOND,
    };

}).then(function*(properties) {
    yield new DeployOperatorFactoryScenario(properties);
});
