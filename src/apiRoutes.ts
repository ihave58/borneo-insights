import { Router } from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import InsightsService, { Event } from './services/InsightsService';

const router = Router();
let insightsService: InsightsService;

(async () => {
    try {
        dotenv.config();

        insightsService = new InsightsService(process.env.REDIS_URL as string);
        await insightsService.init();
    } catch {
        console.error('Error initializing InsightsService!');
    }
})();

router.get('/insights', async (request: Request, response: Response) => {
    const insights = await insightsService.getInsights();

    response.status(200).send(JSON.stringify(insights));
});

router.post('/event', async (request: Request<unknown, unknown, Event>, response: Response) => {
    try {
        await insightsService.addEvent(request.body);

        response.sendStatus(200);
    } catch (error) {
        console.error(error);

        response.status(500).send('ERROR');
    }
});

export default router;
