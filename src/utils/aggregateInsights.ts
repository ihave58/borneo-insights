import getTopSoldItemId from './getTopSoldItemId';
import getTopVisitedItemId from './getTopVisitedItemId';
import getTopAddToCartItemId from './getTopAddToCartItemId';

import { EventType } from '../enums';
import type { Event, Insights } from '../types';

const aggregateInsights = async (
    eventWithIds: Array<[string, Event]>,
): Promise<Insights | undefined> => {
    try {
        const addToCartEvents: Array<Event<EventType.AddToCart>> = [];
        const purchaseEvents: Array<Event<EventType.Purchase>> = [];
        const pageVisitEvents: Array<Event<EventType.PageVisit>> = [];

        for (const [, event] of eventWithIds) {
            if (event.event_type === EventType.AddToCart) {
                addToCartEvents.push(event as Event<EventType.AddToCart>);
            } else if (event.event_type === EventType.Purchase) {
                purchaseEvents.push(event as Event<EventType.Purchase>);
            } else if (event.event_type === EventType.PageVisit) {
                pageVisitEvents.push(event as Event<EventType.PageVisit>);
            }
        }

        const topAddToCartItemId = getTopAddToCartItemId(addToCartEvents);
        const topVisitedItemId = getTopVisitedItemId(pageVisitEvents);
        const topSoldItemId = getTopSoldItemId(purchaseEvents);

        if (topSoldItemId != null && topAddToCartItemId != null && topVisitedItemId != null) {
            return {
                topSoldItemId,
                topVisitedItemId,
                topAddToCartItemId,
            };
        }
    } catch (error) {
        console.error(error);
    }
};

export default aggregateInsights;
