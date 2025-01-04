import { createClient, RedisClientType } from 'redis';
import { Event, Insights } from './InsightsService.d';

enum EventType {
    Purchase = 'purchase',
    AddToCart = 'add_to_cart',
    PageVisit = 'page_visit',
}

enum Stores {
    AddToCartItemIdSet = 'AddToCartItemIdSet',
    AddToCartItemIdToCountMap = 'AddToCartItemIdToCountMap',
    TopAddToCardItemId = 'TopAddToCardItemId',

    PageVisitItemIdSet = 'PageVisitItemIdSet',
    PageVisitItemIdToCountMap = 'PageVisitItemIdToCountMap',
    TopPageVisitItemId = 'TopPageVisitItemId',

    HighestSoldItemIdSet = 'HighestSoldItemIdSet',
    HighestSoldItemIdToSalesMap = 'HighestSoldItemIdToSalesMap',
    TopSoldItemId = 'TopSoldItemId',
}

// const StoreWindowSize = {
//     [Stores.AddToCartItemIdSet]: 24 * 60 * 60 * 1000, //24 hours
//     [Stores.HighestSoldItemIdSet]: 24 * 60 * 60 * 1000, // 24 hours
//     [Stores.PageVisitItemIdSet]: 1 * 60 * 60 * 1000, // 1 hour
// };

const StoreWindowSize = {
    [Stores.AddToCartItemIdSet]: 100 * 24 * 60 * 60 * 1000, // 100 days
    [Stores.HighestSoldItemIdSet]: 100 * 24 * 60 * 60 * 1000, // 100 days
    [Stores.PageVisitItemIdSet]: 100 * 24 * 60 * 60 * 1000, // 100 days
};

class InsightsService {
    private redisClient: RedisClientType;

    constructor(url: string) {
        this.redisClient = createClient({ url });
    }

    init = async (): Promise<void> => {
        await this.redisClient.connect();
    };

    private handleAddItemToCartEvent = async (event: Event<EventType.AddToCart>) => {
        // const currentTimestamp = Date.now();
        const currentTimestamp = 1711497600000; // Wednesday, March 27, 2024 12:00:00 AM
        const windowStartTimestamp = currentTimestamp - StoreWindowSize[Stores.AddToCartItemIdSet];

        const expiredAddToCartItemIds = await this.redisClient.zRangeByScore(
            Stores.AddToCartItemIdSet,
            0,
            windowStartTimestamp,
        );

        for (const itemId of expiredAddToCartItemIds) {
            await this.redisClient.hIncrBy(Stores.AddToCartItemIdToCountMap, itemId, -1);
        }

        await this.redisClient.zAdd(Stores.AddToCartItemIdSet, { score: event.timestamp, value: event.item_id });
        const newItemCount = await this.redisClient.hIncrBy(Stores.AddToCartItemIdToCountMap, event.item_id, 1);

        const topAddToCartItemId = await this.redisClient.get(Stores.TopAddToCardItemId);

        if (topAddToCartItemId == null) {
            await this.redisClient.set(Stores.TopAddToCardItemId, event.item_id);
        } else {
            const topPageVisitItemCount = await this.redisClient.hGet(
                Stores.AddToCartItemIdToCountMap,
                topAddToCartItemId,
            );

            if (Number(newItemCount) >= Number(topPageVisitItemCount)) {
                await this.redisClient.set(Stores.TopAddToCardItemId, event.item_id);
            }
        }

        await this.redisClient.zRemRangeByScore(Stores.AddToCartItemIdSet, 0, windowStartTimestamp);
    };

