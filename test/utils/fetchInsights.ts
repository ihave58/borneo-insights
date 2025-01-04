import { Insights } from '../types';
import { INSIGHTS_URL } from '../path';

const fetchInsights = async (): Promise<Insights> => {
    const response = await fetch(INSIGHTS_URL);

    return response.ok ? await response.json() : {};
};

export default fetchInsights;
