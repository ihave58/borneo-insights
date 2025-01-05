**Solution without using stream**
Branch: https://github.com/ihave58/borneo-insights/tree/main

**Solution with stream**
https://github.com/ihave58/borneo-insights/tree/with-streams


npm install;

Set the respective .env file for Redis server.

npm run start; (listens on http://localhost:3000)<br />
npm run cleanup;<br />
npm run test;<br />

GET http://localhost:3000/ Howdy<br />
POST http://localhost:3000/api/event<br />
GET http://localhost:3000/api/insights<br />
