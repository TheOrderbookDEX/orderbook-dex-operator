import { Account, generatorChain } from '@frugal-wizard/contract-test-helper';
import { InvalidVersion, OperatorAlreadyCreated } from '../../src/OperatorFactory';
import { CreateOperatorAction } from '../action/CreateOperatorAction';
import { RegisterVersionAction } from '../action/RegisterVersionAction';
import { describer } from '../describer/describer';
import { CreateOperatorScenario } from '../scenario/CreateOperatorScenario';

export const createOperatorScenarios = generatorChain(function*() {
    for (const version of [ 0n, 10000n ]) {
        yield { describer, version };
    }

}).then(function*(properties) {
    yield {
        ...properties,
        setupActions: [ new RegisterVersionAction(properties) ],
    };

    yield {
        ...properties,
        setupActions: [ new RegisterVersionAction(properties) ],
        caller: Account.SECOND,
    };

    yield {
        ...properties,
        expectedError: InvalidVersion,
    };

    yield {
        ...properties,
        setupActions: [
            new RegisterVersionAction(properties),
            new CreateOperatorAction(properties),
        ],
        expectedError: OperatorAlreadyCreated,
    };

}).then(function*(properties) {
    yield new CreateOperatorScenario(properties);
});
