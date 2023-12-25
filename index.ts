import express from "express";
import { MongoClient } from "mongodb";
import fs from "fs/promises";
import cookieParser from "cookie-parser";
import session from "express-session";
import "dotenv/config";
import { exit } from "process";


const app = express();
app.set("view engine", "ejs");
const port = process.env.PORT
if (!port) {
  console.log("Port is missing")
  exit(1)
}
app.set("port", port);
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));


// storing session in mongodb
const mongodbUsername = process.env.Mongodb_USERNAME;
const mongodbPassword = process.env.Mongodb_PASSWORD;
const mongodbDatabase = process.env.Mongodb_DATABASE;
if (!mongodbUsername || !mongodbPassword || !mongodbDatabase) {
  console.log("something is missing (mongodb)")
  exit(1)
} 
var MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
  uri: `mongodb+srv://${mongodbUsername}:${mongodbPassword}@${mongodbDatabase}.oaon2vd.mongodb.net/WebOntwikkeling?retryWrites=true&w=majority`,
  collection: 'sessions',
});

// setting up session
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  console.log("Session secret is missing")
  exit(1)
}  
app.use(cookieParser());
app.use(session({
  secret: "123",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
  store: store,
}));
declare module 'express-session' {
  export interface SessionData {
    user: User
    posts: Post[]
  }
}

