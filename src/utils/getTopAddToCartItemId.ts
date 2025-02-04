import { EventType } from '../enums';
import { Event } from '../types';

const getTopAddToCartItemId = (addToCartEvents: Array<Event<EventType.AddToCart>>) => {
    const itemIdToCountMap = new Map<string, number>();

    for (const event of addToCartEvents) {
        const count = itemIdToCountMap.get(event.item_id) || 0;

        itemIdToCountMap.set(event.item_id, count + 1);
    }

    let topAddToCartItemId;
    for (const [itemId, itemCount] of itemIdToCountMap.entries()) {
        if (topAddToCartItemId === undefined) {
            topAddToCartItemId = itemId;
        } else if (itemCount > itemIdToCountMap.get(topAddToCartItemId)!) {
            topAddToCartItemId = itemId;
        } else if (itemCount === itemIdToCountMap.get(topAddToCartItemId!)!) {
            // console.log('#####', itemId, topAddToCartItemId, topAddToCartItemId.localeCompare(itemId));

            if (itemId.localeCompare(topAddToCartItemId) > 0) {
                topAddToCartItemId = itemId;
            }
        }
    }

    return topAddToCartItemId;
};

export default getTopAddToCartItemId;