    private handleItemPurchaseEvent = async (event: Event<EventType.Purchase>) => {
        // const currentTimestamp = Date.now();
        const currentTimestamp = 1711497600000; // Wednesday, March 27, 2024 12:00:00 AM
        const windowStartTimestamp = currentTimestamp - StoreWindowSize[Stores.HighestSoldItemIdSet];
        const eventPrice = Math.round(event.price! * 100);

        const expiredPurchasedItemIds = await this.redisClient.zRangeByScore(
            Stores.HighestSoldItemIdSet,
            0,
            windowStartTimestamp,
        );

        for (const expiredItemId of expiredPurchasedItemIds) {
            await this.redisClient.hIncrBy(Stores.HighestSoldItemIdToSalesMap, expiredItemId, -eventPrice);
        }

        await this.redisClient.zAdd(Stores.HighestSoldItemIdSet, { score: event.timestamp, value: event.item_id });
        const newItemCount = await this.redisClient.hIncrBy(
            Stores.HighestSoldItemIdToSalesMap,
            event.item_id,
            eventPrice,
        );

        const topSalesItemId = await this.redisClient.get(Stores.TopSoldItemId);

        if (topSalesItemId == null) {
            await this.redisClient.set(Stores.TopSoldItemId, event.item_id);
        } else {
            const topPageVisitItemCount = await this.redisClient.hGet(
                Stores.HighestSoldItemIdToSalesMap,
                topSalesItemId,
            );

            if (Number(newItemCount) >= Number(topPageVisitItemCount)) {
                await this.redisClient.set(Stores.TopSoldItemId, event.item_id);
            }
        }

        await this.redisClient.zRemRangeByScore(Stores.HighestSoldItemIdSet, 0, windowStartTimestamp);
    };

    private handlePageVisitEvent = async (event: Event<EventType.PageVisit>) => {
        // const currentTimestamp = Date.now();
        const currentTimestamp = 1711497600000; // Wednesday, March 27, 2024 12:00:00 AM
        const windowStartTimestamp = currentTimestamp - StoreWindowSize[Stores.PageVisitItemIdSet];

        const expiredPageVisitItemIds = await this.redisClient.zRangeByScore(
            Stores.PageVisitItemIdSet,
            0,
            windowStartTimestamp,
        );

        for (const itemId of expiredPageVisitItemIds) {
            await this.redisClient.hIncrBy(Stores.PageVisitItemIdToCountMap, itemId, -1);
        }

        await this.redisClient.zAdd(Stores.PageVisitItemIdSet, { score: event.timestamp, value: event.item_id });
        const newItemCount = await this.redisClient.hIncrBy(Stores.PageVisitItemIdToCountMap, event.item_id, 1);

        const topPageVisitItemId = await this.redisClient.get(Stores.TopPageVisitItemId);

        if (topPageVisitItemId == null) {
            await this.redisClient.set(Stores.TopPageVisitItemId, event.item_id);
        } else {
            const topPageVisitItemCount = await this.redisClient.hGet(
                Stores.PageVisitItemIdToCountMap,
                topPageVisitItemId,
            );

            if (Number(newItemCount) >= Number(topPageVisitItemCount)) {
                await this.redisClient.set(Stores.TopPageVisitItemId, event.item_id);
            }
        }

        await this.redisClient.zRemRangeByScore(Stores.PageVisitItemIdSet, 0, windowStartTimestamp);
    };

    addEvent = async (event: Event) => {
        switch (event.event_type) {
            case EventType.AddToCart:
                await this.handleAddItemToCartEvent(event as Event<EventType.AddToCart>);
                return true;

            case EventType.PageVisit:
                await this.handlePageVisitEvent(event as Event<EventType.PageVisit>);
                return true;

            case EventType.Purchase:
                await this.handleItemPurchaseEvent(event as Event<EventType.Purchase>);
                return true;

            default:
                throw new Error('EventHandlerNotImplementedException');
        }
    };

    getInsights = async (): Promise<Insights> => {
        const topAddToCartItemId = await this.redisClient.get(Stores.TopAddToCardItemId);
        const topVisitedItemId = await this.redisClient.get(Stores.TopPageVisitItemId);
        const topSoldItemId = await this.redisClient.get(Stores.TopSoldItemId);

        return {
            topAddToCartItemId,
            topVisitedItemId,
            topSoldItemId,
        };
    };

    cleanup = async () => {
        const storeNames = Object.values(Stores);

        for (const storeName of storeNames) {
            await this.redisClient.del(storeName);
        }
    };
}

export default InsightsService;
export { EventType, Stores, StoreWindowSize };

export type { Event, Insights };
