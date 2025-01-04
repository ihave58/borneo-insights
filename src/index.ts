import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';

import apiRoutes from './apiRoutes';

dotenv.config();

const init = async () => {
    try {
        const app = express();

        app.use(express.json());
        app.use('/api', apiRoutes);

        app.get('/', (_req: Request, res: Response) => {
            res.send('Hello Insights!');
        });

        app.listen(process.env.PORT, () => {
            return console.log(`Express is listening at http://localhost:${process.env.PORT}`);
        });

        return app;
    } catch (error) {
        console.error(error);
    }
};

init();
