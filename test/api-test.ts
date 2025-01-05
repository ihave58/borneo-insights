import { execSync } from 'child_process';
import { notEqual, equal } from 'assert';
import postEvent from './utils/postEvent';
import { sleep } from '../src/utils/sleep';

import readSampleEvents from './utils/readSampleEvents';
import fetchInsights from './utils/fetchInsights';
import generateMockEvents from './utils/generateMockEvents';
import getTopVisitedPageId from './utils/getTopVisitedPageId';
import getTopAddToCartItemId from './utils/getTopAddToCartItemId';
import getTopSoldItemId from './utils/getTopSoldItemId';

import { StoreWindowSize, EventStore } from '../src/enums';
import { Event } from '../src/types';

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

        console.log('Waiting for sample events to get processed...');
        await sleep(sampleEvents.length * 20);
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
        const windowStartTimestamp = currentTimestamp - StoreWindowSize[EventStore.PageVisitItemIdSet];

        const topPageVisitItemId = getTopVisitedPageId(sampleEvents, windowStartTimestamp);
        const insights = await fetchInsights();

        // compare the manually computed insight with api response.
        equal(topPageVisitItemId, insights.topVisitedItemId);
    });

    it("should match the 'top added to cart' item", async function () {
        // const currentTimestamp = Date.now();
        const currentTimestamp = 1711497600000; // Wednesday, March 27, 2024 12:00:00 AM
        const windowStartTimestamp = currentTimestamp - StoreWindowSize[EventStore.PageVisitItemIdSet];

        const topAddToCartItemId = getTopAddToCartItemId(sampleEvents, windowStartTimestamp);
        const insights = await fetchInsights();

        // compare the manually computed insight with api response.
        equal(topAddToCartItemId, insights.topAddToCartItemId);
    });

    it("should match the 'top sales' item", async function () {
        // const currentTimestamp = Date.now();
        const currentTimestamp = 1711497600000; // Wednesday, March 27, 2024 12:00:00 AM
        const windowStartTimestamp = currentTimestamp - StoreWindowSize[EventStore.PageVisitItemIdSet];

        const topSoldItemId = getTopSoldItemId(sampleEvents, windowStartTimestamp);
        const insights = await fetchInsights();

        // compare the manually computed insight with api response.
        equal(topSoldItemId, insights.topSoldItemId);
    });

    it('should match the insights using mock data', async function () {
        this.timeout(2 * 60 * 1000);

        const currentTimestamp = Date.now();
        const windowStartTimestamp = currentTimestamp - StoreWindowSize[EventStore.PageVisitItemIdSet];

        const mockEvents = generateMockEvents(
            1000,
            windowStartTimestamp,
            StoreWindowSize[EventStore.PageVisitItemIdSet],
        );

        const stdout = execSync('npm run cleanup');
        console.log(stdout.toString());

        console.log('Ingesting mock events...');
        const responses = await postEvent(mockEvents);
        console.log('Ingesting mock events done.');

        for (const response of responses) {
            equal(response.status, 200);
        }

        console.log('Waiting for mock events to get processed...');
        await sleep(mockEvents.length * 10);

        // const topVisitedItemId = getTopVisitedPageId(mockEvents, windowStartTimestamp);
        const topAddToCartItemId = getTopAddToCartItemId(mockEvents, windowStartTimestamp);
        const topSoldItemId = getTopSoldItemId(mockEvents, windowStartTimestamp);

        const insights = await fetchInsights();

        // compare the manually computed insight with api response.
        // equal(topVisitedItemId, insights.topVisitedItemId);
        equal(topAddToCartItemId, insights.topAddToCartItemId);
        equal(topSoldItemId, insights.topSoldItemId);
    });
});
