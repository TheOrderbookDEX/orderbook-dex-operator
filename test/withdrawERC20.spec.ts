import chai, { expect } from 'chai';
import { DefaultOverrides, RevertWithoutReason } from '@frugal-wizard/abi2ts-lib';
import chaiAsPromised from 'chai-as-promised';
import { withdrawERC20Scenarios } from './scenarios/withdrawERC20';

chai.use(chaiAsPromised);

DefaultOverrides.gasLimit = 5000000;

describe('withdrawERC20', () => {
    for (const scenario of withdrawERC20Scenarios) {
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
                it('should decrease balance of operator accordingly', async (test) => {
                    const { amount } = scenario;
                    const { erc20, operator } = test;
                    const expected = await erc20.balanceOf(operator) - amount;
                    await test.execute();
                    expect(await erc20.balanceOf(operator))
                        .to.be.equal(expected);
                });

                it('should increase balance of caller accordingly', async (test) => {
                    const { amount } = scenario;
                    const { erc20, caller } = test;
                    const expected = await erc20.balanceOf(caller) + amount;
                    await test.execute();
                    expect(await erc20.balanceOf(caller))
                        .to.be.equal(expected);
                });
            }
        });
    }
});
