import { notEqual, equal } from 'assert';
import postEvent from './utils/postEvent';

import readSampleEvents from './utils/readSampleEvents';
import fetchInsights from './utils/fetchInsights';

import { Event, EventType, Stores, StoreWindowSize } from '../src/services/InsightsService';

describe('Tests for Events api', function () {
    let sampleEvents: Array<Event> = [];

    before(async function () {
        sampleEvents = await readSampleEvents();
    });

    it('should read events from the sample file', function () {
        notEqual(sampleEvents.length, 0);
    });

    it('should ingest event', async function () {
        this.timeout(60 * 1000);

        await postEvent(sampleEvents);
    });

    it('should provide insights', async function () {
        const insights = await fetchInsights();

        notEqual(insights.topAddToCartItemId, null);
        notEqual(insights.topVisitedItemId, null);
        notEqual(insights.topSoldItemId, null);
    });

    it("should match the 'top visited' item", async function () {
        const currentTimestamp = Date.now();
        const currentMinus1HourTimestamp = currentTimestamp - StoreWindowSize[Stores.PageVisitItemIdSet];

        const pageVisitEvents = sampleEvents.filter(
            (event: Event) => event.event_type === EventType.PageVisit && event.timestamp >= currentMinus1HourTimestamp,
        );
        const itemIdToCountMap = new Map<string, number>();

        for (const event of pageVisitEvents) {
            const count = itemIdToCountMap.get(event.item_id) || 0;

            itemIdToCountMap.set(event.item_id, count + 1);
        }

        let topPageVisitItemId;
        for (const [itemId, itemCount] of itemIdToCountMap.entries()) {
            if (topPageVisitItemId === undefined) {
                topPageVisitItemId = itemId;
            } else if (itemCount >= itemIdToCountMap.get(topPageVisitItemId!)!) {
                topPageVisitItemId = itemId;
            }
        }

        const insights = await fetchInsights();

        equal(topPageVisitItemId, insights.topVisitedItemId);
    });

    it("should match the 'top added to cart' item", async function () {
        const currentTimestamp = Date.now();
        const currentMinus1HourTimestamp = currentTimestamp - StoreWindowSize[Stores.PageVisitItemIdSet];

        const addToCartEvents = sampleEvents.filter(
            (event: Event) => event.event_type === EventType.AddToCart && event.timestamp >= currentMinus1HourTimestamp,
        );
        const itemIdToCountMap = new Map<string, number>();

        for (const event of addToCartEvents) {
            const count = itemIdToCountMap.get(event.item_id) || 0;

            itemIdToCountMap.set(event.item_id, count + 1);
        }

        let topAddToCartItemId;
        for (const [itemId, itemCount] of itemIdToCountMap.entries()) {
            if (topAddToCartItemId === undefined) {
                topAddToCartItemId = itemId;
            } else if (itemCount >= itemIdToCountMap.get(topAddToCartItemId)!) {
                topAddToCartItemId = itemId;
            }
        }

        const insights = await fetchInsights();

        equal(topAddToCartItemId, insights.topAddToCartItemId);
    });

    it("should match the 'top purchased' item", async function () {
        const currentTimestamp = Date.now();
        const currentMinus1HourTimestamp = currentTimestamp - StoreWindowSize[Stores.PageVisitItemIdSet];

        const purchaseEvents = sampleEvents.filter(
            (event: Event) => event.event_type === EventType.Purchase && event.timestamp >= currentMinus1HourTimestamp,
        );
        const itemIdToCountMap = new Map<string, number>();

        for (const event of purchaseEvents) {
            const count = itemIdToCountMap.get(event.item_id) || 0;

            itemIdToCountMap.set(event.item_id, count + 1);
        }

        let topPurchasedItemId;
        for (const [itemId, itemCount] of itemIdToCountMap.entries()) {
            if (topPurchasedItemId === undefined) {
                topPurchasedItemId = itemId;
            } else if (itemCount >= itemIdToCountMap.get(topPurchasedItemId!)!) {
                topPurchasedItemId = itemId;
            }
        }

        const insights = await fetchInsights();

        equal(topPurchasedItemId, insights.topSoldItemId);
    });
});
