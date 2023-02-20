import { DefaultError, parseValue } from '@frugalwizard/abi2ts-lib';
import { Account, generatorChain } from '@frugalwizard/contract-test-helper';
import { Unauthorized } from '../../src/OperatorV0';
import { createDepositERC20Action } from '../action/depositERC20';
import { createWithdrawERC20Scenario } from '../scenario/withdrawERC20';

// TODO test withdrawing multiple ERC20

export const withdrawERC20Scenarios = generatorChain(function*() {
    // test authorized / unathorized withdrawals
    for (const operatorOwner of [ Account.MAIN, Account.SECOND ]) {
        for (const caller of [ Account.MAIN, Account.SECOND ]) {
            yield {
                caller,
                operatorOwner,
                amount: parseValue(1),
                setupActions: [ createDepositERC20Action({ amount: parseValue(1), operatorOwner }) ],
                expectedError: operatorOwner != caller ? new Unauthorized() : undefined,
            };
        }
    }

    // test transfer amount exceeds balance
    yield {
        amount: parseValue(1),
        expectedError: new DefaultError('ERC20: transfer amount exceeds balance'),
    };
    yield {
        amount: parseValue(2),
        setupActions: [ createDepositERC20Action({ amount: parseValue(1) }) ],
        expectedError: new DefaultError('ERC20: transfer amount exceeds balance'),
    };

}).then(function*(props) {
    yield createWithdrawERC20Scenario(props);
});
