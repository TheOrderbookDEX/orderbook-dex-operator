import chai, { expect } from 'chai';
import { DefaultOverrides } from '@frugal-wizard/abi2ts-lib';
import chaiAsPromised from 'chai-as-promised';
import chaiString from 'chai-string';
import { deployOperatorFactoryScenarios } from './scenarios/deploy';

chai.use(chaiAsPromised);
chai.use(chaiString);

DefaultOverrides.gasLimit = 5000000;

describe('deploy', () => {
    for (const scenario of deployOperatorFactoryScenarios) {
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
                it('should deploy with the provided version manager', async (test) => {
                    const operatorFactory = await test.execute();
                    expect(await operatorFactory.versionManager())
                        .to.be.equalIgnoreCase(test[scenario.versionManager]);
                });

                it('should deploy with the provided address book', async (test) => {
                    const operatorFactory = await test.execute();
                    expect(await operatorFactory.addressBook())
                        .to.be.equalIgnoreCase(test.addressBook.address);
                });
            }
        });
    }
});
