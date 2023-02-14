import chai, { expect } from 'chai';
import { DefaultOverrides } from '@frugal-wizard/abi2ts-lib';
import chaiAsPromised from 'chai-as-promised';
import chaiString from 'chai-string';
import { is } from '@frugal-wizard/contract-test-helper';
import { registerVersionScenarios } from './scenarios/registerVersion';
import { OperatorVersionRegistered } from '../src/OperatorFactory';

chai.use(chaiAsPromised);
chai.use(chaiString);

DefaultOverrides.gasLimit = 5000000;

describe('registerVersion', () => {
    for (const scenario of registerVersionScenarios) {
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
                it('should register the provided implementation to the provided version', async (test) => {
                    const { operatorFactory } = test;
                    await test.execute();
                    expect(await operatorFactory.versionImplementation(scenario.version))
                        .to.be.equalIgnoreCase(test.implementation.address);
                });

                it('should emit an OperatorVersionRegistered event', async (test) => {
                    const { events } = await test.execute();
                    const versionRegisteredEvents = events.filter(is(OperatorVersionRegistered));
                    expect(versionRegisteredEvents)
                        .to.have.length(1);
                    expect(versionRegisteredEvents[0].version)
                        .to.be.equal(scenario.version);
                    expect(versionRegisteredEvents[0].implementation)
                        .to.be.equalIgnoreCase(test.implementation.address);
                });
            }
        });
    }
});
