import { writeFileSync } from 'fs';
import path from 'path';
import readEvents from './readEvents';
import { Event } from '../../src/types';
import type { EventFileEntry } from '../types';

const mockEventsPath = path.join(process.cwd(), './test/sample/mock.jsonl');

const mapToEventEntry = (event: Event): EventFileEntry => {
    const timestamp = new Date().toUTCString();

    return {
        ...event,
        timestamp,
    };
};

const getMockEvents = async (): Promise<Array<Event>> => {
    try {
        return await readEvents(mockEventsPath);
    } catch {
        return [];
    }
};

const writeMockEvents = (events: Array<Event> = []) => {
    const data = events.map((event) => JSON.stringify(mapToEventEntry(event)));

    writeFileSync(mockEventsPath, data.join('\n'));
};

export { getMockEvents, writeMockEvents };
