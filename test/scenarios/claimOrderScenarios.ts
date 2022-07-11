import { Account, generatorChain, range } from '@theorderbookdex/contract-test-helper';
import { describer } from '../describer/describer';
import { OrderbookVersionNotSupported, Unauthorized } from '../../src/Operator';
import { RegisterOperatorLogicAction } from '../action/RegisterOperatorLogicAction';
import { hexlify } from 'ethers/lib/utils';
import { ClaimOrderScenario } from '../scenario/ClaimOrderScenario';

export const claimOrderScenarios: [string, Iterable<ClaimOrderScenario>][] = [];

claimOrderScenarios.push([
    'claim order',
    generatorChain(function*() {
        yield { describer };

    }).then(function*(properties) {
        for (const orderId of range(1, 2)) {
            yield {
                ...properties,
                orderId: hexlify(orderId),
            };
        }

    }).then(function*(properties) {
        for (const extraData of range(1, 2)) {
            yield {
                ...properties,
                extraData: hexlify(extraData),
            };
        }

    }).then(function*(properties) {
        for (const orderbookVersion of [...range(1n, 2n)].map(v => v * 10000n)) {
            yield {
                ...properties,
                orderbookVersion,
            };
        }

    }).then(function*(properties) {
        yield {
            ...properties,
            setupActions: [
                new RegisterOperatorLogicAction({ describer, version: properties.orderbookVersion }),
            ],
        };

    }).then(function*(properties) {
        yield new ClaimOrderScenario(properties);
    })
]);

claimOrderScenarios.push([
    'claim order with errors',
    generatorChain(function*() {
        yield {
            describer,
            orderbookVersion: 10000n,
            orderId: '0x01',
            extraData: '0x',
            caller: Account.SECOND,
            setupActions: [
                new RegisterOperatorLogicAction({ describer, version: 10000n }),
            ],
            expectedError: Unauthorized,
        };
        yield {
            describer,
            orderbookVersion: 10000n,
            orderId: '0x01',
            extraData: '0x',
            setupActions: [ ],
            expectedError: OrderbookVersionNotSupported,
        };

    }).then(function*(properties) {
        yield new ClaimOrderScenario(properties);
    })
]);
