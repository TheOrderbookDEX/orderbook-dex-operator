import { parseValue } from '@frugal-wizard/abi2ts-lib';
import { Account, generatorChain } from '@frugal-wizard/contract-test-helper';
import { Unauthorized } from '../../src/OperatorV0';
import { DepositERC20Action } from '../action/DepositERC20Action';
import { describer } from '../describer/describer';
import { WithdrawERC20Scenario } from '../scenario/WithdrawERC20Scenario';

// TODO test withdrawing multiple ERC20

export const withdrawERC20Scenarios = generatorChain(function*() {
    // test authorized / unathorized withdrawals
    for (const operatorOwner of [ Account.MAIN, Account.SECOND ]) {
        for (const caller of [ Account.MAIN, Account.SECOND ]) {
            yield {
                describer,
                caller,
                operatorOwner,
                amount: parseValue(1),
                setupActions: [ new DepositERC20Action({ describer, amount: parseValue(1), operatorOwner }) ],
                expectedError: operatorOwner != caller ? Unauthorized : undefined,
            };
        }
    }

    // test transfer amount exceeds balance
    yield {
        describer,
        amount: parseValue(1),
        expectedError: 'ERC20: transfer amount exceeds balance',
    };
    yield {
        describer,
        amount: parseValue(2),
        setupActions: [ new DepositERC20Action({ describer, amount: parseValue(1) }) ],
        expectedError: 'ERC20: transfer amount exceeds balance',
    };

}).then(function*(properties) {
    yield new WithdrawERC20Scenario(properties);
});
