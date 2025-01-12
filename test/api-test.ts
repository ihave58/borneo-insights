import { execSync } from 'child_process';
import { notEqual, equal } from 'assert';
import fs from 'fs';
import postEvent from './utils/postEvent';
import { sleep } from '../src/utils/sleep';

import readEventsFromFile from './utils/readEventsFromFile';
import { writeMockEvents, readMockEvents } from './utils/mockEvents';
import fetchInsights from './utils/fetchInsights';
import generateMockEvents from './utils/generateMockEvents';
import getTopVisitedItemId from '../src/utils/getTopVisitedItemId';
import getTopAddToCartItemId from '../src/utils/getTopAddToCartItemId';
import getTopSoldItemId from '../src/utils/getTopSoldItemId';

import { StoreWindowSize, EventStore, EventType } from '../src/enums';
import { Event } from '../src/types';
import path from 'path';
import getInsightsStatus from '../src/utils/getInsightsStatus';

const sampleEventsPath = path.join(process.cwd(), './test/sample/events.jsonl');
const mockEventsPath = path.join(process.cwd(), './test/sample/mock.jsonl');

describe('Tests for Events api', function () {
    let sampleEvents: Array<Event> = [];

    before(async function () {
        console.log(execSync('npm run cleanup').toString());
        console.log(execSync('npm run init').toString());

        console.log('Reading sample events...');
        sampleEvents = readEventsFromFile(sampleEventsPath);
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

        do {
            console.log('Waiting for sample events to get processed...');
            await sleep(1000);
        } while (!(await getInsightsStatus()));

        // console.log('Waiting for sample events to get processed...');
        // await sleep(sampleEvents.length * 10);
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
        const windowStartTimestamp =
            currentTimestamp - StoreWindowSize[EventStore.PageVisitItemIdSet];

        const pageVisitEvents = sampleEvents.filter(
            (event: Event) =>
                event.event_type === EventType.PageVisit &&
                event.timestamp >= windowStartTimestamp,
        ) as Array<Event<EventType.PageVisit>>;

        const topVisitedItemId = getTopVisitedItemId(pageVisitEvents);
        const insights = await fetchInsights();

        // compare the manually computed insight with api response.
        equal(topVisitedItemId, insights.topVisitedItemId);
    });

    it("should match the 'top added to cart' item", async function () {
        // const currentTimestamp = Date.now();
        const currentTimestamp = 1711497600000; // Wednesday, March 27, 2024 12:00:00 AM
        const windowStartTimestamp =
            currentTimestamp - StoreWindowSize[EventStore.PageVisitItemIdSet];

        const addToCartEvents = sampleEvents.filter(
            (event: Event) =>
                event.event_type === EventType.AddToCart &&
                event.timestamp >= windowStartTimestamp,
        ) as Array<Event<EventType.AddToCart>>;

        const topAddToCartItemId = getTopAddToCartItemId(addToCartEvents);
        const insights = await fetchInsights();

        // compare the manually computed insight with api response.
        equal(topAddToCartItemId, insights.topAddToCartItemId);
    });

    it("should match the 'top sales' item", async function () {
        // const currentTimestamp = Date.now();
        const currentTimestamp = 1711497600000; // Wednesday, March 27, 2024 12:00:00 AM
        const windowStartTimestamp =
            currentTimestamp - StoreWindowSize[EventStore.PageVisitItemIdSet];

        const purchaseEvents = sampleEvents.filter(
            (event: Event) =>
                event.event_type === EventType.Purchase &&
                event.timestamp >= windowStartTimestamp,
        ) as Array<Event<EventType.Purchase>>;

        const topSoldItemId = getTopSoldItemId(purchaseEvents);
        const insights = await fetchInsights();

        // compare the manually computed insight with api response.
        equal(topSoldItemId, insights.topSoldItemId);
    });

    it('should ingest mock events', async function () {
        this.timeout(2 * 60 * 1000);

        const currentTimestamp = Date.now();
        const windowStartTimestamp =
            currentTimestamp - StoreWindowSize[EventStore.PageVisitItemIdSet];

        const mockEvents = generateMockEvents(
            2000,
            windowStartTimestamp,
            StoreWindowSize[EventStore.PageVisitItemIdSet],
        );

        console.log(execSync('npm run cleanup').toString());
        console.log(execSync('npm run init').toString());

        console.log('Ingesting mock events...');
        const responses = await postEvent(mockEvents);
        console.log('Ingesting mock events done.');

        for (const response of responses) {
            equal(response.status, 200);
        }

        writeMockEvents(mockEvents, mockEventsPath);
        equal(fs.existsSync(mockEventsPath), true);

        do {
            console.log('Waiting for sample events to get processed...');
            await sleep(1000);
        } while (!(await getInsightsStatus()));

        // console.log('Waiting for mock events to get processed...');
        // await sleep(mockEvents.length * 10);
    });

    it('should match the insights using mock data', async function () {
        const currentTimestamp = Date.now();
        const windowStartTimestamp =
            currentTimestamp - StoreWindowSize[EventStore.PageVisitItemIdSet];

        console.log('Reading mock events...');
        const mockEvents = readMockEvents(mockEventsPath);
        console.log('Reading mock events done. Total Events: ', mockEvents.length);

        const mockPageVisitEvents = mockEvents.filter(
            (event: Event) =>
                event.event_type === EventType.PageVisit &&
                event.timestamp >= windowStartTimestamp,
        ) as Array<Event<EventType.PageVisit>>;

        const mockAddToCartEvents = mockEvents.filter(
            (event: Event) =>
                event.event_type === EventType.AddToCart &&
                event.timestamp >= windowStartTimestamp,
        ) as Array<Event<EventType.AddToCart>>;

        const mockPurchaseEvents = mockEvents.filter(
            (event: Event) =>
                event.event_type === EventType.Purchase &&
                event.timestamp >= windowStartTimestamp,
        ) as Array<Event<EventType.Purchase>>;

        const topVisitedItemId = getTopVisitedItemId(mockPageVisitEvents);
        const topAddToCartItemId = getTopAddToCartItemId(mockAddToCartEvents);
        const topSoldItemId = getTopSoldItemId(mockPurchaseEvents);

        const insights = await fetchInsights();

        // compare the manually computed insight with api response.
        equal(topVisitedItemId, insights.topVisitedItemId);
        equal(topAddToCartItemId, insights.topAddToCartItemId);
        equal(topSoldItemId, insights.topSoldItemId);
    });
});
