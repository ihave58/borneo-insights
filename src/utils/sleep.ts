const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const randomSleep = (min: number = 100, max: number = 1000) => {
    return sleep(Math.ceil(Math.random() * (max - min) + min));
};

export default sleep;
export { randomSleep, sleep };
