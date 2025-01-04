import { Insight } from '../types';
import { INSIGHTS_URL } from '../path';

const fetchInsights = async (): Promise<Insight> => {
    const response = await fetch(INSIGHTS_URL);

    return response.ok ? await response.json() : {};
};

export default fetchInsights;
