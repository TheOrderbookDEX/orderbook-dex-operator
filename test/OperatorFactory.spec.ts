import chai, { expect } from 'chai';
import { DefaultOverrides } from '@frugal-wizard/abi2ts-lib';
import chaiAsPromised from 'chai-as-promised';
import { describeError, is } from '@frugal-wizard/contract-test-helper';
import { deployOperatorFactoryScenarios } from './scenarios/deployOperatorFactoryScenarios';
import { registerVersionScenarios } from './scenarios/registerVersionScenarios';
import { OperatorCreated, OperatorVersionRegistered } from '../src/OperatorFactory';
import { createOperatorScenarios } from './scenarios/createOperatorScenarios';
import { IOperatorBase } from '../src/interfaces/IOperatorBase';
import { updateOperatorScenarios } from './scenarios/updateOperatorScenarios';

chai.use(chaiAsPromised);

DefaultOverrides.gasLimit = 5000000;

// TODO test proxy storage slots
// TODO test operator owner storage slot

describe('OperatorFactory', () => {
    describe('deploy', () => {
        for (const scenario of deployOperatorFactoryScenarios) {
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
                    it('should deploy with the provided version manager', async (test) => {
                        const operatorFactory = await test.execute();
                        expect(await operatorFactory.versionManager())
                            .to.be.equal(test[scenario.versionManager]);
                    });

                    it('should deploy with the provided address book', async (test) => {
                        const operatorFactory = await test.execute();
                        expect(await operatorFactory.addressBook())
                            .to.be.equal(test.addressBook.address);
                    });
                }
            });
        }
    });

    describe('registerVersion', () => {
        for (const scenario of registerVersionScenarios) {
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
                    it('should register the provided implementation to the provided version', async (test) => {
                        const { operatorFactory } = test;
                        await test.execute();
                        expect(await operatorFactory.versionImplementation(scenario.version))
                            .to.be.equal(test.implementation.address);
                    });

                    it('should emit an OperatorVersionRegistered event', async (test) => {
                        const { events } = await test.execute();
                        const versionRegisteredEvents = events.filter(is(OperatorVersionRegistered));
                        expect(versionRegisteredEvents)
                            .to.have.length(1);
                        expect(versionRegisteredEvents[0].version)
                            .to.be.equal(scenario.version);
                        expect(versionRegisteredEvents[0].implementation)
                            .to.be.equal(test.implementation.address);
                    });
                }
            });
        }
    });

    describe('createOperator', () => {
        for (const scenario of createOperatorScenarios) {
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
                    it('should create an operator whose owner is the caller', async (test) => {
                        const { caller } = test;
                        const operator = IOperatorBase.at(await test.executeStatic());
                        await test.execute();
                        expect(await operator.owner())
                            .to.be.equal(caller);
                    });

                    it('should create an operator with the implementation of the provided version', async (test) => {
                        const { operatorFactory } = test;
                        const operator = IOperatorBase.at(await test.executeStatic());
                        await test.execute();
                        expect(await operator.implementation())
                            .to.be.equal(await operatorFactory.versionImplementation(scenario.version));
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
                            .to.be.equal(operator);
                    });

                    it('should emit an OperatorCreated event', async (test) => {
                        const { caller } = test;
                        const operator = await test.executeStatic();
                        const { events } = await test.execute();
                        const operatorCreatedEvents = events.filter(is(OperatorCreated));
                        expect(operatorCreatedEvents)
                            .to.have.length(1);
                        expect(operatorCreatedEvents[0].owner)
                            .to.be.equal(caller);
                        expect(operatorCreatedEvents[0].operator)
                            .to.be.equal(operator);
                    });
                }
            });
        }
    });

    describe('updateOperator', () => {
        for (const scenario of updateOperatorScenarios) {
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
                    it('should update the operator implementation to the provided version', async (test) => {
                        const { operatorFactory, caller } = test;
                        const operator = IOperatorBase.at(await operatorFactory.operator(caller));
                        await test.execute();
                        expect(await operator.implementation())
                            .to.be.equal(await operatorFactory.versionImplementation(scenario.version));
                    });
                }
            });
        }
    });
});
