import type { Event } from '../src/InsightsService';

type EventFileEntry = Event & {
    timestamp: string;
};

export type { EventFileEntry };
