import { parseValue } from '@frugal-wizard/abi2ts-lib';
import { generatorChain } from '@frugal-wizard/contract-test-helper';
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

}).then(function*(properties) {
    yield new WithdrawERC20Scenario(properties);
});
