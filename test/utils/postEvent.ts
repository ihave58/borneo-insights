import type { Event } from '../../src/services/InsightsService';

const BASE_URL = 'http://localhost:3000/api';
const eventsUrl = `${BASE_URL}/event`;

async function runSequentially<V, R>(values: V[], fn: (v: V) => Promise<R>): Promise<R[]> {
    const result: R[] = [];

    for (const value of values) {
        result.push(await fn(value));
    }
    return result;
}

const postEvent = async (event: Event | Array<Event>) => {
    const events = Array.isArray(event) ? event : [event];

    return runSequentially(events, (event) => {
        console.log('event', event);

        return fetch(eventsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });
    });
    // events.map(async (event) => {
    //     return fetch(eventsUrl, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(event),
    //     });
    // }),
};

export default postEvent;
