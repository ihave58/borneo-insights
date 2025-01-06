import dotenv from 'dotenv';

import getNewEvents from './utils/getNewEvents';
import processEvent from './utils/processEvent';
import { setLastProcessedEventId } from './utils/lastProcessedEvent';
import { randomSleep } from './utils/sleep';
import { EventStore } from './enums';

dotenv.config();

const init = async () => {
    const parsedMinDelay = Number(process.argv[process.argv.length - 2]);
    const parsedMaxDelay = Number(process.argv[process.argv.length - 1]);

    const minDelay = Number.isNaN(parsedMinDelay) ? 0 : parsedMinDelay;
    const maxDelay = Number.isNaN(parsedMaxDelay) ? 0 : parsedMaxDelay;

    while (true) {
        try {
            const newEvents = await getNewEvents(EventStore.EventStream);

            if (newEvents.length > 0) {
                for (const [id, newEvent] of newEvents) {
                    const result = await processEvent(newEvent, EventStore.EventStream);

                    if (result) {
                        await setLastProcessedEventId(id);
                    }
                }
            } else {
                console.log('Waiting for events...');
            }
        } catch (error) {
            console.error(error);
        }

        await randomSleep(minDelay, maxDelay);
    }
};

init();
