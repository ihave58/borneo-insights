import getRedisClient from './getRedisClient';
import { EventStore, InsightsConsumerGroupName } from '../enums';

const getLastProcessedEventId = async () => {
    const redisClient = getRedisClient();

    return await redisClient.get(EventStore.LastProcessedInsightsEventId);
};

const setLastProcessedEventId = async (eventId: string) => {
    const redisClient = getRedisClient();

    await redisClient.set(EventStore.LastProcessedInsightsEventId, eventId);
};

const ackEventId = async (eventId: string) => {
    const redisClient = getRedisClient();

    await redisClient.xAck(EventStore.EventStream, InsightsConsumerGroupName, eventId);
};

export { getLastProcessedEventId, setLastProcessedEventId, ackEventId };
