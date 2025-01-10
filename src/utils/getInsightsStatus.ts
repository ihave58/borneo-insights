import getRedisClient from './getRedisClient';
import { getLastProcessedEventId } from './lastProcessedEvent';
import { EventStore } from '../enums';

const getInsightsStatus = async (): Promise<boolean> => {
    try {
        const lastProcessedEventId = await getLastProcessedEventId();
        const redisClient = getRedisClient();

        const streamInfo = await redisClient.xInfoStream(EventStore.EventStream);

        return streamInfo.lastGeneratedId === lastProcessedEventId;
    } catch {
        return false;
    }
};

export default getInsightsStatus;
