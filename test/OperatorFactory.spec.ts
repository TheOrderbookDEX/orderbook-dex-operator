import chai, { expect } from 'chai';
import { DefaultOverrides, getProvider, hexstringPad } from '@frugal-wizard/abi2ts-lib';
import chaiAsPromised from 'chai-as-promised';
import chaiString from 'chai-string';
import { describeError, is } from '@frugal-wizard/contract-test-helper';
import { deployOperatorFactoryScenarios } from './scenarios/deployOperatorFactoryScenarios';
import { registerVersionScenarios } from './scenarios/registerVersionScenarios';
import { OperatorCreated, OperatorVersionRegistered } from '../src/OperatorFactory';
import { createOperatorScenarios } from './scenarios/createOperatorScenarios';
import { IOperatorBase } from '../src/interfaces/IOperatorBase';
import { updateOperatorScenarios } from './scenarios/updateOperatorScenarios';

chai.use(chaiAsPromised);
chai.use(chaiString);

DefaultOverrides.gasLimit = 5000000;

const OWNER_SLOT = '0x02016836a56b71f0d02689e69e326f4f4c1b9057164ef592671cf0d37c8040c1';
const IMPLEMENTATION_SLOT = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';
const ADMIN_SLOT = '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103';

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
                        // TODO abi2ts should provide a method to get value at storage slot
                        expect(await getProvider().getStorageAt(operator, OWNER_SLOT))
                            .to.be.equalIgnoreCase(hexstringPad(caller, 64));
                    });

                    it('should create an operator that has the implementation stored in the expected slot', async (test) => {
                        const { operatorFactory } = test;
                        const implementation = await operatorFactory.versionImplementation(scenario.version);
                        const operator = await test.executeStatic();
                        await test.execute();
                        // TODO abi2ts should provide a method to get value at storage slot
                        expect(await getProvider().getStorageAt(operator, IMPLEMENTATION_SLOT))
                            .to.be.equalIgnoreCase(hexstringPad(implementation, 64));
                    });

                    it('should create an operator that has the admin stored in the expected slot', async (test) => {
                        const { operatorFactory } = test;
                        const admin = operatorFactory.address;
                        const operator = await test.executeStatic();
                        await test.execute();
                        // TODO abi2ts should provide a method to get value at storage slot
                        expect(await getProvider().getStorageAt(operator, ADMIN_SLOT))
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
                        // TODO abi2ts should provide a method to get value at storage slot
                        expect(await getProvider().getStorageAt(operator, IMPLEMENTATION_SLOT))
                            .to.be.equalIgnoreCase(hexstringPad(implementation, 64));
                    });
                }
            });
        }
    });
});
