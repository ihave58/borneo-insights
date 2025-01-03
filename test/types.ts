import type { Event } from '../src/services/InsightsService';

type EventFileEntry = Event & {
    timestamp: string;
};

export type { EventFileEntry };
