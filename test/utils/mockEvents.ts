import { writeFileSync } from 'fs';
import readEventsFromFile from './readEventsFromFile';
import { Event } from '../../src/types';
import type { EventFileEntry } from '../types';

const mapToEventEntry = (event: Event): EventFileEntry => {
    const timestamp = new Date(event.timestamp).toUTCString();

    return {
        ...event,
        timestamp,
    };
};

const readMockEvents = (mockEventsPath: string): Array<Event> => {
    return readEventsFromFile(mockEventsPath);
};

const writeMockEvents = (events: Array<Event> = [], mockEventsPath: string) => {
    const data = events.map((event) => JSON.stringify(mapToEventEntry(event)));

    writeFileSync(mockEventsPath, data.join('\n'));
};

export { readMockEvents, writeMockEvents };
