import path from 'path';
import fs from 'fs';
import type { Event } from '../../src/services/InsightsService';
import type { EventFileEntry } from '../types';

const sampleEventsPath = path.join(process.cwd(), './test/sample/events.jsonl');

const mapToEvent = (eventEntryString: string): Event => {
    const eventFileEntry = JSON.parse(eventEntryString) as EventFileEntry;
    const timestamp = Date.parse(eventFileEntry.timestamp);

    return {
        ...eventFileEntry,
        timestamp,
    };
};

const readSampleEvents = async () => {
    return new Promise<Array<Event>>((resolve, reject) => {
        const onEventsReceived = (data: string) => {
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
                        console.error(`Error parsing events.jsonl line #${lineIndex}. skipping...`);
                    }
                }

                resolve(events);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        };

        const sampleEventsStream = fs.createReadStream(sampleEventsPath, {
            encoding: 'utf-8',
        });

        sampleEventsStream.on('error', (error) => console.error(`Error parsing events.jsonl`, error.message));
        sampleEventsStream.on('data', onEventsReceived);
    });
};

export default readSampleEvents;
