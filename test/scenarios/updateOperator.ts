import { Account, generatorChain } from '@frugal-wizard/contract-test-helper';
import { InvalidVersion, NoOperatorCreated } from '../../src/OperatorFactory';
import { createCreateOperatorAction } from '../action/createOperator';
import { createRegisterVersionAction } from '../action/registerVersion';
import { createUpdateOperatorScenario } from '../scenario/updateOperator';

export const updateOperatorScenarios = generatorChain(function*() {
    for (const caller of [ Account.MAIN, Account.SECOND ]) {
        yield {
            caller,
            version: 10000n,
            setupActions: [
                createRegisterVersionAction({ version: 0n }),
                createRegisterVersionAction({ version: 10000n }),
                createCreateOperatorAction({ caller, version: 0n }),
            ],
        };

        yield {
            caller,
            version: 10000n,
            setupActions: [
                createRegisterVersionAction({ version: 0n }),
                createRegisterVersionAction({ version: 10000n }),
            ],
            expectedError: new NoOperatorCreated(),
        };

        yield {
            caller,
            version: 10000n,
            setupActions: [
                createRegisterVersionAction({ version: 0n }),
                createCreateOperatorAction({ caller, version: 0n }),
            ],
            expectedError: new InvalidVersion(),
        };
    }

}).then(function*(props) {
    yield createUpdateOperatorScenario(props);
});
