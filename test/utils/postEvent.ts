import type { Event } from '../../src/InsightsService';

const BASE_URL = 'http://localhost:3000/api';
const eventsUrl = `${BASE_URL}/event`;

const postEvent = async (event: Event | Array<Event>) => {
    const events = Array.isArray(event) ? event : [event];

    return Promise.all(
        events.map(async (event) => {
            return fetch(eventsUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            });
        }),
    );
};

export default postEvent;
