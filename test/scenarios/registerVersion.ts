import { Account, Addresses, generatorChain } from '@frugal-wizard/contract-test-helper';
import { InvalidImplementation, Unauthorized, VersionAlreadyRegistered } from '../../src/OperatorFactory';
import { createRegisterVersionAction } from '../action/registerVersion';
import { createRegisterVersionScenario } from '../scenario/registerVersion';

export const registerVersionScenarios = generatorChain(function*() {
    yield {
        version: 0n,
    };

    yield {
        version: 10000n,
    };

    yield {
        version: 0n,
        versionManager: Account.SECOND,
        expectedError: new Unauthorized(),
    };

    yield {
        version: 0n,
        setupActions: [ createRegisterVersionAction({ version: 0n }) ],
        expectedError: new VersionAlreadyRegistered(),
    };

    yield {
        version: 0n,
        implementationAddress: Addresses.ZERO,
        expectedError: new InvalidImplementation(),
    };

    yield {
        version: 0n,
        implementationAddress: Addresses.RANDOM,
        expectedError: new InvalidImplementation(),
    };

}).then(function*(props) {
    yield createRegisterVersionScenario(props);
});
