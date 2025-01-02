import path from 'path';
import fs from 'fs';
import type { Event } from '../../src/InsightsService';
import type { EventFileEntry } from '../types';

const sampleEventsPath = path.join(process.cwd(), './test/sample/events.jsonl');

const readSampleEvents = async () => {
    return new Promise<Array<Event>>((resolve, reject) => {
        const onEventsReceived = (data: string) => {
            try {
                const eventStrings = data.split('\n');
                const events: Array<Event> = [];

                for (let lineIndex = 0; lineIndex < eventStrings.length; lineIndex++) {
                    try {
                        if (eventStrings[lineIndex].length > 2) {
                            const eventFileEntry = JSON.parse(eventStrings[lineIndex]) as EventFileEntry;
                            const timestamp = Date.parse(eventFileEntry.timestamp);

                            events.push({
                                ...eventFileEntry,
                                timestamp,
                            });
                        }
                    } catch {
                        console.error(`Error parsing events.jsonl > #${lineIndex}. skipping...`);
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

        sampleEventsStream.on('error', (err) => console.error(`Error parsing events.jsonl`, err));
        sampleEventsStream.on('data', onEventsReceived);
    });
};

export default readSampleEvents;
