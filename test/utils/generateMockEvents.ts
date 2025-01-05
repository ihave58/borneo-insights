import { faker } from '@faker-js/faker';
import { EventType } from '../../src/enums';
import { Event } from '../../src/types';

const round = (number: number, decimalCount = 2) =>
    Math.round((number + Number.EPSILON) * Math.pow(10, decimalCount)) / Math.pow(10, decimalCount);

const getRandomNumber = (min: number, max: number, decimalCount = 0) => {
    return round(Math.random() * (max - min) + min, decimalCount);
};

const eventTypes = Object.values(EventType);

const generateMockEvents = (count: number, startTimestamp: number, duration: number): Array<Event> => {
    const generateMockEvent = (): Event => {
        const eventType = eventTypes[getRandomNumber(0, eventTypes.length - 1)];

        return {
            timestamp: faker.number.int({
                min: startTimestamp,
                max: startTimestamp + duration,
            }),
            customer_id: faker.string.uuid(),
            item_id: faker.string.uuid(),
            event_type: eventType,
            price:
                eventType === EventType.Purchase ? faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }) : null,
        };
    };

    return faker.helpers.multiple(generateMockEvent, {
        count,
    });
};

export default generateMockEvents;
