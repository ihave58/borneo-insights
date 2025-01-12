import { EventType } from '../enums';
import { Event } from '../types';

const getTopVisitedItemId = (pageVisitEvents: Array<Event<EventType.PageVisit>>) => {
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
        } else if (itemCount === itemIdToCountMap.get(topPageVisitItemId!)!) {
            // console.log('#####', itemId, topPageVisitItemId, topPageVisitItemId.localeCompare(itemId));

            if (itemId.localeCompare(topPageVisitItemId) > 0) {
                topPageVisitItemId = itemId;
            }
        }
    }

    return topPageVisitItemId;
};

export default getTopVisitedItemId;
