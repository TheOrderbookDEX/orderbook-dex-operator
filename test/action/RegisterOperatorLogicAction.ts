import { OperatorLogicMock } from '../../src/testing/OperatorLogicMock';
import { OperatorContext } from '../scenario/OperatorScenario';
import { OperatorAction, OperatorActionProperties } from './OperatorAction';

export interface RegisterOperatorLogicActionProperties extends OperatorActionProperties {
    readonly version: bigint;
}

export class RegisterOperatorLogicAction extends OperatorAction {
    readonly version: bigint;

    constructor({
        version,
        ...rest
    }: RegisterOperatorLogicActionProperties) {
        super(rest);
        this.version = version;
    }

    async execute(ctx: OperatorContext) {
        const logicMock = await OperatorLogicMock.deploy();
        await ctx.logicRegistry.register(this.version, logicMock);
    }

    apply<T>(state: T) {
        return state;
    }
}
