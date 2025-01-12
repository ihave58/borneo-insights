import { Event, EventPriceAsString } from '../types';
import { EventStore, InsightsConsumerGroupName } from '../enums';
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

const readEventsByConsumer = async (
    streamKey: string,
    groupName: string,
    consumerId: string,
    lastId: string = '>',
    count: number = 1,
): Promise<Array<[string, Event]>> => {
    let events: Array<[string, Event]> = [];

    const redisClient = getRedisClient();

    const response = await redisClient.xReadGroup(
        groupName,
        consumerId,
        {
            key: streamKey,
            id: lastId,
        },
        {
            COUNT: count,
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
    const pendingEvents = await readEventsByConsumer(
        streamKey,
        consumerId,
        InsightsConsumerGroupName,
        '0',
    );
    let newEvents: Array<[string, Event]> = pendingEvents;

    if (pendingEvents.length === 0) {
        const claimedResult = await checkAndClaimFailedEvents(streamKey, consumerId);
        console.log(`${consumerId} claiming:`, claimedResult.messages);

        const claimedPendingEvents = await readEventsByConsumer(
            streamKey,
            InsightsConsumerGroupName,
            consumerId,
            '0',
        );

        if (claimedPendingEvents.length === 0) {
            console.log(`${consumerId} claimed:`, claimedPendingEvents);

            newEvents = await readEventsByConsumer(
                streamKey,
                InsightsConsumerGroupName,
                consumerId,
            );
        }

        newEvents = claimedPendingEvents;
    }

    return newEvents;
};

const getEventsByTimestamp = async (
    endTimestamp: string,
    startTimestamp: string = '-',
): Promise<Array<[string, Event]>> => {
    let events: Array<[string, Event]> = [];

    const redisClient = getRedisClient();

    const response = await redisClient.xRange(
        EventStore.EventStream,
        startTimestamp,
        endTimestamp,
    );

    // console.log('response:', response);

    if (response != null && Array.isArray(response)) {
        events = response.map(({ id, message }) => [
            id,
            mapToEvent(message as EventPriceAsString),
        ]);
    }

    return events;
};

const getEventStreamInfo = async () => {
    const redisClient = getRedisClient();

    return await redisClient.xInfoStream(EventStore.EventStream);
};

export { getEventsByTimestamp, getNewEvents, getEventStreamInfo, checkAndClaimFailedEvents };
