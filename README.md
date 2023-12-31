# NXT.app

## Web Application with Express.js and MongoDB
This project is a web application built using Express.js and MongoDB. It provides functionalities for user authentication, session management, and data storage.

## Features
**User Authentication:** Users can sign up, log in, and log out securely.<br>
**Session Management:** Sessions are stored in MongoDB using express-session and connect-mongodb-session.<br>
**User Profiles:** Users can view and edit their profiles, including updating their image and description.<br>
**Friend Management:** Users can add and delete friends, stored persistently in the database.<br>
**Post Management:** Users can create posts, view timelines, and interact with posts.<br>

## Setup
1. **Install Dependencies:** Run **'npm install'** to install all required packages.
2. **Environment Variables:** Create a **'.env'** file with the following variables:<br><br>

```markdown
PORT=3000
Mongodb_USERNAME=<your_mongodb_username>
Mongodb_PASSWORD=<your_mongodb_password>
Mongodb_DATABASE=<your_mongodb_database_name>
SESSION_SECRET=<your_session_secret>
```

3. Run the App: Execute __'ts-node index.ts'__ to start the server.

## URLs
[NXT.app Website](https://nxt-app.onrender.com)
[NXT.app Repositorie](https://nxt-app.onrender.com)
