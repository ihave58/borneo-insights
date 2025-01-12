const getStartOfTheDayTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);

    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);

    return date.getTime();
};

const getDailyTimelineRanges = (startTimestamp: number, endTimestamp: number) => {
    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const startOfTheDayTimestamp = getStartOfTheDayTimestamp(endTimestamp);

    const ranges = [[startOfTheDayTimestamp, endTimestamp]];
    let beginTimestamp = startOfTheDayTimestamp - 1;

    while (beginTimestamp - millisecondsInADay > startTimestamp) {
        ranges.push([beginTimestamp - millisecondsInADay + 1, beginTimestamp]);

        beginTimestamp -= millisecondsInADay;
    }

    ranges.push([startTimestamp, beginTimestamp]);

    return ranges;
};

export default getDailyTimelineRanges;
