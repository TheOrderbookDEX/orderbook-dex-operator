import { parseValue } from '@frugal-wizard/abi2ts-lib';
import { Account, generatorChain } from '@frugal-wizard/contract-test-helper';
import { Unauthorized } from '../../src/OperatorV0';
import { DepositERC20Action } from '../action/DepositERC20Action';
import { describer } from '../describer/describer';
import { WithdrawERC20Scenario } from '../scenario/WithdrawERC20Scenario';

// TODO add more withdraw ERC20 tests
// TODO test withdrawing multiple ERC20

export const withdrawERC20Scenarios = generatorChain(function*() {
    yield {
        describer,
        amount: parseValue(1),
        setupActions: [ new DepositERC20Action({ describer, amount: parseValue(1) }) ],
    };

    yield {
        describer,
        caller: Account.SECOND,
        amount: parseValue(1),
        setupActions: [ new DepositERC20Action({ describer, amount: parseValue(1) }) ],
        expectedError: Unauthorized,
    };

    yield {
        describer,
        caller: Account.SECOND,
        operatorOwner: Account.SECOND,
        amount: parseValue(1),
        setupActions: [ new DepositERC20Action({ describer, amount: parseValue(1), operatorOwner: Account.SECOND }) ],
    };

    yield {
        describer,
        operatorOwner: Account.SECOND,
        amount: parseValue(1),
        setupActions: [ new DepositERC20Action({ describer, amount: parseValue(1), operatorOwner: Account.SECOND }) ],
        expectedError: Unauthorized,
    };

}).then(function*(properties) {
    yield new WithdrawERC20Scenario(properties);
});
