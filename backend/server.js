/**
 * Express webserver / controller
 */

// import express
const express = require("express");
const bcrypt = require("bcrypt");

// import the cors -cross origin resource sharing- module
const cors = require("cors");

// create a new express app
const webapp = express();

// import authentication functions
const { authenticateUser, verifyUser } = require("./utils/auth");
// enable cors
webapp.use(cors());

// Middleware to parse incoming JSON data
webapp.use(express.json());

// configure express to parse request bodies
webapp.use(express.urlencoded({ extended: true }));

// import the db function
const dbLib = require("./DbOperations");

// root endpoint route
webapp.get("/", (req, resp) => {
  resp.json({ message: "hello CIS3500 friends!!! You have dreamy eyes" });
});

/**
 * Login endpoint
 * The name is used to log in
 */
webapp.post("/login", async (req, res) => {
  // check that the name was sent in the body
  if (!req.body.email || !req.body.password) {
    res.status(401).json({ error: `empty or missing name: ${req.body}` });
    return;
  }

  // validate password
  const user = await dbLib.getUserByEmail(req.body.email);
  console.log(user);

  if (!user) {
    res.status(401).json({ error: `failure ${user}` });
    return;
  }

  try {
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      res
        .status(401)
        .json({ error: "authentication failed (incorrect password)" });
      return;
    }
  } catch (err) {
    res.status(401).json({ error: `${err}` });
  }

  // authenticate the user
  try {
    const token = authenticateUser(req.body.email);
    res.status(201).json({ apptoken: token });
  } catch (err) {
    res.status(401).json({ error: "authentication failed" });
  }
});

/**
 * Route implementation POST /register
 * to register new user
 */
webapp.post("/register", async (req, resp) => {
  // parse the body
  console.log(req.body);
  console.log(req.body.email);

  if (!req.body.email || !req.body.password) {
    return resp.status(400).json({ message: `${req.body}` });
  }

  const content = await dbLib.getUserByEmail(req.body.email);

  if (content) {
    return resp.status(400).json({ message: "email already exists" });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // post the data to the db
  try {
    const newUser = {
      email: req.body.email,
      password: hashedPassword,
      skills: [],
      "looking for": []
    };
    console.log(newUser);
    const result = await dbLib.addUser(newUser);
    console.log(result);
    resp.status(201).json({ data: { id: result } });
  } catch (err) {
    resp.status(400).json({ message: "There was an error" });
  }
});

/**
 * route implementation GET /students
 */
webapp.get("/users", async (req, resp) => {
  try {
    // get the data from the DB
    const students = await dbLib.getStudents();
    // send response
    resp.status(200).json({ data: students });
  } catch (err) {
    // send the error code
    resp.status(400).json({ message: "There was an error" });
  }
});

/**
 * route implementation GET /student/:id
 */
webapp.get("/users/:id", async (req, res) => {
  console.log(`find user with id: ${req.params.id}`);
  try {
    // get the data from the db
    const results = await dbLib.getUserByEmail(req.params.id);
    if (results === undefined) {
      res.status(404).json({ error: "unknown student" });
      return;
    }
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: `problem: ${err}` });
  }
});

/**
 * route implementation DELETE /student/:id
 */
webapp.delete("/student/:id", async (req, res) => {
  try {
    const result = await dbLib.deleteStudent(req.params.id);
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "student not in the system" });
      return;
    }
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(400).json({ message: "there was error" });
  }
});

/**
 * route implementation PUT /student/:id
 */
webapp.put("/users/:id", async (req, res) => {
  console.log("UPDATE a student");
  // parse the body of the request
  if (!req.body.info) {
    res.status(404).json({ message: "missing info" });
    return;
  }
  try {
    const result = await dbLib.updateUserByEmail(req.params.id, req.body.info);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: `error: ${err}` });
  }
});

// export the webapp
module.exports = webapp;
