import { notEqual } from 'assert';
import postEvent from './utils/postEvent';
import readSampleEvents from './utils/readSampleEvents';

import type { Event } from '../src/services/InsightsService';

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
});
