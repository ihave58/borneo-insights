import express from 'express';
import dotenv from 'dotenv';

import InsightsService, { Event } from './services/InsightsService';
import type { Request, Response } from 'express';

dotenv.config();

const initExpress = (insightsService: InsightsService) => {
    const app = express();
    app.use(express.json());

    app.get('/', (req: Request, res: Response) => {
        res.send('Hello Insights!');
    });

    app.get('/api/insights', async (request: Request, response: Response) => {
        const insights = await insightsService.getInsights();

        response.status(200).send(JSON.stringify(insights));
    });

    app.post('/api/event', async (request: Request<unknown, unknown, Event>, response: Response) => {
        try {
            await insightsService.addEvent(request.body);

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
    const insightsService = new InsightsService(process.env.REDIS_URL as string);

    await insightsService.init();
    initExpress(insightsService);
};

init();
