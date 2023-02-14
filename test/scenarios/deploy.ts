import { createDeployOperatorFactoryScenario } from '../scenario/deploy';
import { Account, generatorChain } from '@frugal-wizard/contract-test-helper';

export const deployOperatorFactoryScenarios = generatorChain(function*() {
    yield {
        versionManager: Account.MAIN,
    };

    yield {
        versionManager: Account.SECOND,
    };

}).then(function*(props) {
    yield createDeployOperatorFactoryScenario(props);
});
