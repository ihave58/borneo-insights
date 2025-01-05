import {
    createClient,
    RedisClientType as RedisClientTypeBase,
    RedisFunctions,
    RedisModules,
    RedisScripts,
} from 'redis';
import dotenv from 'dotenv';

type RedisClientType = RedisClientTypeBase<RedisModules, RedisFunctions, RedisScripts>;

dotenv.config();

let redisClient = createClient({ url: process.env.REDIS_URL as string });

(async () => {
    try {
        redisClient = await redisClient.connect();
    } catch {
        console.error('Error initializing Redis Client!');
    }
})();

const getRedisClient = (): RedisClientType => {
    if (!redisClient) {
        throw new Error('Redis Client not initialized yet.');
    }

    return redisClient;
};

export default getRedisClient;
export type { RedisClientType };
