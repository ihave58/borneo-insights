import { MongoClient, ServerApiVersion, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URL as string, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

(async () => {
    try {
        await client.connect();
        await client.db(client.options.dbName).command({ ping: 1 });
    } catch {
        console.error('Error initializing Mongo Client!');
    }
})();

const getMongoDB = (): Db => client.db(client.options.dbName);

export default getMongoDB;
export type { MongoClient };
