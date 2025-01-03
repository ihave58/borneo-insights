import type { Event } from '../../src/services/InsightsService';
import runSequentially from '../utils/runSequemtially';
import { EVENTS_URL } from '../path';

const postEvent = async (event: Event | Array<Event>) => {
    const events = Array.isArray(event) ? event : [event];

    return runSequentially(events, (event) => {
        console.log('event', event);

        return fetch(EVENTS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });
    });
};

export default postEvent;
