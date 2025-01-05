import runSequentially from './runSequentially';
import { EVENTS_URL } from '../path';
import type { Event } from '../../src/types';

const postEvent = async (event: Event | Array<Event>, delay = 10) => {
    const events = Array.isArray(event) ? event : [event];

    return runSequentially(
        events,
        (event) => {
            console.log(JSON.stringify(event));

            return fetch(EVENTS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            });
        },
        delay,
    );
};

export default postEvent;
