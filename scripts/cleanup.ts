import dotenv from 'dotenv';
import InsightsService from '../src/services/InsightsService';

dotenv.config();

(async () => {
    const insightsService = new InsightsService(process.env.REDIS_URL as string);

    await insightsService.cleanup();

    console.log('Cleanup success!');
    process.exit(0);
})();
