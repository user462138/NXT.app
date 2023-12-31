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
PORT=3000<br>
Mongodb_USERNAME=<your_mongodb_username><br>
Mongodb_PASSWORD=<your_mongodb_password><br>
Mongodb_DATABASE=<your_mongodb_database_name><br>
SESSION_SECRET=<your_session_secret><br><br>
3. Run the App: Execute __'ts-node index.ts'__ to start the server.