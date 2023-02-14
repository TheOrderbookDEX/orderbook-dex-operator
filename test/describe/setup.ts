export function describeSetup({
    setupActions,
}: {
    readonly setupActions: readonly { description: string }[];
}): string {

    return setupActions.length ? ` after ${setupActions.map(({ description }) => description).join(' and ')}` : '';
}
