import dotenv from 'dotenv';
import getRedisClient from '../src/utils/getRedisClient';
import { EventStore, InsightsStore, InsightsConsumerGroupName } from '../src/enums';

dotenv.config();

(async () => {
    const storeNames = [...Object.values(EventStore), ...Object.values(InsightsStore)];
    const redisClient = getRedisClient();

    for (const storeName of storeNames) {
        console.log(`removing ${storeName}..`);
        await redisClient.del(storeName);
    }

    console.log('removing consumer group..');

    try {
        await redisClient.xGroupDestroy(EventStore.EventStream, InsightsConsumerGroupName);
    } catch {
        console.log();
    }

    console.log('cleanup success!');
    process.exit(0);
})();
