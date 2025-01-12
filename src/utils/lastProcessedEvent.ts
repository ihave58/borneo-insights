import getRedisClient from './getRedisClient';
import { EventStore, InsightsConsumerGroupName } from '../enums';

const isInsightProcessed = async (eventId: string) => {
    const redisClient = getRedisClient();

    return await redisClient.sIsMember(EventStore.InsightProcessedEventIdSet, eventId);
};

const addToProcessedInsightList = async (eventId: string) => {
    const redisClient = getRedisClient();

    await redisClient.sAdd(EventStore.InsightProcessedEventIdSet, eventId);
};

const getAggregatedEventIds = async () => {
    const redisClient = getRedisClient();

    return await redisClient.get(EventStore.AggregatedInsightsEventIdSet);
};

const addToAggregatedEventList = async (eventIds: Array<string>) => {
    const redisClient = getRedisClient();

    await redisClient.sAdd(EventStore.AggregatedInsightsEventIdSet, eventIds);
};

const ackEventId = async (eventId: string) => {
    const redisClient = getRedisClient();

    await redisClient.xAck(EventStore.EventStream, InsightsConsumerGroupName, eventId);
};

export {
    isInsightProcessed,
    getAggregatedEventIds,
    addToProcessedInsightList,
    addToAggregatedEventList,
    ackEventId,
};
