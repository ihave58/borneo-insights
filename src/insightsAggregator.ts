import dotenv from 'dotenv';

import { getEventsByTimestamp, getEventStreamInfo } from './utils/eventHelper';
import getDailyTimelineRanges from './utils/getDailyTimelineRanges';
import checkAndCreateTimeSeries from './utils/checkAndCreateTimeSeries';
import aggregateInsights from './utils/aggregateInsights';
import { addToAggregatedEventList } from './utils/lastProcessedEvent';
import { addDailyInsights } from './utils/historicInsightsHelper';

dotenv.config();

(async () => {
    try {
        await checkAndCreateTimeSeries();

        const { firstEntry } = await getEventStreamInfo();
        const startTimestamp = Number(firstEntry?.id.split('-')[0]);
        const endTimestamp = Date.now() - 24 * 60 * 60 * 1000;

        const dailyTimelineRanges = getDailyTimelineRanges(startTimestamp, endTimestamp);

        for (const [startTimestamp, endTimestamp] of dailyTimelineRanges) {
            const expiredEvents = await getEventsByTimestamp(
                endTimestamp.toString(),
                startTimestamp.toString(),
            );

            if (expiredEvents.length > 0) {
                const insights = await aggregateInsights(expiredEvents);

                if (insights) {
                    const eventIds = expiredEvents.map(([id]) => id);
                    await addDailyInsights(insights);
                    await addToAggregatedEventList(eventIds);
                }
            }
        }

        console.log('Success.');
    } catch (error) {
        console.error(error);
    }
})();
