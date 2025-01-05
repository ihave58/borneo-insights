import { EventType } from '../../src/enums';
import { Event } from '../../src/types';

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
        } else if (itemCount > itemIdToCountMap.get(topPageVisitItemId!)!) {
            topPageVisitItemId = itemId;
        } else if (
            itemCount === itemIdToCountMap.get(topPageVisitItemId!)! &&
            topPageVisitItemId.localeCompare(itemId) < 0
        ) {
            topPageVisitItemId = itemId;
        }
    }

    return topPageVisitItemId;
};

export default getTopVisitedPageId;
