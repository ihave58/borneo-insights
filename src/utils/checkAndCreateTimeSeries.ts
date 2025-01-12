import getMongoDB from './getMongoDB';
import { HistoricInsightsStore } from '../enums';

const mongoDB = getMongoDB();

const checkAndCreateTimeSeries = async (): Promise<void> => {
    const collections = await mongoDB
        .listCollections({
            type: 'timeseries',
        })
        .toArray();

    const hasFoundTopAddToCartStore = collections.find(
        (collection) => collection.name === HistoricInsightsStore.TopAddToCartStore,
    );

    const hasFoundTopVisitedItemStore = collections.find(
        (collection) => collection.name === HistoricInsightsStore.TopAddToCartStore,
    );

    const hasFoundTopSoldItemStore = collections.find(
        (collection) => collection.name === HistoricInsightsStore.TopSoldItemStore,
    );

    if (!hasFoundTopAddToCartStore) {
        await mongoDB.createCollection(HistoricInsightsStore.TopAddToCartStore, {
            timeseries: {
                timeField: 'timestamp',
                // metaField: 'metadata',
                granularity: 'minutes',
            },
        });
    }

    if (!hasFoundTopVisitedItemStore) {
        await mongoDB.createCollection(HistoricInsightsStore.TopVisitedItemStore, {
            timeseries: {
                timeField: 'timestamp',
                // metaField: 'metadata',
                granularity: 'minutes',
            },
        });
    }

    if (!hasFoundTopSoldItemStore) {
        await mongoDB.createCollection(HistoricInsightsStore.TopSoldItemStore, {
            timeseries: {
                timeField: 'timestamp',
                // metaField: 'metadata',
                granularity: 'minutes',
            },
        });
    }
};

export default checkAndCreateTimeSeries;
