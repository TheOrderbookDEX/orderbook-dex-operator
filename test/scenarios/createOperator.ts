import { Account, generatorChain } from '@frugal-wizard/contract-test-helper';
import { InvalidVersion, OperatorAlreadyCreated } from '../../src/OperatorFactory';
import { createCreateOperatorAction } from '../action/createOperator';
import { createRegisterVersionAction } from '../action/registerVersion';
import { createCreateOperatorScenario } from '../scenario/createOperator';

export const createOperatorScenarios = generatorChain(function*() {
    for (const version of [ 0n, 10000n ]) {
        yield { version };
    }

}).then(function*(props) {
    yield {
        ...props,
        setupActions: [ createRegisterVersionAction(props) ],
    };

    yield {
        ...props,
        setupActions: [ createRegisterVersionAction(props) ],
        caller: Account.SECOND,
    };

    yield {
        ...props,
        expectedError: new InvalidVersion(),
    };

    yield {
        ...props,
        setupActions: [
            createRegisterVersionAction(props),
            createCreateOperatorAction(props),
        ],
        expectedError: new OperatorAlreadyCreated(),
    };

}).then(function*(props) {
    yield createCreateOperatorScenario(props);
});
