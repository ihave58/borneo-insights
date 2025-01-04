import { Event, EventType } from '../../src/services/InsightsService';

const getTopVisitedPageId = (events: Array<Event>, startTimestamp: number) => {
    const pageVisitEvents = events.filter(
        (event: Event) => event.event_type === EventType.PageVisit && event.timestamp >= startTimestamp,
    );

    const itemIdToCountMap = new Map<string, number>();
    for (const event of pageVisitEvents) {
        const count = itemIdToCountMap.get(event.item_id) || 0;

        itemIdToCountMap.set(event.item_id, count + 1);
    }

    let topPageVisitItemId;
    for (const [itemId, itemCount] of itemIdToCountMap.entries()) {
        if (topPageVisitItemId === undefined) {
            topPageVisitItemId = itemId;
        } else if (itemCount >= itemIdToCountMap.get(topPageVisitItemId!)!) {
            topPageVisitItemId = itemId;
        }
    }

    return topPageVisitItemId;
};

export default getTopVisitedPageId;
