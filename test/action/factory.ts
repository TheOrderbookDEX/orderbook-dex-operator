import { EthereumSetupContext, SetupAction } from '@frugalwizard/contract-test-helper';
import { OperatorFactoryContext } from '../scenario/factory';

export type OperatorFactoryAction = SetupAction<EthereumSetupContext & OperatorFactoryContext>;
