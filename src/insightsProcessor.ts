import dotenv from 'dotenv';

import { getNewEvents } from './utils/eventUtils';
import processInsights from './utils/processInsights';
import { ackEventId, setLastProcessedEventId } from './utils/lastProcessedEvent';
import { randomSleep } from './utils/sleep';
import { EventStore } from './enums';

dotenv.config();

(async () => {
    const consumerId = process.argv[2];

    const parsedMinDelay = Number(process.argv[process.argv.length - 2]);
    const parsedMaxDelay = Number(process.argv[process.argv.length - 1]);

    const minDelay = Number.isNaN(parsedMinDelay) ? 0 : parsedMinDelay;
    const maxDelay = Number.isNaN(parsedMaxDelay) ? minDelay : parsedMaxDelay;

    if (consumerId == null) {
        console.error('consumer name is required.');
        process.exit(-1);
    }

    while (true) {
        try {
            // await checkAndClaimFailedEvents(EventStore.EventStream, consumerId);
            const newEvents = await getNewEvents(EventStore.EventStream, consumerId);

            if (newEvents.length > 0) {
                for (const [id, newEvent] of newEvents) {
                    const result = await processInsights(newEvent);

                    if (result) {
                        await ackEventId(id);
                        await setLastProcessedEventId(id);
                    }
                }
            } else {
                console.log('All events processed. waiting...');
            }
        } catch (error) {
            console.error(error);
        }

        await randomSleep(minDelay, maxDelay);
    }
})();
