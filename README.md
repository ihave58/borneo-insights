npm install;

- Set the respective .env file for Redis server.

- Open 3 terminals and run the below services independently:

## npm run start:api; (API server listens on http://localhost:3000)<br />
## npm run start:ingestion; (Event ingestion listens on http://localhost:3001)<br />
## npm run start:processor; (EVent processor)<br />

npm run test;<br />

GET http://localhost:3000/api/insights<br />
POST http://localhost:3001/api/event<br /> Event
