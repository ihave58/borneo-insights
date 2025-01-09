import dotenv from 'dotenv';
import getRedisClient from '../src/utils/getRedisClient';
import { EventStore, InsightsConsumerGroupName } from '../src/enums';

dotenv.config();

(async () => {
    const redisClient = getRedisClient();

    await redisClient.xGroupCreate(EventStore.EventStream, InsightsConsumerGroupName, '0', {
        MKSTREAM: true,
    });

    console.log('init success!');
    process.exit(0);
})();
