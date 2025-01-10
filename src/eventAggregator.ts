import dotenv from 'dotenv';

import { getNewEvents } from './utils/eventUtils';
import processInsights from './utils/processInsights';
import { ackEventId, setLastProcessedEventId } from './utils/lastProcessedEvent';
import { EventStore } from './enums';

dotenv.config();

(async () => {
    try {
        // await checkAndClaimFailedEvents(EventStore.EventStream, consumerId);
        const newEvents = await getNewEvents(EventStore.EventStream, '');

        if (newEvents.length > 0) {
            for (const [id, newEvent] of newEvents) {
                const result = await processInsights(newEvent);

                if (result) {
                    await ackEventId(id);
                    await setLastProcessedEventId(id);
                }
            }
        } else {
            console.log('Waiting for events...');
        }
    } catch (error) {
        console.error(error);
    }
})();
