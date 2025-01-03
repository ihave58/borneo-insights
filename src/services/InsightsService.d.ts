type Event<T = EventType> = {
    customer_id: string;
    timestamp: number;
    item_id: string;
    event_type: T;
    price: T extends EventType.Purchase ? number : null;
};

type Insight = {
    topAddToCartItem: string | null;
    topPageVisitItem: string | null;
    topSalesItem: string | null;
};

export type { Event, Insight };
