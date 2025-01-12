import { EventType } from '../enums';
import { Event } from '../types';

const getTopSoldItemId = (purchaseEvents: Array<Event<EventType.Purchase>>) => {
    const itemIdToSalesMap = new Map<string, number>();

    for (const event of purchaseEvents) {
        const sales = itemIdToSalesMap.get(event.item_id) || 0;

        itemIdToSalesMap.set(event.item_id, sales + event.price!);
    }

    let topSoldItemId;
    for (const [itemId, itemCount] of itemIdToSalesMap.entries()) {
        if (topSoldItemId === undefined) {
            topSoldItemId = itemId;
        } else if (itemCount > itemIdToSalesMap.get(topSoldItemId!)!) {
            topSoldItemId = itemId;
        } else if (itemCount === itemIdToSalesMap.get(topSoldItemId!)!) {
            // console.log('#####', itemId, topPageVisitItemId, topPageVisitItemId.localeCompare(itemId));

            if (itemId.localeCompare(topSoldItemId) > 0) {
                topSoldItemId = itemId;
            }
        }
    }

    return topSoldItemId;
};

export default getTopSoldItemId;
