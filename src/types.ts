import { EventType } from './enums';

type Event<T = EventType> = {
    customer_id: string;
    timestamp: number;
    item_id: string;
    event_type: T;
    price: number | null;
};

type EventPriceAsString<T = EventType> = {
    customer_id: string;
    timestamp: string;
    item_id: string;
    event_type: T;
    price: string;
};

type Insights = {
    topAddToCartItemId: string | null;
    topSoldItemId: string | null;
    topVisitedItemId: string | null;
};

export type { Event, EventPriceAsString, Insights };
