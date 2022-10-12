import { Account, generatorChain, range } from '@frugal-wizard/contract-test-helper';
import { describer } from '../describer/describer';
import { WithdrawERC20Scenario } from '../scenario/WithdrawScenario';
import { TransferTokensToOperatorAction } from '../action/TransferTokensToOperatorAction';
import { Unauthorized } from '../../src/Operator';
import { parseValue } from '@frugal-wizard/abi2ts-lib';

export const withdrawERC20Scenarios: [string, Iterable<WithdrawERC20Scenario>][] = [];

withdrawERC20Scenarios.push([
    'withdraw',
    generatorChain(function*() {
        yield {
            describer,
            setupActions: [
                new TransferTokensToOperatorAction({ describer, amount: parseValue(3) }),
            ],
        };

    }).then(function*(properties) {
        for (const amount of [...range(1, 3)].map(v => parseValue(v))) {
            yield {
                ...properties,
                amount,
            }
        }

    }).then(function*(properties) {
        yield new WithdrawERC20Scenario(properties);
    })
]);

withdrawERC20Scenarios.push([
    'withdraw with errors',
    generatorChain(function*() {
        yield {
            describer,
            amount: parseValue(1),
            expectedError: 'ERC20: transfer amount exceeds balance',
        };
        yield {
            describer,
            amount: parseValue(1),
            caller: Account.SECOND,
            setupActions: [
                new TransferTokensToOperatorAction({ describer, amount: parseValue(1) }),
            ],
            expectedError: Unauthorized,
        };

    }).then(function*(properties) {
        yield new WithdrawERC20Scenario(properties);
    })
]);
