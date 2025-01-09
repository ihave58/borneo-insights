import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';

import ingestEvent from './utils/ingestEvent';
import { EventSchema } from './schemas/schemas';
import { Event } from './types';
import { EventStore } from './enums';

dotenv.config();

(async () => {
    try {
        const app = express();
        app.use(express.json());

        app.post('/api/event', async (request: Request<unknown, unknown, Event>, response: Response) => {
            try {
                const validationResult = EventSchema.validate(request.body);

                if (validationResult.error) {
                    throw new Error(validationResult.error.message);
                }

                await ingestEvent(request.body, EventStore.EventStream);
                response.sendStatus(200);
            } catch (error) {
                console.error(error);

                response.status(500).send(error);
            }
        });

        app.get('/', (_req: Request, res: Response) => {
            res.send('Hello from Event Ingestion service...');
        });

        app.listen(process.env.INGESTION_SERVER_PORT, () => {
            return console.log(
                `Event Ingestion service is listening at http://localhost:${process.env.INGESTION_SERVER_PORT}`,
            );
        });

        return app;
    } catch (error) {
        console.error(error);
    }
})();
