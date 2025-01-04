import type { Event } from '../../src/services/InsightsService';
import runSequentially from './runSequentially';
import { EVENTS_URL } from '../path';

const postEvent = async (event: Event | Array<Event>) => {
    const events = Array.isArray(event) ? event : [event];

    return runSequentially(
        events,
        (event) =>
            fetch(EVENTS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            }),
        10,
    );
};

export default postEvent;
