**Solution without using streams** branch: "without-stream" => https://github.com/ihave58/borneo-insights/tree/without-streams

**Solution with streams** branch: "main" => https://github.com/ihave58/borneo-insights/tree/main


- npm install;
- Set the respective .env file for Redis server.
- Open 3 terminals and run the below services independently:

  - npm run start:api-insights; (API server listens on http://localhost:3000)<br />
  - npm run start:event-ingestor; (Event ingestion service listens on http://localhost:3001)<br />
  - npm run start:insights-processor consumer1; (Event processor service)<br />
  - npm run start:insights-aggregator (Event aggregator service)<br />
  - npm run test;<br />

GET http://localhost:3000/api/insights<br />
POST http://localhost:3001/api/event<br /> Event


![](./documents/HLD.jpg)
