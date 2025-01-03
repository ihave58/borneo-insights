type Event<T = EventType> = {
    customer_id: string;
    timestamp: number;
    item_id: string;
    event_type: T;
    price: T extends EventType.Purchase ? number : null;
};

type Insight = {
    topAddToCartItemId: string | null;
    topSoldItemId: string | null;
    topVisitedItemId: string | null;
};

export type { Event, Insight };
