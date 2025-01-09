import { Event, EventPriceAsString } from '../types';
import { InsightsConsumerGroupName } from '../enums';
import getRedisClient from './getRedisClient';

const mapToEvent = (eventPriceAsString: EventPriceAsString): Event => {
    if (
        eventPriceAsString &&
        eventPriceAsString.price != null &&
        !Number.isNaN(Number(eventPriceAsString.price))
    ) {
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

const readEvents = async (
    streamKey: string,
    consumerId: string,
    pending: boolean,
): Promise<Array<[string, Event]>> => {
    let events: Array<[string, Event]> = [];

    const redisClient = getRedisClient();

    const response = await redisClient.xReadGroup(
        InsightsConsumerGroupName,
        consumerId,
        {
            key: streamKey,
            id: pending ? '0' : '>',
        },
        {
            COUNT: 1,
        },
    );

    // console.log('response:', response);

    if (response != null) {
        const eventResponse = response.find(
            (streamResponse) => streamResponse.name === streamKey,
        );

        if (Array.isArray(eventResponse?.messages)) {
            events = eventResponse.messages.map(({ id, message }) => [
                id,
                mapToEvent(message as EventPriceAsString),
            ]);
        }
    }

    return events;
};

const checkAndClaimFailedEvents = async (streamKey: string, consumerId: string) => {
    const redisClient = getRedisClient();

    const claimedEvents = await redisClient.xAutoClaim(
        streamKey,
        InsightsConsumerGroupName,
        consumerId,
        10 * 1000,
        '-',
        {
            COUNT: 1,
        },
    );

    return claimedEvents;
};

const getNewEvents = async (
    streamKey: string,
    consumerId: string,
): Promise<Array<[string, Event]>> => {
    const pendingEvents = await readEvents(streamKey, consumerId, true);

    if (pendingEvents.length === 0) {
        const claimedResult = await checkAndClaimFailedEvents(streamKey, consumerId);
        console.log(`${consumerId} claiming:`, claimedResult.messages);

        const claimedPendingEvents = await readEvents(streamKey, consumerId, true);
        if (claimedPendingEvents.length === 0) {
            console.log(`${consumerId} claimed:`, claimedPendingEvents);

            return await readEvents(streamKey, consumerId, false);
        }

        return claimedPendingEvents;
    }

    return pendingEvents;
};

export { getNewEvents, checkAndClaimFailedEvents };
