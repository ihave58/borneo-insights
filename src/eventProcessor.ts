import dotenv from 'dotenv';

import getNewEvents from './utils/getNewEvents';
import processEvent from './utils/processEvent';
import { setLastProcessedEventId } from './utils/lastProcessedEvent';
import { randomSleep } from './utils/sleep';
import { EventStore } from './enums';

dotenv.config();

const init = async () => {
    while (true) {
        try {
            const newEvents = await getNewEvents(EventStore.EventStream);

            if (newEvents.length > 0) {
                for (const [id, newEvent] of newEvents) {
                    await processEvent(newEvent, EventStore.EventStream);

                    await setLastProcessedEventId(id);
                }
            } else {
                console.log('No event found. waiting...');
            }
        } catch (error) {
            console.error(error);
        }

        await randomSleep();
    }
};

init();
