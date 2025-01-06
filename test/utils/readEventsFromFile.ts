import fs from 'fs';
import type { Event } from '../../src/types';
import type { EventFileEntry } from '../types';

const mapToEvent = (eventEntryString: string): Event => {
    const eventFileEntry = JSON.parse(eventEntryString) as EventFileEntry;
    const timestamp = Date.parse(eventFileEntry.timestamp);

    return {
        ...eventFileEntry,
        timestamp,
    };
};

const readEventsFromFile = (filePath: string) => {
    const data = fs.readFileSync(filePath, {
        encoding: 'utf8',
    });

    try {
        const eventStrings = data.split('\n');
        const events: Array<Event> = [];

        for (let lineIndex = 0; lineIndex < eventStrings.length; lineIndex++) {
            try {
                const eventFileEntryString = eventStrings[lineIndex];

                if (eventFileEntryString.length > 2) {
                    events.push(mapToEvent(eventFileEntryString));
                }
            } catch {
                console.error(`Error parsing ${filePath} line #${lineIndex}. skipping...`);
            }
        }

        return events;
    } catch {
        return [];
    }
};

export default readEventsFromFile;
