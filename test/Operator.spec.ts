import chai, { expect } from 'chai';
import { DefaultOverrides } from '@frugal-wizard/abi2ts-lib';
import chaiAsPromised from 'chai-as-promised';
import { describeError, is } from '@frugal-wizard/contract-test-helper';
import { RegisterCalled } from '../src/testing/AddressBookMock';
import { BuyAtMarketCalled, PlaceBuyOrderCalled, CancelOrderCalled, ClaimOrderCalled, SellAtMarketCalled, PlaceSellOrderCalled, TransferOrderCalled } from '../src/testing/OperatorLogicMock';
import { buyAtMarketScenarios } from './scenarios/buyAtMarketScenarios';
import { placeBuyOrderScenarios } from './scenarios/placeBuyOrderScenarios';
import { cancelOrderScenarios } from './scenarios/cancelOrderScenarios';
import { claimOrderScenarios } from './scenarios/claimOrderScenarios';
import { deployOperatorScenarios } from './scenarios/deployOperatorScenarios';
import { sellAtMarketScenarios } from './scenarios/sellAtMarketScenarios';
import { placeSellOrderScenarios } from './scenarios/placeSellOrderScenarios';
import { transferOrderScenarios } from './scenarios/transferOrderScenarios';
import { withdrawERC20Scenarios } from './scenarios/withdrawScenarios';

chai.use(chaiAsPromised);

DefaultOverrides.gasLimit = 5000000;

