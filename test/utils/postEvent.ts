import { sleep } from '../../src/utils/sleep';
import { EVENTS_URL } from '../path';
import type { Event } from '../../src/types';

const postEvent = async (event: Event | Array<Event>, delay = 10) => {
    const events = Array.isArray(event) ? event : [event];
    const result = [];

    for (event of events) {
        result.push(
            await fetch(EVENTS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            }),
        );

        await sleep(delay);
    }

    return result;
};

export default postEvent;
