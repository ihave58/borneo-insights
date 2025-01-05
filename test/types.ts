import type { Event, Insights } from '../src/types';

type EventFileEntry = Event & {
    timestamp: string;
};

export type { EventFileEntry, Insights };
