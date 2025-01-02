import { createClient, RedisClientType } from 'redis';

type Event<T = EventType> = {
    customer_id: string;
    timestamp: number;
    item_id: string;
    event_type: T;
    price: T extends EventType.Purchase ? number : null;
};

enum EventType {
    Purchase = 'purchase',
    AddToCart = 'add_to_cart',
    PageVisit = 'page_visit',
}

enum Stores {
    AddToCartItemIdSet = 'AddToCartItemIdSet',
    AddToCartItemIdTopK = 'AddToCartItemIdTopK',

    PageVisitItemIdSet = 'PageVisitItemIdSet',
    PageVisitItemIdTopK = 'PageVisitItemIdTopK',

    HighestSalesItemIdSet = 'HighestSalesItemIdSet',
    HighestSalesItemIdTopK = 'HighestSalesItemIdTopK',
}

class InsightsService {
    private redisClient: RedisClientType;

    constructor() {
        this.redisClient = createClient();

        this.init();
    }

    private checkAndCreateHighestSaleStores = async () => {
        const hasExisted = await this.redisClient.exists(Stores.HighestSalesItemIdTopK);

        if (hasExisted === 0) {
            const result = await this.redisClient.topK.RESERVE(Stores.HighestSalesItemIdTopK, 1);

            if (result === 'OK') {
                console.log(`Created ${Stores.HighestSalesItemIdTopK}.`);
            } else {
                throw new Error(`Error Creating ${Stores.HighestSalesItemIdTopK}.`);
            }
        }
    };

    private checkAndCreatePageVisitStores = async () => {
        const hasExisted = await this.redisClient.exists(Stores.PageVisitItemIdTopK);

        if (hasExisted === 0) {
            const result = await this.redisClient.topK.RESERVE(Stores.PageVisitItemIdTopK, 1);

            if (result === 'OK') {
                console.log(`Created ${Stores.PageVisitItemIdTopK}.`);
            } else {
                throw new Error(`Error Creating ${Stores.PageVisitItemIdTopK}.`);
            }
        }
    };

    private checkAndCreateAddToCartStores = async () => {
        const hasExisted = await this.redisClient.exists(Stores.AddToCartItemIdTopK);

        if (hasExisted === 0) {
            const result = await this.redisClient.topK.RESERVE(Stores.AddToCartItemIdTopK, 1);

            if (result === 'OK') {
                console.log(`Created ${Stores.AddToCartItemIdTopK}.`);
            } else {
                throw new Error(`Error Creating ${Stores.AddToCartItemIdTopK}.`);
            }
        }
    };

    private init = async (): Promise<void> => {
        await this.redisClient.connect();

        await this.checkAndCreateAddToCartStores();
        await this.checkAndCreatePageVisitStores();
        await this.checkAndCreateHighestSaleStores();
    };

    private handleAddItemToCartEvent = async (event: Event<EventType.AddToCart>) => {
        const currentTimestamp = Date.now();

        await this.redisClient.zAdd(Stores.AddToCartItemIdSet, { score: currentTimestamp, value: event.item_id });
        await this.redisClient.topK.incrBy(Stores.AddToCartItemIdTopK, {
            item: event.item_id,
            incrementBy: 1,
        });
    };

    private handleItemPurchaseEvent = async (event: Event<EventType.Purchase>) => {
        const currentTimestamp = Date.now();

        await this.redisClient.zAdd(Stores.HighestSalesItemIdSet, { score: currentTimestamp, value: event.item_id });
        await this.redisClient.topK.incrBy(Stores.HighestSalesItemIdTopK, {
            item: event.item_id,
            incrementBy: event.price,
        });
    };

    private handlePageVisitEvent = async (event: Event<EventType.PageVisit>) => {
        const currentTimestamp = Date.now();

        await this.redisClient.zAdd(Stores.PageVisitItemIdSet, { score: currentTimestamp, value: event.item_id });
        await this.redisClient.topK.incrBy(Stores.PageVisitItemIdTopK, {
            item: event.item_id,
            incrementBy: 1,
        });
    };

    public addEvent = async (event: Event) => {
        switch (event.event_type) {
            case EventType.AddToCart: {
                return await this.handleAddItemToCartEvent(event as Event<EventType.AddToCart>);
            }

            case EventType.PageVisit: {
                return await this.handlePageVisitEvent(event as Event<EventType.PageVisit>);
            }

            case EventType.Purchase: {
                return await this.handleItemPurchaseEvent(event as Event<EventType.Purchase>);
            }

            default: {
                throw new Error('EventHandlerNotImplementedException');
            }
        }
    };

    public getInsights = async () => {
        const topAddToCartItems = await this.redisClient.topK.list(Stores.AddToCartItemIdTopK);
        const topPageVisitItems = await this.redisClient.topK.list(Stores.PageVisitItemIdTopK);
        const highestSalesItems = await this.redisClient.topK.list(Stores.HighestSalesItemIdTopK);

        return {
            topAddToCartItem: topAddToCartItems[0],
            topPageVisitItems: topPageVisitItems[0],
            highestSalesItems: highestSalesItems[0],
        };
    };
}

const instance = new InsightsService();

export type { Event };

export default instance;
export { InsightsService, EventType, Stores };
