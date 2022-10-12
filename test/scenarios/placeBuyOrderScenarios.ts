import { Account, generatorChain, range } from '@frugal-wizard/contract-test-helper';
import { describer } from '../describer/describer';
import { OrderbookVersionNotSupported, Unauthorized } from '../../src/Operator';
import { RegisterOperatorLogicAction } from '../action/RegisterOperatorLogicAction';
import { PlaceBuyOrderScenario } from '../scenario/PlaceBuyOrderScenario';
import { abiencode, parseValue } from '@frugal-wizard/abi2ts-lib';

export const placeBuyOrderScenarios: [string, Iterable<PlaceBuyOrderScenario>][] = [];

placeBuyOrderScenarios.push([
    'place buy order',
    generatorChain(function*() {
        yield { describer };

    }).then(function*(properties) {
        for (const maxAmount of range(1n, 2n)) {
            yield {
                ...properties,
                maxAmount,
            };
        }

    }).then(function*(properties) {
        for (const price of [...range(1, 2)].map(v => parseValue(v))) {
            yield {
                ...properties,
                price,
            };
        }

    }).then(function*(properties) {
        for (const extraData of range(1, 2)) {
            yield {
                ...properties,
                extraData: abiencode(['uint8'], [extraData]),
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
        yield new PlaceBuyOrderScenario(properties);
    })
]);

placeBuyOrderScenarios.push([
    'place buy order with errors',
    generatorChain(function*() {
        yield {
            describer,
            orderbookVersion: 10000n,
            maxAmount: 1n,
            price: parseValue(1),
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
            maxAmount: 1n,
            price: parseValue(1),
            extraData: '0x',
            setupActions: [ ],
            expectedError: OrderbookVersionNotSupported,
        };

    }).then(function*(properties) {
        yield new PlaceBuyOrderScenario(properties);
    })
]);
