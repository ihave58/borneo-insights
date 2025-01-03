import type { Event, Insight } from '../src/services/InsightsService';

type EventFileEntry = Event & {
    timestamp: string;
};

export type { EventFileEntry, Insight };
