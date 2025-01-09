import { Event } from '../types';
import getRedisClient from './getRedisClient';
import getEventStreamName from './getEventStreamName';
import { EventPriceAsString } from '../types';

const mapToEventPriceAsString = (event: Event): EventPriceAsString => {
    if (event && event.price != null && !Number.isNaN(Number(event.price))) {
        return {
            ...event,
            price: event.price.toString(),
            timestamp: event.timestamp.toString(),
        };
    } else {
        return {
            ...event,
            price: '',
            timestamp: event.timestamp.toString(),
        };
    }
};

const ingestEvent = async (event: Event, streamPrefix: string) => {
    const redisClient = getRedisClient();
    const streamKey = getEventStreamName(streamPrefix);

    await redisClient.xAdd(streamKey, '*', mapToEventPriceAsString(event));
};

export default ingestEvent;
