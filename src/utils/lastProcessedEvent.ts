import getRedisClient from './getRedisClient';
import { EventStore } from '../enums';

const getLastProcessedEventId = async () => {
    const redisClient = getRedisClient();

    return await redisClient.get(EventStore.LastProcessedEventId);
};

const setLastProcessedEventId = async (eventId: string) => {
    const redisClient = getRedisClient();

    await redisClient.set(EventStore.LastProcessedEventId, eventId);
};

export { getLastProcessedEventId, setLastProcessedEventId };
