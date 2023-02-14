import { EthereumSetupContext, SetupAction } from '@frugal-wizard/contract-test-helper';
import { OperatorContext } from '../scenario/operator';

export type OperatorAction = SetupAction<EthereumSetupContext & OperatorContext>;
