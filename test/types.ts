import type { Event, Insights } from '../src/types';
import { EventType } from '../src/enums';

type EventFileEntry<T = EventType> = {
    customer_id: string;
    timestamp: string;
    item_id: string;
    event_type: T;
    price: number | null;
};

export type { EventFileEntry, Insights };
