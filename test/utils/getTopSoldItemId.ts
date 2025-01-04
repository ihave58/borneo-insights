import { Event, EventType } from '../../src/services/InsightsService';

const getTopSoldItemId = (events: Array<Event>, startTimestamp: number) => {
    const purchaseEvents = events.filter(
        (event: Event) => event.event_type === EventType.Purchase && event.timestamp >= startTimestamp,
    );
    const itemIdToSalesMap = new Map<string, number>();

    for (const event of purchaseEvents) {
        const sales = itemIdToSalesMap.get(event.item_id) || 0;

        itemIdToSalesMap.set(event.item_id, sales + event.price!);
    }

    let topSoldItemId;
    for (const [itemId, itemCount] of itemIdToSalesMap.entries()) {
        if (topSoldItemId === undefined) {
            topSoldItemId = itemId;
        } else if (itemCount >= itemIdToSalesMap.get(topSoldItemId!)!) {
            topSoldItemId = itemId;
        }
    }

    return topSoldItemId;
};

export default getTopSoldItemId;