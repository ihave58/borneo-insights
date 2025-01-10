import { faker } from '@faker-js/faker';
import { EventType } from '../../src/enums';
import { Event } from '../../src/types';

const round = (number: number, decimalCount = 2) =>
    Math.round((number + Number.EPSILON) * Math.pow(10, decimalCount)) /
    Math.pow(10, decimalCount);

const getRandomNumber = (min: number, max: number, decimalCount = 0) => {
    return round(Math.random() * (max - min) + min, decimalCount);
};

const eventTypes = Object.values(EventType);

const getRandomElement = <T>(array: Array<T>): T =>
    array[getRandomNumber(0, array.length - 1)];

const generatePool = (size: number, generator: (index: number) => string) => {
    const pool = [];

    for (let i = 0; i < size; i++) {
        pool.push(generator(i));
    }

    return pool;
};

const generateMockEvents = (
    count: number,
    startTimestamp: number,
    duration: number,
): Array<Event> => {
    const poolSize = getRandomNumber(1, Math.floor(count / 4)) || 1;
    const customerPool = generatePool(poolSize, () => faker.string.uuid());
    const itemPool = generatePool(poolSize, () => faker.string.uuid());

    const generateMockEvent = (): Event => {
        const eventType = eventTypes[getRandomNumber(0, eventTypes.length - 1)];

        return {
            timestamp: faker.number.int({
                min: startTimestamp,
                max: startTimestamp + duration,
            }),
            customer_id: getRandomElement(customerPool),
            item_id: getRandomElement(itemPool),
            event_type: eventType,
            price:
                eventType === EventType.Purchase
                    ? faker.number.float({ min: 10, max: 1000, fractionDigits: 2 })
                    : null,
        };
    };

    return faker.helpers.multiple(generateMockEvent, {
        count,
    });
};

export default generateMockEvents;
export { getRandomNumber };
