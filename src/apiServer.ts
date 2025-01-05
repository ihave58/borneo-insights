import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import getInsights from './utils/getInsights';

dotenv.config();

const init = async () => {
    try {
        const app = express();

        app.use(express.json());
        app.get('/api/insights', async (_req: Request, response: Response) => {
            const insights = await getInsights();

            response.status(200).json(insights);
        });

        app.get('/', (_req: Request, res: Response) => {
            res.send('Hello Insights!');
        });

        app.listen(process.env.API_SERVER_PORT, () => {
            return console.log(`API server is listening at http://localhost:${process.env.API_SERVER_PORT}`);
        });

        return app;
    } catch (error) {
        console.error(error);
    }
};

init();
