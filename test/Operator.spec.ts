import chai, { expect } from 'chai';
import { DefaultOverrides } from '@frugal-wizard/abi2ts-lib';
import chaiAsPromised from 'chai-as-promised';
import { describeError } from '@frugal-wizard/contract-test-helper';
import { withdrawERC20Scenarios } from './scenarios/withdrawERC20Scenarios';
import { UpgradeToScenario } from './scenario/UpgradeToScenario';

chai.use(chaiAsPromised);

DefaultOverrides.gasLimit = 5000000;

describe('Operator', () => {
    describe('upgradeTo', () => {
        new UpgradeToScenario().describe(({ it }) => {
            it('should revert', async (test) => {
                await expect(test.execute())
                    .to.be.rejected;
            });

            it('should revert without a reason', async (test) => {
                // checking for error thrown by ethers
                // TODO abi2ts should provide an error for revert without reason
                await expect(test.executeStatic())
                    .to.be.rejectedWith(Error)
                    .to.eventually.include({
                        code: 'CALL_EXCEPTION',
                        data: '0x',
                    });
            });
        });
    });

    describe('withdrawERC20', () => {
        for (const scenario of withdrawERC20Scenarios) {
            scenario.describe(({ it }) => {
                if (scenario.expectedError) {
                    it('should fail', async (test) => {
                        await expect(test.execute())
                            .to.be.rejected;
                    });

                    it(`should fail with ${describeError(scenario.expectedError)}`, async (test) => {
                        await expect(test.executeStatic())
                            .to.be.rejectedWith(scenario.expectedError as typeof Error);
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
});
