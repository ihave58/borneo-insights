import express from 'express';
import dotenv from 'dotenv';

import type { Request, Response } from 'express';

import analyticsService, { InsightsService, Event } from './InsightsService';

dotenv.config();

const initExpress = (analyticsService: InsightsService) => {
    const app = express();
    app.use(express.json());

    app.get('/', (req: Request, res: Response) => {
        res.send('Hello Analytics!');
    });

    app.get('/api/insights', async (request: Request, response: Response) => {
        const insights = await analyticsService.getInsights();

        response.status(200).send(JSON.stringify(insights));
    });

    app.post('/api/event', async (request: Request<unknown, unknown, Event>, response: Response) => {
        try {
            await analyticsService.addEvent(request.body);

            response.sendStatus(200);
        } catch {
            response.status(500).send('ERROR');
        }
    });

    app.listen(process.env.PORT, () => {
        return console.log(`Express is listening at http://localhost:${process.env.PORT}`);
    });

    return app;
};

const init = async () => {
    initExpress(analyticsService);
};

init();
