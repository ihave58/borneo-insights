import getRedisClient from './getRedisClient';
import { Insights } from '../types';
import { InsightsStore } from '../enums';

const getInsights = async (): Promise<Insights | null> => {
    try {
        const redisClient = getRedisClient();

        const topAddToCartItemId = await redisClient.get(InsightsStore.TopAddToCardItemId);
        const topVisitedItemId = await redisClient.get(InsightsStore.TopVisitedItemId);
        const topSoldItemId = await redisClient.get(InsightsStore.TopSoldItemId);

        return {
            topAddToCartItemId,
            topVisitedItemId,
            topSoldItemId,
        };
    } catch {
        return null;
    }
};

export default getInsights;