describe('Operator', () => {
    describe('deploy', () => {
        for (const scenario of deployOperatorScenarios) {
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
                    it('should deploy with the provided owner', async (test) => {
                        const operator = await test.execute();
                        expect(await operator.owner())
                            .to.be.equal(test[scenario.owner]);
                    });

                    it('should deploy with the provided logic registry', async (test) => {
                        const operator = await test.execute();
                        expect(await operator.logicRegistry())
                            .to.be.equal(test.logicRegistry.address);
                    });

                    it('should register on the provided address book', async (test) => {
                        const operator = await test.execute();
                        const { events } = await operator.getDeployTransaction();
                        const registerCalledEvents = events.filter(is(RegisterCalled));
                        expect(registerCalledEvents)
                            .to.have.length(1);
                        expect(registerCalledEvents[0].sender)
                            .to.be.equal(operator.address);
                    });
                }
            });
        }
    });

    describe('withdrawERC20', () => {
        for (const [ description, scenarios ] of withdrawERC20Scenarios) {
            describe(description, () => {
                for (const scenario of scenarios) {
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
                                const { testToken, operator } = test;
                                const expected = await testToken.balanceOf(operator) - amount;
                                await test.execute();
                                expect(await testToken.balanceOf(operator))
                                    .to.be.equal(expected);
                            });

                            it('should increase balance of caller accordingly', async (test) => {
                                const { amount } = scenario;
                                const { testToken, mainAccount } = test;
                                const expected = await testToken.balanceOf(mainAccount) + amount;
                                await test.execute();
                                expect(await testToken.balanceOf(mainAccount))
                                    .to.be.equal(expected);
                            });
                        }
                    });
                }
            });
        }
    });

    describe('buyAtMarket', () => {
        for (const [ description, scenarios ] of buyAtMarketScenarios) {
            describe(description, () => {
                for (const scenario of scenarios) {
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
                            it('should call the appropriate operator logic', async (test) => {
                                const { maxAmount, maxPrice, extraData } = scenario;
                                const { orderbook, [scenario.caller]: caller } = test;
                                const { events } = await test.execute();
                                const buyAtMarketCalledEvents = events.filter(is(BuyAtMarketCalled));
                                expect(buyAtMarketCalledEvents)
                                    .to.have.length(1);
                                expect(buyAtMarketCalledEvents[0].sender)
                                    .to.be.equal(caller);
                                expect(buyAtMarketCalledEvents[0].orderbook)
                                    .to.be.equal(orderbook.address);
                                expect(buyAtMarketCalledEvents[0].maxAmount)
                                    .to.be.equal(maxAmount);
                                expect(buyAtMarketCalledEvents[0].maxPrice)
                                    .to.be.equal(maxPrice);
                                expect(buyAtMarketCalledEvents[0].extraData)
                                    .to.be.equal(extraData);
                            });

                            it('should return expected values', async (test) => {
                                const result = await test.executeStatic();
                                expect(result.amountBought)
                                    .to.be.equal(scenario.amountBought);
                                expect(result.amountPaid)
                                    .to.be.equal(scenario.amountPaid);
                                expect(result.failed)
                                    .to.be.equal(scenario.failed);
                                expect(result.error)
                                    .to.be.equal(scenario.error);
                            });
                        }
                    });
                }
            });
        }
    });

    describe('sellAtMarket', () => {
        for (const [ description, scenarios ] of sellAtMarketScenarios) {
            describe(description, () => {
                for (const scenario of scenarios) {
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
                            it('should call the appropriate operator logic', async (test) => {
                                const { maxAmount, minPrice, extraData } = scenario;
                                const { orderbook, [scenario.caller]: caller } = test;
                                const { events } = await test.execute();
                                const sellAtMarketCalledEvents = events.filter(is(SellAtMarketCalled));
                                expect(sellAtMarketCalledEvents)
                                    .to.have.length(1);
                                expect(sellAtMarketCalledEvents[0].sender)
                                    .to.be.equal(caller);
                                expect(sellAtMarketCalledEvents[0].orderbook)
                                    .to.be.equal(orderbook.address);
                                expect(sellAtMarketCalledEvents[0].maxAmount)
                                    .to.be.equal(maxAmount);
                                expect(sellAtMarketCalledEvents[0].maxPrice)
                                    .to.be.equal(minPrice);
                                expect(sellAtMarketCalledEvents[0].extraData)
                                    .to.be.equal(extraData);
                            });

                            it('should return expected values', async (test) => {
                                const result = await test.executeStatic();
                                expect(result.amountSold)
                                    .to.be.equal(scenario.amountSold);
                                expect(result.amountReceived)
                                    .to.be.equal(scenario.amountReceived);
                                expect(result.failed)
                                    .to.be.equal(scenario.failed);
                                expect(result.error)
                                    .to.be.equal(scenario.error);
                            });
                        }
                    });
                }
            });
        }
    });

    describe('placeBuyOrder', () => {
        for (const [ description, scenarios ] of placeBuyOrderScenarios) {
            describe(description, () => {
                for (const scenario of scenarios) {
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
                            it('should call the appropriate operator logic', async (test) => {
                                const { maxAmount, price, extraData } = scenario;
                                const { orderbook, [scenario.caller]: caller } = test;
                                const { events } = await test.execute();
                                const placeBuyOrderCalledEvents = events.filter(is(PlaceBuyOrderCalled));
                                expect(placeBuyOrderCalledEvents)
                                    .to.have.length(1);
                                expect(placeBuyOrderCalledEvents[0].sender)
                                    .to.be.equal(caller);
                                expect(placeBuyOrderCalledEvents[0].orderbook)
                                    .to.be.equal(orderbook.address);
                                expect(placeBuyOrderCalledEvents[0].maxAmount)
                                    .to.be.equal(maxAmount);
                                expect(placeBuyOrderCalledEvents[0].price)
                                    .to.be.equal(price);
                                expect(placeBuyOrderCalledEvents[0].extraData)
                                    .to.be.equal(extraData);
                            });

                            it('should return expected values', async (test) => {
                                const result = await test.executeStatic();
                                expect(result.amountBought)
                                    .to.be.equal(scenario.amountBought);
                                expect(result.amountPaid)
                                    .to.be.equal(scenario.amountPaid);
                                expect(result.amountPlaced)
                                    .to.be.equal(scenario.amountPlaced);
                                expect(result.orderId)
                                    .to.be.equal(scenario.orderId);
                                expect(result.failed)
                                    .to.be.equal(scenario.failed);
                                expect(result.error)
                                    .to.be.equal(scenario.error);
                            });
                        }
                    });
                }
            });
        }
    });

    describe('placeSellOrder', () => {
        for (const [ description, scenarios ] of placeSellOrderScenarios) {
            describe(description, () => {
                for (const scenario of scenarios) {
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
                            it('should call the appropriate operator logic', async (test) => {
                                const { maxAmount, price, extraData } = scenario;
                                const { orderbook, [scenario.caller]: caller } = test;
                                const { events } = await test.execute();
                                const placeSellOrderCalledEvents = events.filter(is(PlaceSellOrderCalled));
                                expect(placeSellOrderCalledEvents)
                                    .to.have.length(1);
                                expect(placeSellOrderCalledEvents[0].sender)
                                    .to.be.equal(caller);
                                expect(placeSellOrderCalledEvents[0].orderbook)
                                    .to.be.equal(orderbook.address);
                                expect(placeSellOrderCalledEvents[0].maxAmount)
                                    .to.be.equal(maxAmount);
                                expect(placeSellOrderCalledEvents[0].price)
                                    .to.be.equal(price);
                                expect(placeSellOrderCalledEvents[0].extraData)
                                    .to.be.equal(extraData);
                            });

                            it('should return expected values', async (test) => {
                                const result = await test.executeStatic();
                                expect(result.amountSold)
                                    .to.be.equal(scenario.amountSold);
                                expect(result.amountReceived)
                                    .to.be.equal(scenario.amountReceived);
                                expect(result.amountPlaced)
                                    .to.be.equal(scenario.amountPlaced);
                                expect(result.orderId)
                                    .to.be.equal(scenario.orderId);
                                expect(result.failed)
                                    .to.be.equal(scenario.failed);
                                expect(result.error)
                                    .to.be.equal(scenario.error);
                            });
                        }
                    });
                }
            });
        }
    });

    describe('claimOrder', () => {
        for (const [ description, scenarios ] of claimOrderScenarios) {
            describe(description, () => {
                for (const scenario of scenarios) {
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
                            it('should call the appropriate operator logic', async (test) => {
                                const { orderId, extraData } = scenario;
                                const { orderbook, [scenario.caller]: caller } = test;
                                const { events } = await test.execute();
                                const claimOrderCalledEvents = events.filter(is(ClaimOrderCalled));
                                expect(claimOrderCalledEvents)
                                    .to.have.length(1);
                                expect(claimOrderCalledEvents[0].sender)
                                    .to.be.equal(caller);
                                expect(claimOrderCalledEvents[0].orderbook)
                                    .to.be.equal(orderbook.address);
                                expect(claimOrderCalledEvents[0].orderId)
                                    .to.be.equal(orderId);
                                expect(claimOrderCalledEvents[0].extraData)
                                    .to.be.equal(extraData);
                            });

                            it('should return expected values', async (test) => {
                                const result = await test.executeStatic();
                                expect(result.amountClaimed)
                                    .to.be.equal(scenario.amountClaimed);
                                expect(result.failed)
                                    .to.be.equal(scenario.failed);
                                expect(result.error)
                                    .to.be.equal(scenario.error);
                            });
                        }
                    });
                }
            });
        }
    });

    describe('transferOrder', () => {
        for (const [ description, scenarios ] of transferOrderScenarios) {
            describe(description, () => {
                for (const scenario of scenarios) {
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
                            it('should call the appropriate operator logic', async (test) => {
                                const { orderId } = scenario;
                                const { orderbook, [scenario.caller]: caller, [scenario.recipient]: recipient } = test;
                                const { events } = await test.execute();
                                const transferOrderCalledEvents = events.filter(is(TransferOrderCalled));
                                expect(transferOrderCalledEvents)
                                    .to.have.length(1);
                                expect(transferOrderCalledEvents[0].sender)
                                    .to.be.equal(caller);
                                expect(transferOrderCalledEvents[0].orderbook)
                                    .to.be.equal(orderbook.address);
                                expect(transferOrderCalledEvents[0].orderId)
                                    .to.be.equal(orderId);
                                expect(transferOrderCalledEvents[0].recipient)
                                    .to.be.equal(recipient);
                            });

                            it('should return expected values', async (test) => {
                                const result = await test.executeStatic();
                                expect(result.failed)
                                    .to.be.equal(scenario.failed);
                                expect(result.error)
                                    .to.be.equal(scenario.error);
                            });
                        }
                    });
                }
            });
        }
    });

    describe('cancelOrder', () => {
        for (const [ description, scenarios ] of cancelOrderScenarios) {
            describe(description, () => {
                for (const scenario of scenarios) {
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
                            it('should call the appropriate operator logic', async (test) => {
                                const { orderId, extraData } = scenario;
                                const { orderbook, [scenario.caller]: caller } = test;
                                const { events } = await test.execute();
                                const cancelOrderCalledEvents = events.filter(is(CancelOrderCalled));
                                expect(cancelOrderCalledEvents)
                                    .to.have.length(1);
                                expect(cancelOrderCalledEvents[0].sender)
                                    .to.be.equal(caller);
                                expect(cancelOrderCalledEvents[0].orderbook)
                                    .to.be.equal(orderbook.address);
                                expect(cancelOrderCalledEvents[0].orderId)
                                    .to.be.equal(orderId);
                                expect(cancelOrderCalledEvents[0].extraData)
                                    .to.be.equal(extraData);
                            });

                            it('should return expected values', async (test) => {
                                const result = await test.executeStatic();
                                expect(result.amountCanceled)
                                    .to.be.equal(scenario.amountCanceled);
                                expect(result.failed)
                                    .to.be.equal(scenario.failed);
                                expect(result.error)
                                    .to.be.equal(scenario.error);
                            });
                        }
                    });
                }
            });
        }
    });
});
