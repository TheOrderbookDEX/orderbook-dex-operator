import { EthereumSetupContext, SetupAction } from '@frugal-wizard/contract-test-helper';
import { OperatorFactoryContext } from '../scenario/factory';

export type OperatorFactoryAction = SetupAction<EthereumSetupContext & OperatorFactoryContext>;
