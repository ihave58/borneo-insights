import dotenv from 'dotenv';
import getRedisClient from '../src/utils/getRedisClient';
import { EventStore, InsightsStore } from '../src/enums';

dotenv.config();

(async () => {
    const storeNames = [...Object.values(EventStore), ...Object.values(InsightsStore)];
    const redisClient = getRedisClient();

    for (const storeName of storeNames) {
        console.log(`Cleaning ${storeName}.`);

        await redisClient.del(storeName);
    }

    console.log('Cleanup success!');
    process.exit(0);
})();
