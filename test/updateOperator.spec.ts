import chai, { expect } from 'chai';
import { DefaultOverrides, getStorageSlot, hexstringPad } from '@frugal-wizard/abi2ts-lib';
import chaiAsPromised from 'chai-as-promised';
import chaiString from 'chai-string';
import { IOperatorBase } from '../src/interfaces/IOperatorBase';
import { updateOperatorScenarios } from './scenarios/updateOperator';
import { IMPLEMENTATION_SLOT } from './slots';

chai.use(chaiAsPromised);
chai.use(chaiString);

DefaultOverrides.gasLimit = 5000000;

describe('updateOperator', () => {
    for (const scenario of updateOperatorScenarios) {
        scenario.describe(({ it }) => {
            if (scenario.expectedError) {
                it('should fail', async (test) => {
                    await expect(test.execute())
                        .to.be.rejected;
                });

                it(`should fail with ${scenario.expectedError.name}`, async (test) => {
                    await expect(test.executeStatic())
                        .to.be.rejected.and.eventually.be.deep.equal(scenario.expectedError);
                });

            } else {
                it('should update the operator implementation to the provided version', async (test) => {
                    const { operatorFactory, caller } = test;
                    const implementation = await operatorFactory.versionImplementation(scenario.version);
                    const operator = IOperatorBase.at(await operatorFactory.operator(caller));
                    await test.execute();
                    expect(await operator.implementation())
                        .to.be.equalIgnoreCase(implementation);
                });

                it('should update the implementation slot', async (test) => {
                    const { operatorFactory, caller } = test;
                    const implementation = await operatorFactory.versionImplementation(scenario.version);
                    const operator = await operatorFactory.operator(caller);
                    await test.execute();
                    expect(await getStorageSlot(operator, IMPLEMENTATION_SLOT))
                        .to.be.equalIgnoreCase(hexstringPad(implementation, 64));
                });
            }
        });
    }
});
