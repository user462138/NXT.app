# NXT.app

## Web Application with Express.js and MongoDB
This project is a web application built using Express.js and MongoDB. It provides functionalities for user authentication, session management, and data storage.

## Features
User Authentication: Users can sign up, log in, and log out securely.
Session Management: Sessions are stored in MongoDB using express-session and connect-mongodb-session.
User Profiles: Users can view and edit their profiles, including updating their image and description.
Friend Management: Users can add and delete friends, stored persistently in the database.
Post Management: Users can create posts, view timelines, and interact with posts.

## Setup
1. **Install Dependencies:** Run **'npm install'** to install all required packages.
2. **Environment Variables:** Create a **'.env'** file with the following variables:
makefile
Copy code
PORT=3000
Mongodb_USERNAME=<your_mongodb_username>
Mongodb_PASSWORD=<your_mongodb_password>
Mongodb_DATABASE=<your_mongodb_database_name>
SESSION_SECRET=<your_session_secret>
3. Run the App: Execute npm start to start the server.