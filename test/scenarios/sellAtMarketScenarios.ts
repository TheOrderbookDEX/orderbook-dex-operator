import { Account, generatorChain, range } from '@frugal-wizard/contract-test-helper';
import { describer } from '../describer/describer';
import { OrderbookVersionNotSupported, Unauthorized } from '../../src/Operator';
import { SellAtMarketScenario } from '../scenario/SellAtMarketScenario';
import { RegisterOperatorLogicAction } from '../action/RegisterOperatorLogicAction';
import { abiencode, parseValue } from '@frugal-wizard/abi2ts-lib';

export const sellAtMarketScenarios: [string, Iterable<SellAtMarketScenario>][] = [];

sellAtMarketScenarios.push([
    'sell at market',
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
        for (const minPrice of [...range(1, 2)].map(v => parseValue(v))) {
            yield {
                ...properties,
                minPrice,
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
        yield new SellAtMarketScenario(properties);
    })
]);

sellAtMarketScenarios.push([
    'sell at market with errors',
    generatorChain(function*() {
        yield {
            describer,
            orderbookVersion: 10000n,
            maxAmount: 1n,
            minPrice: parseValue(1),
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
            minPrice: parseValue(1),
            extraData: '0x',
            setupActions: [ ],
            expectedError: OrderbookVersionNotSupported,
        };

    }).then(function*(properties) {
        yield new SellAtMarketScenario(properties);
    })
]);
