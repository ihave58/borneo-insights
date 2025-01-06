import path from "path";

const INSIGHTS_URL = 'http://localhost:3000/api/insights';
const EVENTS_URL = 'http://localhost:3001/api/event';
const EVENTS_LOG_PATH = path.join(__dirname, "../")

export { EVENTS_URL, INSIGHTS_URL };
