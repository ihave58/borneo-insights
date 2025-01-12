import getRedisClient from './getRedisClient';
import { isInsightProcessed } from './lastProcessedEvent';
import { EventStore } from '../enums';

const getInsightsStatus = async (): Promise<boolean> => {
    try {
        const redisClient = getRedisClient();
        const streamInfo = await redisClient.xInfoStream(EventStore.EventStream);

        return await isInsightProcessed(streamInfo.lastGeneratedId);
    } catch {
        return false;
    }
};

export default getInsightsStatus;
