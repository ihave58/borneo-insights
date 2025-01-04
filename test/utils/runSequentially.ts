function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runSequentially<Value, Result>(
    values: Value[],
    fn: (v: Value) => Promise<Result>,
    delay: number = 0,
): Promise<Array<Result>> {
    const result: Array<Result> = [];

    for (const value of values) {
        result.push(await fn(value));
        await sleep(delay);
    }
    return result;
}

export default runSequentially;
