import { formatValue } from '@frugal-wizard/abi2ts-lib';
import { Account, ConfigurableDescriber } from '@frugal-wizard/contract-test-helper';
import { CreateOperatorAction } from '../action/CreateOperatorAction';
import { DepositERC20Action } from '../action/DepositERC20Action';
import { RegisterVersionAction } from '../action/RegisterVersionAction';
import { UpdateOperatorAction } from '../action/UpdateOperatorAction';
import { CreateOperatorScenario } from '../scenario/CreateOperatorScenario';
import { DeployOperatorFactoryScenario } from '../scenario/DeployOperatorFactoryScenario';
import { RegisterVersionScenario } from '../scenario/RegisterVersionScenario';
import { UpdateOperatorScenario } from '../scenario/UpdateOperatorScenario';
import { WithdrawERC20Scenario } from '../scenario/WithdrawERC20Scenario';

export const describer = new ConfigurableDescriber<never>();

export function formatVersion(version: bigint) {
    const patchVersion = version % 100n;
    const minorVersion = (version / 100n) % 100n;
    const majorVersion = version / 10000n;
    return `V${majorVersion}${minorVersion||patchVersion?`.${minorVersion}${patchVersion?`.${patchVersion}`:''}`:''}`;
}

function describeSetup(description: string[], scenario: { setupActions: readonly { description: string }[] }) {
    const { setupActions } = scenario;
    for (const [ index, action ] of setupActions.entries()) {
        description.push(index == 0 ? 'after' : 'and');
        description.push(action.description);
    }
}

function describeCaller(description: string[], scenario: { caller: Account }) {
    const { caller } = scenario;
    if (caller != Account.MAIN) {
        description.push('using');
        description.push(caller);
    }
}

function describeOperator(description: string[], scenario: { operatorOwner: Account }, preposition: string) {
    const { operatorOwner } = scenario;
    if (operatorOwner != Account.MAIN) {
        description.push(preposition);
        description.push(`operator owned by ${operatorOwner}`);
    }
}

function describeOperatorFactoryScenario(description: string[], scenario: { versionManager: string }) {
    const { versionManager } = scenario;
    if (versionManager != Account.MAIN) {
        description.push('with');
        description.push(`versionManager = ${versionManager}`);
    }
}

describer.addDescriber(DeployOperatorFactoryScenario, function(scenario) {
    const description = [`deploy`];
    describeOperatorFactoryScenario(description, scenario);
    return description.join(' ');
});

describer.addDescriber(RegisterVersionScenario, function(scenario) {
    const { version, implementation } = scenario;
    const description = [`register ${formatVersion(version)}`];
    if (implementation) {
        description.push(`to ${implementation}`);
    }
    describeCaller(description, scenario);
    describeOperatorFactoryScenario(description, scenario);
    describeSetup(description, scenario);
    return description.join(' ');
});

describer.addDescriber(RegisterVersionAction, function(action) {
    const { version } = action;
    return `register ${formatVersion(version)}`;
});

describer.addDescriber(CreateOperatorScenario, function(scenario) {
    const { version } = scenario;
    const description = [`create operator ${formatVersion(version)}`];
    describeCaller(description, scenario);
    describeOperatorFactoryScenario(description, scenario);
    describeSetup(description, scenario);
    return description.join(' ');
});

describer.addDescriber(CreateOperatorAction, function(action) {
    const { version } = action;
    const description = [`create operator ${formatVersion(version)}`];
    describeCaller(description, action);
    return description.join(' ');
});

describer.addDescriber(UpdateOperatorScenario, function(scenario) {
    const { version } = scenario;
    const description = [`update operator to ${formatVersion(version)}`];
    describeCaller(description, scenario);
    describeOperatorFactoryScenario(description, scenario);
    describeSetup(description, scenario);
    return description.join(' ');
});

describer.addDescriber(UpdateOperatorAction, function(action) {
    const { version } = action;
    const description = [`update operator to ${formatVersion(version)}`];
    describeCaller(description, action);
    return description.join(' ');
});

describer.addDescriber(DepositERC20Action, function(action) {
    const { amount } = action;
    const description = [`deposit ${formatValue(amount)} ERC20`];
    describeCaller(description, action);
    describeOperator(description, action, 'to');
    return description.join(' ');
});

describer.addDescriber(WithdrawERC20Scenario, function(scenario) {
    const { amount } = scenario;
    const description = [`withdraw ${formatValue(amount)} ERC20`];
    describeCaller(description, scenario);
    describeOperator(description, scenario, 'from');
    describeSetup(description, scenario);
    return description.join(' ');
});
