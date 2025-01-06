import { Event, EventPriceAsString } from '../types';
import getRedisClient from './getRedisClient';
import { getLastProcessedEventId } from './lastProcessedEvent';
import getEventStreamName from './getEventStreamName';

const mapToEvent = (eventPriceAsString: EventPriceAsString): Event => {
    if (eventPriceAsString && eventPriceAsString.price != null && !Number.isNaN(Number(eventPriceAsString.price))) {
        return {
            ...eventPriceAsString,

            timestamp: Number(eventPriceAsString.timestamp),
            price: Number(eventPriceAsString.price),
        };
    } else {
        return {
            ...eventPriceAsString,

            timestamp: Number(eventPriceAsString.timestamp),
            price: null,
        };
    }
};

const getNewEvents = async (streamPrefix: string): Promise<Array<[string, Event]>> => {
    let newEvents: Array<[string, Event]> = [];

    const redisClient = getRedisClient();
    const streamKey = getEventStreamName(streamPrefix);
    const lastProcessedEventId: string = (await getLastProcessedEventId()) || '0';

    const response = await redisClient.xRead(
        {
            key: streamKey,
            id: lastProcessedEventId,
        },
        {
            COUNT: 1,
        },
    );

    if (response != null) {
        const eventResponse = response.find((streamResponse) => streamResponse.name === streamKey);

        if (Array.isArray(eventResponse?.messages)) {
            newEvents = eventResponse.messages.map(({ id, message }) => [
                id,
                mapToEvent(message as EventPriceAsString),
            ]);
        }
    }

    return newEvents;
};

export default getNewEvents;
