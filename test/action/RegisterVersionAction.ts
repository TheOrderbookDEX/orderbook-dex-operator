import { OperatorV0 } from '../../src/OperatorV0';
import { OperatorFactoryContext } from '../scenario/OperatorFactoryScenario';
import { OperatorFactoryAction, OperatorFactoryActionProperties } from './OperatorFactoryAction';

export interface RegisterVersionActionProperties extends OperatorFactoryActionProperties {
    readonly version: bigint;
}

export class RegisterVersionAction extends OperatorFactoryAction {
    readonly version: bigint;

    constructor({
        version,
        ...rest
    }: RegisterVersionActionProperties) {
        super(rest);
        this.version = version;
    }

    async execute(ctx: OperatorFactoryContext) {
        const { operatorFactory } = ctx;
        const implementation = await OperatorV0.deploy();
        const from = await operatorFactory.versionManager();
        await operatorFactory.registerVersion(this.version, implementation, { from });
    }

    apply<T>(state: T) {
        return state;
    }
}
