import { TestSetupAction, TestSetupActionProperties } from '@frugal-wizard/contract-test-helper';
import { OperatorFactoryContext } from '../scenario/OperatorFactoryScenario';

export type OperatorFactoryActionProperties = TestSetupActionProperties;

export abstract class OperatorFactoryAction extends TestSetupAction<OperatorFactoryContext> {
}
