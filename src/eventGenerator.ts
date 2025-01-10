import dotenv from 'dotenv';
import generateMockEvents from '../test/utils/generateMockEvents';
import postEvent from '../test/utils/postEvent';
import { randomSleep } from './utils/sleep';

dotenv.config();

(async () => {
    try {
        const parsedMinDelay = Number(process.argv[process.argv.length - 2]);
        const parsedMaxDelay = Number(process.argv[process.argv.length - 1]);

        const minDelay = Number.isNaN(parsedMinDelay) ? 0 : parsedMinDelay;
        const maxDelay = Number.isNaN(parsedMaxDelay) ? minDelay : parsedMaxDelay;

        while (true) {
            try {
                const mockEvents = generateMockEvents(1000, Date.now(), 60 * 1000);

                for (const mockEvent of mockEvents) {
                    console.log('Event generated:', mockEvent);

                    await postEvent(mockEvent);
                    await randomSleep(minDelay, maxDelay);
                }
            } catch (error) {
                console.error((error as Error).message);
            }
        }
    } catch (error) {
        console.error(error);
    }
})();
