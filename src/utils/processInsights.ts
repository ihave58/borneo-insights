import getRedisClient from './getRedisClient';
import type { Event } from '../types';
import { EventType, EventStore, InsightsStore, StoreWindowSize } from '../enums';

const redisClient = getRedisClient();

const processAddToCartInsight = async (event: Event<EventType.AddToCart>) => {
    const currentTimestamp = Date.now();
    // const currentTimestamp = 1711497600000; // Wednesday, March 27, 2024 12:00:00 AM
    const windowStartTimestamp =
        currentTimestamp - StoreWindowSize[EventStore.AddToCartItemIdSet];

    const expiredAddToCartItemIds = await redisClient.zRangeByScore(
        EventStore.AddToCartItemIdSet,
        0,
        windowStartTimestamp,
    );

    for (const itemId of expiredAddToCartItemIds) {
        await redisClient.hIncrBy(EventStore.AddToCartItemIdToCountMap, itemId, -1);
    }

    await redisClient.zAdd(EventStore.AddToCartItemIdSet, {
        score: event.timestamp,
        value: event.item_id,
    });
    const newItemCount = await redisClient.hIncrBy(
        EventStore.AddToCartItemIdToCountMap,
        event.item_id,
        1,
    );
    let topAddToCartItemId = await redisClient.get(InsightsStore.TopAddToCardItemId);

    if (topAddToCartItemId == null) {
        topAddToCartItemId = event.item_id;
    } else {
        const topPageVisitItemCount = await redisClient.hGet(
            EventStore.AddToCartItemIdToCountMap,
            topAddToCartItemId,
        );

        if (newItemCount > Number(topPageVisitItemCount)) {
            topAddToCartItemId = event.item_id;
        } else if (newItemCount === Number(topPageVisitItemCount)) {
            if (event.item_id.localeCompare(topAddToCartItemId) > 0) {
                topAddToCartItemId = event.item_id;
            }
        }
    }

    await redisClient.set(InsightsStore.TopAddToCardItemId, topAddToCartItemId);
    await redisClient.zRemRangeByScore(EventStore.AddToCartItemIdSet, 0, windowStartTimestamp);
    // await redisClient.xTrim(EventStore.EventStream, 'MINID', windowStartTimestamp);

    return true;
};

const processPurchaseInsight = async (event: Event<EventType.Purchase>) => {
    const currentTimestamp = Date.now();
    // const currentTimestamp = 1711497600000; // Wednesday, March 27, 2024 12:00:00 AM
    const windowStartTimestamp =
        currentTimestamp - StoreWindowSize[EventStore.HighestSoldItemIdSet];
    const eventPrice = Math.round(event.price! * 100);

    const expiredPurchasedItemIds = await redisClient.zRangeByScore(
        EventStore.HighestSoldItemIdSet,
        0,
        windowStartTimestamp,
    );

    for (const expiredItemId of expiredPurchasedItemIds) {
        await redisClient.hIncrBy(
            EventStore.HighestSoldItemIdToSalesMap,
            expiredItemId,
            -eventPrice,
        );
    }

    await redisClient.zAdd(EventStore.HighestSoldItemIdSet, {
        score: event.timestamp,
        value: event.item_id,
    });

    const newItemCount = await redisClient.hIncrBy(
        EventStore.HighestSoldItemIdToSalesMap,
        event.item_id,
        eventPrice,
    );
    let topSoldItemId = await redisClient.get(InsightsStore.TopSoldItemId);

    if (topSoldItemId == null) {
        topSoldItemId = event.item_id;
    } else {
        const topPageVisitItemCount = await redisClient.hGet(
            EventStore.HighestSoldItemIdToSalesMap,
            topSoldItemId,
        );

        if (newItemCount > Number(topPageVisitItemCount)) {
            topSoldItemId = event.item_id;
        } else if (newItemCount === Number(topPageVisitItemCount)) {
            if (event.item_id.localeCompare(topSoldItemId) > 0) {
                topSoldItemId = event.item_id;
            }
        }
    }

    await redisClient.set(InsightsStore.TopSoldItemId, topSoldItemId);
    await redisClient.zRemRangeByScore(
        EventStore.HighestSoldItemIdSet,
        0,
        windowStartTimestamp,
    );
    // await redisClient.xTrim(EventStore.EventStream, 'MINID', windowStartTimestamp);

    return true;
};

const processPageVisitInsight = async (event: Event<EventType.PageVisit>) => {
    const currentTimestamp = Date.now();
    // const currentTimestamp = 1711497600000; // Wednesday, March 27, 2024 12:00:00 AM
    const windowStartTimestamp =
        currentTimestamp - StoreWindowSize[EventStore.PageVisitItemIdSet];

    const expiredPageVisitItemIds = await redisClient.zRangeByScore(
        EventStore.PageVisitItemIdSet,
        0,
        windowStartTimestamp,
    );

    for (const itemId of expiredPageVisitItemIds) {
        await redisClient.hIncrBy(EventStore.PageVisitItemIdToCountMap, itemId, -1);
    }

    await redisClient.zAdd(EventStore.PageVisitItemIdSet, {
        score: event.timestamp,
        value: event.item_id,
    });
    const newItemCount = await redisClient.hIncrBy(
        EventStore.PageVisitItemIdToCountMap,
        event.item_id,
        1,
    );
    let topPageVisitItemId = await redisClient.get(InsightsStore.TopVisitedItemId);

    if (topPageVisitItemId == null) {
        topPageVisitItemId = event.item_id;
    } else {
        const topPageVisitItemCount = await redisClient.hGet(
            EventStore.PageVisitItemIdToCountMap,
            topPageVisitItemId,
        );

        if (Number(newItemCount) > Number(topPageVisitItemCount)) {
            topPageVisitItemId = event.item_id;
        } else if (newItemCount === Number(topPageVisitItemCount)) {
            if (event.item_id.localeCompare(topPageVisitItemId) > 0) {
                topPageVisitItemId = event.item_id;
            }
        }
    }

    await redisClient.set(InsightsStore.TopVisitedItemId, topPageVisitItemId);
    await redisClient.zRemRangeByScore(EventStore.PageVisitItemIdSet, 0, windowStartTimestamp);
    // await redisClient.xTrim(EventStore.EventStream, 'MINID', windowStartTimestamp);

    return true;
};

const processInsights = async (event: Event) => {
    console.log(`processing event: ${JSON.stringify(event)}`);

    try {
        switch (event.event_type) {
            case EventType.AddToCart:
                return processAddToCartInsight(event as Event<EventType.AddToCart>);

            case EventType.PageVisit:
                return processPageVisitInsight(event as Event<EventType.PageVisit>);

            case EventType.Purchase:
                return processPurchaseInsight(event as Event<EventType.Purchase>);

            default:
                throw new Error('EventHandlerNotImplementedException');
        }
    } catch {
        return false;
    }
};

export default processInsights;
