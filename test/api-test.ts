import { execSync } from 'child_process';
import { notEqual, equal } from 'assert';
import postEvent from './utils/postEvent';

import readSampleEvents from './utils/readSampleEvents';
import fetchInsights from './utils/fetchInsights';

import { Event, EventType, Stores, StoreWindowSize } from '../src/services/InsightsService';

describe('Tests for Events api', function () {
    let sampleEvents: Array<Event> = [];

    before(async function () {
        const stdout = execSync('npm run cleanup');
        console.log(stdout.toString());

        console.log('Reading sample events...');
        sampleEvents = await readSampleEvents();
        console.log('Reading sample events done.');
    });

    it('should read events from the sample file', function () {
        notEqual(sampleEvents.length, 0);
    });

    it('should ingest sample events', async function () {
        this.timeout(60 * 1000);

        console.log('Ingesting sample events...');
        const responses = await postEvent(sampleEvents);
        console.log('Ingesting sample events done.');

        for (const response of responses) {
            equal(response.status, 200);
        }
    });

    it('should provide insights API', async function () {
        const insights = await fetchInsights();

        notEqual(insights.topAddToCartItemId, null);
        notEqual(insights.topVisitedItemId, null);
        notEqual(insights.topSoldItemId, null);
    });

    it("should match the 'top visited' item", async function () {
        // const currentTimestamp = Date.now();
        const currentTimestamp = 1711497600000; // Wednesday, March 27, 2024 12:00:00 AM
        const windowStartTimestamp = currentTimestamp - StoreWindowSize[Stores.PageVisitItemIdSet];

        const pageVisitEvents = sampleEvents.filter(
            (event: Event) => event.event_type === EventType.PageVisit && event.timestamp >= windowStartTimestamp,
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

        // compare the manually computed insight with api response.
        equal(topPageVisitItemId, insights.topVisitedItemId);
    });

    it("should match the 'top added to cart' item", async function () {
        // const currentTimestamp = Date.now();
        const currentTimestamp = 1711497600000; // Wednesday, March 27, 2024 12:00:00 AM
        const windowStartTimestamp = currentTimestamp - StoreWindowSize[Stores.PageVisitItemIdSet];

        const addToCartEvents = sampleEvents.filter(
            (event: Event) => event.event_type === EventType.AddToCart && event.timestamp >= windowStartTimestamp,
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

        // compare the manually computed insight with api response.
        equal(topAddToCartItemId, insights.topAddToCartItemId);
    });

    it("should match the 'top sales' item", async function () {
        // const currentTimestamp = Date.now();
        const currentTimestamp = 1711497600000; // Wednesday, March 27, 2024 12:00:00 AM
        const windowStartTimestamp = currentTimestamp - StoreWindowSize[Stores.PageVisitItemIdSet];

        const purchaseEvents = sampleEvents.filter(
            (event: Event) => event.event_type === EventType.Purchase && event.timestamp >= windowStartTimestamp,
        );
        const itemIdToSalesMap = new Map<string, number>();

        for (const event of purchaseEvents) {
            const sales = itemIdToSalesMap.get(event.item_id) || 0;

            itemIdToSalesMap.set(event.item_id, sales + event.price!);
        }

        let topSoldItemId;
        for (const [itemId, itemCount] of itemIdToSalesMap.entries()) {
            if (topSoldItemId === undefined) {
                topSoldItemId = itemId;
            } else if (itemCount >= itemIdToSalesMap.get(topSoldItemId!)!) {
                topSoldItemId = itemId;
            }
        }

        const insights = await fetchInsights();

        // compare the manually computed insight with api response.
        equal(topSoldItemId, insights.topSoldItemId);
    });
});
