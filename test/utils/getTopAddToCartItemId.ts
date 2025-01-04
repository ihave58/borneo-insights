import { Event, EventType } from '../../src/services/InsightsService';

const getTopAddToCartItemId = (events: Array<Event>, startTimestamp: number) => {
    const addToCartEvents = events.filter(
        (event: Event) => event.event_type === EventType.AddToCart && event.timestamp >= startTimestamp,
    );
    const itemIdToCountMap = new Map<string, number>();

    for (const event of addToCartEvents) {
        const count = itemIdToCountMap.get(event.item_id) || 0;

        itemIdToCountMap.set(event.item_id, count + 1);
    }

    let topAddToCartItemId;
    for (const [itemId, itemCount] of itemIdToCountMap.entries()) {
        if (topAddToCartItemId === undefined) {
            topAddToCartItemId = itemId;
        } else if (itemCount >= itemIdToCountMap.get(topAddToCartItemId)!) {
            topAddToCartItemId = itemId;
        }
    }

    return topAddToCartItemId;
};

export default getTopAddToCartItemId;
