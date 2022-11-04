import { Account, generatorChain } from '@frugal-wizard/contract-test-helper';
import { InvalidImplementation, Unauthorized, VersionAlreadyRegistered } from '../../src/OperatorFactory';
import { RegisterVersionAction } from '../action/RegisterVersionAction';
import { describer } from '../describer/describer';
import { RegisterVersionScenario } from '../scenario/RegisterVersionScenario';

export const registerVersionScenarios = generatorChain(function*() {
    yield {
        describer,
        version: 0n,
    };

    yield {
        describer,
        version: 10000n,
    };

    yield {
        describer,
        version: 0n,
        versionManager: Account.SECOND,
        expectedError: Unauthorized,
    };

    yield {
        describer,
        version: 0n,
        setupActions: [ new RegisterVersionAction({ describer, version: 0n }) ],
        expectedError: VersionAlreadyRegistered,
    };

    yield {
        describer,
        version: 0n,
        implementation: '0x0000000000000000000000000000000000000000',
        expectedError: InvalidImplementation,
    };

    yield {
        describer,
        version: 0n,
        implementation: '0x1000000000000000000000000000000000000000',
        expectedError: InvalidImplementation,
    };

}).then(function*(properties) {
    yield new RegisterVersionScenario(properties);
});
