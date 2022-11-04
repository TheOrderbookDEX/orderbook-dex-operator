import { Account, generatorChain } from '@frugal-wizard/contract-test-helper';
import { InvalidVersion, NoOperatorCreated } from '../../src/OperatorFactory';
import { CreateOperatorAction } from '../action/CreateOperatorAction';
import { RegisterVersionAction } from '../action/RegisterVersionAction';
import { describer } from '../describer/describer';
import { UpdateOperatorScenario } from '../scenario/UpdateOperatorScenario';

export const updateOperatorScenarios = generatorChain(function*() {
    for (const caller of [ Account.MAIN, Account.SECOND ]) {
        yield {
            describer,
            caller,
            version: 10000n,
            setupActions: [
                new RegisterVersionAction({ describer, version: 0n }),
                new RegisterVersionAction({ describer, version: 10000n }),
                new CreateOperatorAction({ describer, caller, version: 0n }),
            ],
        };

        yield {
            describer,
            caller,
            version: 10000n,
            setupActions: [
                new RegisterVersionAction({ describer, version: 0n }),
                new RegisterVersionAction({ describer, version: 10000n }),
            ],
            expectedError: NoOperatorCreated,
        };

        yield {
            describer,
            caller,
            version: 10000n,
            setupActions: [
                new RegisterVersionAction({ describer, version: 0n }),
                new CreateOperatorAction({ describer, caller, version: 0n }),
            ],
            expectedError: InvalidVersion,
        };
    }

}).then(function*(properties) {
    yield new UpdateOperatorScenario(properties);
});
