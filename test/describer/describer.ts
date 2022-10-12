import { Account, ConfigurableDescriber } from '@frugal-wizard/contract-test-helper';
import { RegisterOperatorLogicAction } from '../action/RegisterOperatorLogicAction';
import { TransferTokensToOperatorAction } from '../action/TransferTokensToOperatorAction';
import { BuyAtMarketScenario } from '../scenario/BuyAtMarketScenario';
import { PlaceBuyOrderScenario } from '../scenario/PlaceBuyOrderScenario';
import { CancelOrderScenario } from '../scenario/CancelOrderScenario';
import { ClaimOrderScenario } from '../scenario/ClaimOrderScenario';
import { DeployOperatorScenario } from '../scenario/DeployOperatorScenario';
import { SellAtMarketScenario } from '../scenario/SellAtMarketScenario';
import { PlaceSellOrderScenario } from '../scenario/PlaceSellOrderScenario';
import { TransferOrderScenario } from '../scenario/TransferOrderScenario';
import { WithdrawERC20Scenario } from '../scenario/WithdrawScenario';
import { formatValue } from '@frugal-wizard/abi2ts-lib';

export const describer = new ConfigurableDescriber<never>();

export function describeVersion(version: bigint) {
    const patchVersion = version % 100n;
    const minorVersion = (version / 100n) % 100n;
    const majorVersion = version / 10000n;
    return `V${majorVersion}${minorVersion||patchVersion?`.${minorVersion}${patchVersion?`.${patchVersion}`:''}`:''}`;
}

describer.addDescriber(RegisterOperatorLogicAction, function({
    version
}) {
    return `register operator logic for ${describeVersion(version)}`;
});

describer.addDescriber(TransferTokensToOperatorAction, function({
    amount
}) {
    return `transfer ${formatValue(amount)} to operator`;
});

describer.addDescriber(DeployOperatorScenario, function({
    owner
}) {
    return `deploy using ${owner}`;
});

describer.addDescriber(WithdrawERC20Scenario, function({
    caller, amount, setupActions
}) {
    const description = ['withdraw'];
    description.push(formatValue(amount));
    if (caller != Account.MAIN) {
        description.push('using');
        description.push(caller);
    }
    for (const [ index, action ] of setupActions.entries()) {
        description.push(index == 0 ? 'after' : 'and');
        description.push(action.description);
    }
    return description.join(' ');
});

describer.addDescriber(BuyAtMarketScenario, function({
    caller, orderbookVersion, maxAmount, maxPrice, extraData, setupActions
}) {
    const description = ['buy at market'];
    description.push(String(maxAmount));
    description.push('or less contracts');
    description.push('at');
    description.push(formatValue(maxPrice));
    description.push('or lower');
    description.push('with extra data');
    description.push(extraData);
    description.push('on');
    description.push(describeVersion(orderbookVersion));
    if (caller != Account.MAIN) {
        description.push('using');
        description.push(caller);
    }
    for (const [ index, action ] of setupActions.entries()) {
        description.push(index == 0 ? 'after' : 'and');
        description.push(action.description);
    }
    return description.join(' ');
});

describer.addDescriber(SellAtMarketScenario, function({
    caller, orderbookVersion, maxAmount, minPrice, extraData, setupActions
}) {
    const description = ['sell at market'];
    description.push(String(maxAmount));
    description.push('or less contracts');
    description.push('at');
    description.push(formatValue(minPrice));
    description.push('or higher');
    description.push('with extra data');
    description.push(extraData);
    description.push('on');
    description.push(describeVersion(orderbookVersion));
    if (caller != Account.MAIN) {
        description.push('using');
        description.push(caller);
    }
    for (const [ index, action ] of setupActions.entries()) {
        description.push(index == 0 ? 'after' : 'and');
        description.push(action.description);
    }
    return description.join(' ');
});

describer.addDescriber(PlaceBuyOrderScenario, function({
    caller, orderbookVersion, maxAmount, price, extraData, setupActions
}) {
    const description = ['place buy order of'];
    description.push(String(maxAmount));
    description.push(`contract${maxAmount!=1n?'s':''}`);
    description.push('at');
    description.push(formatValue(price));
    description.push('or lower');
    description.push('with extra data');
    description.push(extraData);
    description.push('on');
    description.push(describeVersion(orderbookVersion));
    if (caller != Account.MAIN) {
        description.push('using');
        description.push(caller);
    }
    for (const [ index, action ] of setupActions.entries()) {
        description.push(index == 0 ? 'after' : 'and');
        description.push(action.description);
    }
    return description.join(' ');
});

describer.addDescriber(PlaceSellOrderScenario, function({
    caller, orderbookVersion, maxAmount, price, extraData, setupActions
}) {
    const description = ['place sell order of'];
    description.push(String(maxAmount));
    description.push(`contract${maxAmount!=1n?'s':''}`);
    description.push('at');
    description.push(formatValue(price));
    description.push('or higher');
    description.push('with extra data');
    description.push(extraData);
    description.push('on');
    description.push(describeVersion(orderbookVersion));
    if (caller != Account.MAIN) {
        description.push('using');
        description.push(caller);
    }
    for (const [ index, action ] of setupActions.entries()) {
        description.push(index == 0 ? 'after' : 'and');
        description.push(action.description);
    }
    return description.join(' ');
});

describer.addDescriber(ClaimOrderScenario, function({
    caller, orderbookVersion, orderId, extraData, setupActions
}) {
    const description = ['claim order'];
    description.push(orderId);
    description.push('with extra data');
    description.push(extraData);
    description.push('on');
    description.push(describeVersion(orderbookVersion));
    if (caller != Account.MAIN) {
        description.push('using');
        description.push(caller);
    }
    for (const [ index, action ] of setupActions.entries()) {
        description.push(index == 0 ? 'after' : 'and');
        description.push(action.description);
    }
    return description.join(' ');
});

describer.addDescriber(TransferOrderScenario, function({
    caller, orderbookVersion, orderId, recipient, setupActions
}) {
    const description = ['transfer order'];
    description.push(orderId);
    description.push('to');
    description.push(recipient);
    description.push('on');
    description.push(describeVersion(orderbookVersion));
    if (caller != Account.MAIN) {
        description.push('using');
        description.push(caller);
    }
    for (const [ index, action ] of setupActions.entries()) {
        description.push(index == 0 ? 'after' : 'and');
        description.push(action.description);
    }
    return description.join(' ');
});

describer.addDescriber(CancelOrderScenario, function({
    caller, orderbookVersion, orderId, extraData, setupActions
}) {
    const description = ['cancel order'];
    description.push(orderId);
    description.push('with extra data');
    description.push(extraData);
    description.push('on');
    description.push(describeVersion(orderbookVersion));
    if (caller != Account.MAIN) {
        description.push('using');
        description.push(caller);
    }
    for (const [ index, action ] of setupActions.entries()) {
        description.push(index == 0 ? 'after' : 'and');
        description.push(action.description);
    }
    return description.join(' ');
});