// Mongodb
const uri =
`mongodb+srv://${mongodbUsername}:${mongodbPassword}@${mongodbDatabase}.oaon2vd.mongodb.net/WebOntwikkeling?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

interface User {
  user_id: number;
  username: string;
  emailAddress: string;
  password: string;
  image: string;
  description: string;
  friends: number[];
  posts: number[];
}
interface Post {
  post_id: number;
  user_id: number;
  username: string;
  userImage: string;
  postImage: string;
  postDescription: string;
  postTime : string
}

let users: User[];
let loggedInUser: User;
let posts: Post[] = [];

// getTime
const currentTime: Date = new Date();
const hours: number = currentTime.getHours();
const minutes: number = currentTime.getMinutes();
const seconds: number = currentTime.getSeconds();
const posttime = `${hours}:${minutes}:${seconds}`;

// Read JSON file 
async function readUsersFromFile() {
  try {
    const data = await fs.readFile("users.json", "utf-8");
    const usersFromFile: User[] = JSON.parse(data);
    users = usersFromFile;

    // pushing POSTS for random users (tijdelijk, om te testen)
    let post1 : Post = {
      post_id: 0,
      user_id: users[8].user_id,
      username: users[8].username,
      userImage: users[8].image,
      postImage: "https://picsum.photos/3840/2160?random=1",
      postDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus at libero dapibus, congue dui vitae, iaculis purus. Phasellus quis volutpat ligula. Ut ullamcorper tortor sed scelerisque condimentum. Morbi dapibus enim id enim convallis, quis gravida diam placerat. Vivamus ultricies scelerisque lacus vel condimentum. Suspendisse vitae erat nunc. Duis sed risus in turpis sodales porttitor. Proin sagittis venenatis eros eget laoreet. Cras accumsan lacinia ex sagittis maximus. Curabitur volutpat facilisis enim quis hendrerit. Donec cursus lacus vel magna volutpat, sed convallis sapien accumsan. Curabitur ac tempor sapien, non ultricies risus. Sed volutpat quis metus sed laoreet. Vivamus eget pharetra libero, id scelerisque nisl.",
      postTime: posttime
    }
    let post2 : Post = {
      post_id: 0,
      user_id: users[19].user_id,
      username: users[19].username,
      userImage: users[19].image,
      postImage: "https://picsum.photos/3840/2160?random=2",
      postDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus at libero dapibus, congue dui vitae, iaculis purus. Phasellus quis volutpat ligula. Ut ullamcorper tortor sed scelerisque condimentum. Morbi dapibus enim id enim convallis, quis gravida diam placerat. Vivamus ultricies scelerisque lacus vel condimentum. Suspendisse vitae erat nunc. Duis sed risus in turpis sodales porttitor. Proin sagittis venenatis eros eget laoreet. Cras accumsan lacinia ex sagittis maximus. Curabitur volutpat facilisis enim quis hendrerit. Donec cursus lacus vel magna volutpat, sed convallis sapien accumsan. Curabitur ac tempor sapien, non ultricies risus. Sed volutpat quis metus sed laoreet. Vivamus eget pharetra libero, id scelerisque nisl.",
      postTime: posttime
    }
    posts.push(post1,post2)

  } catch (error) {
    console.error("Error reading or parsing JSON:", error);
  }
}readUsersFromFile();

app.get("/", async (req, res) => {
  if (req.session.user) {
    loggedInUser = req.session.user;
    req.session.save(() => res.redirect("/exploremore"));
  }
  else {
    res.render("login");
  } 
});

app.get("/noaccess", async (req, res) => {
  res.render("noaccess");
});

app.get("/forgetme", async (req, res) => {
  
  /* deleting data in Mongodb */
  const client = new MongoClient(uri);
  try {
    await client.connect();
    await client.db("WebOntwikkeling").collection("users").deleteMany({});
    await client.db("WebOntwikkeling").collection("posts").deleteMany({});
    await client.db("WebOntwikkeling").collection("sessions").deleteMany({});
  } catch (error) {
    console.error(error);
    res.sendStatus(500); 
  } finally {
    await client.close();
  }
  req.session.destroy(() => res.redirect("/"));    
});

app.post("/signup", async (req, res) => {
  res.render("signup",{message:false});
});

app.post("/newuser", async (req, res) => {
  const newUser_username = req.body.username;
  const newUser_emailAddress = req.body.emailAddress;
  const newUser_password = req.body.password;
  const newUser_Image = req.body.image;
  const newUser_description = req.body.description;

  const newUserId = users.reduce((acc, user) => {
    if (user.user_id >= acc) {
      return user.user_id + 1;
    }
    else {
      return acc;
    }
  }, 1);

  let newUser : User = {
    user_id: newUserId,
    username: newUser_username,
    emailAddress: newUser_emailAddress,
    password: newUser_password,
    image: newUser_Image,
    description: newUser_description,
    friends: [],
    posts: []
  }
  if (!users.find(user => user.username == newUser.username)) {
    users.push(newUser);
    // adding user local
    loggedInUser = newUser;
    req.session.user = loggedInUser;
    // adding user in Mongodb
    const client = new MongoClient(uri);
    try {
      await client.connect();
        await client.db("WebOntwikkeling").collection("users").insertOne(newUser);
        req.session.save(() => res.redirect("/exploremore"));
    } catch (error) {
      console.error(error);
    } finally {
      await client.close();
    }
  } else{
    res.render("signup", {message:true} );
  }
});

app.post("/login",async (req, res) => {
  const login_username = req.body.username;
  const login_password = req.body.password;
  if (login_username && login_password) {
    const user = users.find(({ username }) => login_username === username);
    if (user) {
      loggedInUser = user
      if (user.password === login_password) {
        req.session.user = user;
        loggedInUser = req.session.user
        req.session.save(() => res.redirect("/exploremore"));
      }
      else {
        res.sendStatus(403);
      }
    }
    else {
        res.sendStatus(403);
    }
  }
  else {
    res.sendStatus(500);
  }
});

app.post("/logout",async (req, res) => {
  res.redirect("/forgetme")
});

app.get("/exploremore", async (req, res) => {
  if (req.session.user) {
    loggedInUser = req.session.user;
  }
  res.render("index", { users, loggedInUser });
});

app.post("/addFriend", async (req, res) => {
  const addFrindId = parseInt(req.body.addFriend);
  const user = users.find(({ user_id }) => addFrindId === user_id);

  // adding Friend for user (from both side)
  if (user) {
    // A
    loggedInUser.friends.push(user.user_id);
    // B
    user.friends.push(loggedInUser.user_id);

    /* updating data in Mongodb (adding friends) */
    const client = new MongoClient(uri);
    try {
      await client.connect();
        // A
        await client.db("WebOntwikkeling").collection("users").updateOne(
          { user_id: loggedInUser.user_id },
          { $set: { friends: loggedInUser.friends } });
        // B
        await client.db("WebOntwikkeling").collection("users").updateOne(
          { user_id: user.user_id },
          { $set: { friends: user.friends } });
      req.session.user = loggedInUser
      req.session.save(() => res.redirect("/profile/"));
    } catch (error) {
      console.error(error);
      res.sendStatus(500); 
    } finally {
      await client.close();
    }
  }

});

app.post("/deleteFriend", async (req, res) => {
  const deleteFriend = parseInt(req.body.deleteFriend);
  const user = users.find(({ user_id }) => deleteFriend === user_id);

  // deleting Friend for user (from both side)
  if (user) {
    // a
    loggedInUser.friends = loggedInUser.friends.filter(friend => friend !== user.user_id );
    // b
    user.friends = user.friends.filter(friend => friend !== loggedInUser.user_id );

    /* updating data in Mongodb (deleting friends) */
    const client = new MongoClient(uri);
    try {
      await client.connect();
        // A
        await client.db("WebOntwikkeling").collection("users").updateOne(
          { user_id: loggedInUser.user_id },
          { $set: { friends: loggedInUser.friends } });
        // B
        await client.db("WebOntwikkeling").collection("users").updateOne(
          { user_id: user.user_id },
          { $set: { friends: user.friends } });
      req.session.user = loggedInUser
      req.session.save(() => res.redirect("/profile/"));
    } catch (error) {
      console.error(error);
      res.sendStatus(500); 
    } finally {
      await client.close();
    }
  }
});

app.get("/timeline", async (req, res) => {
  if (req.session.posts) {
    posts = req.session.posts;
  }
  if (req.session.user) {
    loggedInUser = req.session.user;
  }
  res.render("timeline", { users, loggedInUser, posts });
});

app.post("/timeline", async (req, res) => {
  const currentTime: Date = new Date();
  const hours: number = currentTime.getHours();
  const minutes: number = currentTime.getMinutes();
  const seconds: number = currentTime.getSeconds();
  const posttime =  `${hours}:${minutes}:${seconds}`;

  const newPostId = posts.reduce((acc, post) => {
    if (post.post_id >= acc) {
      return post.post_id + 1;
    }
    else {
      return acc;
    }
  }, 1);

  // adding Post for loggedInUser 
  const userPost: Post = 
  {post_id: newPostId,
  user_id: loggedInUser.user_id,
  username: loggedInUser.username,
  userImage: loggedInUser.image,
  postImage: req.body.postImage,
  postDescription: req.body.postDescription,
  postTime: posttime}
  posts.push(userPost)
  loggedInUser.posts.push(userPost.post_id)

  /* Pushing/editing data in Mongodb */
  const client = new MongoClient(uri);
  try {
    await client.connect();
    // A
    await client.db("WebOntwikkeling").collection("posts").insertOne(userPost)
    await client.db("WebOntwikkeling").collection("users").updateOne(
    { user_id: loggedInUser.user_id },
    { $set: { posts: loggedInUser.posts } });
    req.session.posts = posts
    req.session.user = loggedInUser
    req.session.save(() => res.redirect("/timeline/"));
  } catch (error) {
    console.error(error);
    res.sendStatus(500); 
  } finally {
    await client.close();
  }
});

app.get("/profile", async (req, res) => {
  if (req.session.posts) {
    posts = req.session.posts;
  }
  if (req.session.user) {
    loggedInUser = req.session.user;
  }
  res.render("profile", { users, loggedInUser, posts });
});

app.post("/editprofile", async (req, res) => {

  // editing loggedInUser data 
  const editImageloggedInUser = req.body.newImage;
  const editDescriptionloggedInUser = req.body.Description;
  loggedInUser.image = editImageloggedInUser;
  loggedInUser.description = editDescriptionloggedInUser

  /* Editing data in Mongodb */
  const client = new MongoClient(uri);
  try {
    await client.connect();
    await client.db("WebOntwikkeling").collection("users").updateOne(
    { user_id: loggedInUser.user_id },
    { $set: { image: loggedInUser.image, description: loggedInUser.description } });
    req.session.user = loggedInUser
    req.session.save(() => res.redirect("/profile/"));
    console.debug(req.session)
  } catch (error) {
    console.error(error);
    res.sendStatus(500); 
  } finally {
    await client.close();
  }
});

app.use((req, res) => {
  res.status(404);
  res.render("notfound")
});

app.listen(app.get("port"), async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    let usersMongdb = await client.db("WebOntwikkeling").collection("users").find<User>({}).toArray();
    if (usersMongdb.length > 0) {
      users = await client.db('WebOntwikkeling')
      .collection('users')
      .find<User>({})
      .toArray();
    }else {
      await client.db("WebOntwikkeling").collection("users").insertMany(users);
    }
    console.log('Connected to database');
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
  console.log("[server] http://localhost:" + app.get("port"))
});