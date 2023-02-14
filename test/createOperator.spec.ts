import chai, { expect } from 'chai';
import { DefaultOverrides, getStorageSlot, hexstringPad } from '@frugal-wizard/abi2ts-lib';
import chaiAsPromised from 'chai-as-promised';
import chaiString from 'chai-string';
import { is } from '@frugal-wizard/contract-test-helper';
import { OperatorCreated } from '../src/OperatorFactory';
import { createOperatorScenarios } from './scenarios/createOperator';
import { IOperatorBase } from '../src/interfaces/IOperatorBase';
import { ADMIN_SLOT, IMPLEMENTATION_SLOT, OWNER_SLOT } from './slots';

chai.use(chaiAsPromised);
chai.use(chaiString);

DefaultOverrides.gasLimit = 5000000;

describe('createOperator', () => {
    for (const scenario of createOperatorScenarios) {
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
                it('should create an operator whose owner is the caller', async (test) => {
                    const { caller } = test;
                    const operator = IOperatorBase.at(await test.executeStatic());
                    await test.execute();
                    expect(await operator.owner())
                        .to.be.equalIgnoreCase(caller);
                });

                it('should create an operator with the implementation of the provided version', async (test) => {
                    const { operatorFactory } = test;
                    const implementation = await operatorFactory.versionImplementation(scenario.version);
                    const operator = IOperatorBase.at(await test.executeStatic());
                    await test.execute();
                    expect(await operator.implementation())
                        .to.be.equalIgnoreCase(implementation);
                });

                it('should create an operator that has the owner stored in the expected slot', async (test) => {
                    const { caller } = test;
                    const operator = await test.executeStatic();
                    await test.execute();
                    expect(await getStorageSlot(operator, OWNER_SLOT))
                        .to.be.equalIgnoreCase(hexstringPad(caller, 64));
                });

                it('should create an operator that has the implementation stored in the expected slot', async (test) => {
                    const { operatorFactory } = test;
                    const implementation = await operatorFactory.versionImplementation(scenario.version);
                    const operator = await test.executeStatic();
                    await test.execute();
                    expect(await getStorageSlot(operator, IMPLEMENTATION_SLOT))
                        .to.be.equalIgnoreCase(hexstringPad(implementation, 64));
                });

                it('should create an operator that has the admin stored in the expected slot', async (test) => {
                    const { operatorFactory } = test;
                    const admin = operatorFactory.address;
                    const operator = await test.executeStatic();
                    await test.execute();
                    expect(await getStorageSlot(operator, ADMIN_SLOT))
                        .to.be.equalIgnoreCase(hexstringPad(admin, 64));
                });

                it('should register the created operator on the address book', async (test) => {
                    const { addressBook } = test;
                    const operator = await test.executeStatic();
                    await test.execute();
                    expect(await addressBook.id(operator))
                        .to.be.not.equal(0n);
                });

                it('should assign the new operator to the caller', async (test) => {
                    const { operatorFactory, caller } = test;
                    const operator = await test.executeStatic();
                    await test.execute();
                    expect(await operatorFactory.operator(caller))
                        .to.be.equalIgnoreCase(operator);
                });

                it('should emit an OperatorCreated event', async (test) => {
                    const { caller } = test;
                    const operator = await test.executeStatic();
                    const { events } = await test.execute();
                    const operatorCreatedEvents = events.filter(is(OperatorCreated));
                    expect(operatorCreatedEvents)
                        .to.have.length(1);
                    expect(operatorCreatedEvents[0].owner)
                        .to.be.equalIgnoreCase(caller);
                    expect(operatorCreatedEvents[0].operator)
                        .to.be.equalIgnoreCase(operator);
                });
            }
        });
    }
});
