import chai, { expect } from 'chai';
import { DefaultOverrides, RevertWithoutReason } from '@frugal-wizard/abi2ts-lib';
import chaiAsPromised from 'chai-as-promised';
import { createUpgradeToScenario } from './scenario/upgradeTo';

chai.use(chaiAsPromised);

DefaultOverrides.gasLimit = 5000000;

describe('upgradeTo', () => {
    createUpgradeToScenario().describe(({ it }) => {
        it('should revert', async (test) => {
            await expect(test.execute())
                .to.be.rejected;
        });

        it('should revert without a reason', async (test) => {
            await expect(test.executeStatic())
                .to.be.rejectedWith(RevertWithoutReason);
        });
    });
});
