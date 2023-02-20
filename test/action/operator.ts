import { EthereumSetupContext, SetupAction } from '@frugalwizard/contract-test-helper';
import { OperatorContext } from '../scenario/operator';

export type OperatorAction = SetupAction<EthereumSetupContext & OperatorContext>;
