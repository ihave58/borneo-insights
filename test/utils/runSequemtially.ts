async function runSequentially<V, R>(values: V[], fn: (v: V) => Promise<R>): Promise<R[]> {
    const result: R[] = [];

    for (const value of values) {
        result.push(await fn(value));
    }
    return result;
}

export default runSequentially;
