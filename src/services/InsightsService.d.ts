type Event<T = EventType> = {
    customer_id: string;
    timestamp: number;
    item_id: string;
    event_type: T;
    price: number | null;
};

type Insights = {
    topAddToCartItemId: string | null;
    topSoldItemId: string | null;
    topVisitedItemId: string | null;
};

export {
    EventType,
    Stores,
};

export type { Event, Insights };
