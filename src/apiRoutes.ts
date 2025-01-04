import { Router } from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';

import { EventSchema } from './schemas';
import InsightsService, { Event } from './services/InsightsService';

dotenv.config();

const router = Router();
let insightsService: InsightsService;

(async () => {
    try {
        insightsService = new InsightsService(process.env.REDIS_URL as string);
        await insightsService.init();
    } catch {
        console.error('Error initializing InsightsService!');
    }
})();

router.get('/insights', async (_req: Request, response: Response) => {
    const insights = await insightsService.getInsights();

    response.status(200).send(JSON.stringify(insights));
});

router.post('/event', async (request: Request<unknown, unknown, Event>, response: Response) => {
    try {
        const validationResult = EventSchema.validate(request.body);

        if (validationResult.error) {
            throw new Error(validationResult.error.message);
        }

        await insightsService.addEvent(validationResult.value);

        response.sendStatus(200);
    } catch (error) {
        console.error(error);

        response.status(500).send(JSON.stringify(error));
    }
});

export default router;
