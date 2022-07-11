import { DeployOperatorScenario } from '../scenario/DeployOperatorScenario';
import { Account, generatorChain } from '@theorderbookdex/contract-test-helper';
import { describer } from '../describer/describer';

export const deployOperatorScenarios: Iterable<DeployOperatorScenario> = generatorChain(function*() {
    yield {
        describer,
        owner: Account.MAIN,
    };
    yield {
        describer,
        owner: Account.SECOND,
    };

}).then(function*(properties) {
    yield new DeployOperatorScenario(properties);
});
