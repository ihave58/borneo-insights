import type { Event, Insights } from '../src/services/InsightsService';

type EventFileEntry = Event & {
    timestamp: string;
};

export type { EventFileEntry, Insights };
