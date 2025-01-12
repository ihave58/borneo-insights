import getMongoDB from './getMongoDB';
import { Insights } from '../types';
import { HistoricInsightsStore } from '../enums';

const addDailyInsights = async (insights: Insights) => {
    const mongoDB = getMongoDB();
    const currentTimestamp = new Date();

    try {
        const topAddToCartHistoricInsightCollection = mongoDB.collection(
            HistoricInsightsStore.TopAddToCartStore,
        );

        const topVisitedItemHistoricInsightCollection = mongoDB.collection(
            HistoricInsightsStore.TopVisitedItemStore,
        );

        const topSoldItemHistoricInsightCollection = mongoDB.collection(
            HistoricInsightsStore.TopSoldItemStore,
        );

        await topAddToCartHistoricInsightCollection.insertOne({
            timestamp: currentTimestamp,
            value: insights.topAddToCartItemId,
        });

        await topVisitedItemHistoricInsightCollection.insertOne({
            timestamp: currentTimestamp,
            value: insights.topVisitedItemId,
        });

        await topSoldItemHistoricInsightCollection.insertOne({
            timestamp: currentTimestamp,
            value: insights.topSoldItemId,
        });
    } catch (error) {
        console.error(error);
        return false;
    }
    return true;
};

export { addDailyInsights };
