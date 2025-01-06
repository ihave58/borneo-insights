const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const randomSleep = (min: number = 10, max: number = 100) => {
    return sleep(Math.ceil(Math.random() * (max - min) + min));
};

export default sleep;
export { randomSleep, sleep };
