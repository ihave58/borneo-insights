enum EventType {
    Purchase = 'purchase',
    AddToCart = 'add_to_cart',
    PageVisit = 'page_visit',
}

enum EventStore {
    EventStream = 'EventStream',
    LastProcessedEventId = 'LastProcessedEventId',

    AddToCartItemIdSet = 'AddToCartItemIdSet',
    AddToCartItemIdToCountMap = 'AddToCartItemIdToCountMap',

    PageVisitItemIdSet = 'PageVisitItemIdSet',
    PageVisitItemIdToCountMap = 'PageVisitItemIdToCountMap',

    HighestSoldItemIdSet = 'HighestSoldItemIdSet',
    HighestSoldItemIdToSalesMap = 'HighestSoldItemIdToSalesMap',
}

enum InsightsStore {
    TopAddToCardItemId = 'TopAddToCardItemId',
    TopPageVisitItemId = 'TopPageVisitItemId',
    TopSoldItemId = 'TopSoldItemId',
}

// const StoreWindowSize = {
//     [Stores.AddToCartItemIdSet]: 24 * 60 * 60 * 1000, //24 hours
//     [Stores.HighestSoldItemIdSet]: 24 * 60 * 60 * 1000, // 24 hours
//     [Stores.PageVisitItemIdSet]: 1 * 60 * 60 * 1000, // 1 hour
// };

const StoreWindowSize = {
    [EventStore.AddToCartItemIdSet]: 100 * 24 * 60 * 60 * 1000, // 100 days
    [EventStore.HighestSoldItemIdSet]: 100 * 24 * 60 * 60 * 1000, // 100 days
    [EventStore.PageVisitItemIdSet]: 100 * 24 * 60 * 60 * 1000, // 100 days
};

export { EventType, EventStore, InsightsStore, StoreWindowSize };
