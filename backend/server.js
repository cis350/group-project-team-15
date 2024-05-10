/**
 * Express webserver / controller
 */

// import express
const express = require("express");
const bcrypt = require("bcrypt");
const path = require('path');

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

/**
 * Root GET endpoint that provides a welcome message.
 * @param {Request} req - The HTTP request object.
 * @param {Response} resp - The HTTP response object.
 */
webapp.get("/", (req, resp) => {
  resp.json({ message: "hello CIS3500 friends!!! You have dreamy eyes" });
});

// Serve static files from the React frontend app
webapp.use(express.static(path.join(__dirname, '../my-app/build')));



/**
 * POST endpoint for user login. Validates user credentials and returns an authentication token.
 * @param {Request} req - The HTTP request object containing email and password in the body.
 * @param {Response} res - The HTTP response object.
 */
webapp.post("/login", async (req, res) => {
  // check that the name was sent in the body
  if (!req.body.email || !req.body.password) {
    // trust me bro
    const v =
      !req.body.email && !req.body.password
        ? "email and password"
        : !req.body.email
        ? "email"
        : "password";
    res.status(400).json({ error: `empty or missing ${v}` });
    return;
  }

  // validate password
  const user = await dbLib.getUserByEmail(req.body.email);

  if (!user) {
    res.status(404).json({ error: `email does not exist: ${req.body.email}` });
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
    res.status(200).json({ apptoken: token });
  } catch (err) {
    res.status(401).json({ error: "authentication failed" });
  }
});

/**
 * POST endpoint to register a new user. Validates input and creates a new user if valid.
 * @param {Request} req - The HTTP request object containing user details.
 * @param {Response} resp - The HTTP response object.
 */
webapp.post("/register", async (req, resp) => {
  if (!req.body.email || !req.body.password) {
    const v =
      !req.body.email && !req.body.password
        ? "email and password"
        : !req.body.email
        ? "email"
        : "password";
    resp.status(400).json({ error: `empty or missing ${v}` });
    return;
  }

  const content = await dbLib.getUserByEmail(req.body.email);
  if (content) {
    resp.status(409).json({ error: "email already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // post the data to the db
  try {
    const newUser = {
      email: req.body.email,
      password: hashedPassword,
      skills: [],
      "looking for": [],
    };
    console.log(newUser);
    const result = await dbLib.addUser(newUser);
    console.log(result);
    resp.status(201).json({ data: { id: result } });
  } catch (err) {
    resp.status(400).json({ error: "There was an error" });
  }
});

/**
 * POST endpoint to verify user authentication tokens.
 * @param {Request} req - The HTTP request object containing the authentication token.
 * @param {Response} res - The HTTP response object.
 */
webapp.post("/verify", async (req, res) => {
  // check that the token was sent in the body
  if (!req.body.token) {
    res.status(400).json({ error: "missing token" });
    return;
  }

  // verify the token
  try {
    console.log("verifying token", req.body);
    const user = await verifyUser(req.body.token);
    if (!user) {
      res.status(401).json({ error: "no user in token" });
      return;
    }
    console.log("user", user);
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(401).json({ error: "authentication failed" });
  }
});

/**
 * GET endpoint to retrieve all users.
 * @param {Request} req - The HTTP request object.
 * @param {Response} resp - The HTTP response object.
 */
webapp.get("/users", async (req, resp) => {
  try {
    // get the data from the DB
    const users = await dbLib.getUsers();
    // send response
    resp.status(200).json({ data: users });
  } catch (err) {
    // send the error code
    resp.status(400).json({ message: "There was an error" });
  }
});

/**
 * GET endpoint to retrieve user details by email.
 * @param {Request} req - The HTTP request object containing user's email as a URL parameter.
 * @param {Response} res - The HTTP response object.
 */
webapp.get("/users/:email", async (req, res) => {
  console.log(`find user with id: ${req.params.email}`);
  try {
    // get the data from the db
    const results = await dbLib.getUserByEmail(req.params.email);
    if (results === null) {
      res.status(404).json({ error: "unknown user" });
      return;
    }
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: `problem: ${err}` });
  }
});

/**
 * POST endpoint to search for users based on various parameters.
 * @param {Request} req - The HTTP request object containing search parameters in the body.
 * @param {Response} res - The HTTP response object.
 */
webapp.post("/search/", async (req, res) => {
  try {
    // get search parameters
    const query = req.body.query;
    const lowPrice = req.body.lowPrice;
    const highPrice = req.body.highPrice;
    const tags = req.body.tags;
    console.log(`search params: ${query};${lowPrice}-${highPrice};${tags}`);
    // function to check if skill contains query string
    const queryFilter = (skill) => {
      // no query: contains it vacuously
      if (query === undefined) return true;
      // check if query is in skill string or relevant fields
      const skillStringMatch = (skill, query) => skill.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      const skillObjectMatch = (skill, query) => {
        const skillStr = `${skill.name}, ${skill.description}, ${skill.tags}`;
        return skillStringMatch(skillStr, query);
      };
      // check the skill
      if (typeof skill === 'string') return skillStringMatch(skill, query);
      return skillObjectMatch(skill, query);
    };
    // function to check if the skill price is in the range [lowPrice, highPrice]
    const priceFilter = (skill) => {
      // no price parameters: not out of range
      if (lowPrice === undefined && highPrice === undefined) return true;
      // if skill is using old string system, it has no price
      if (typeof skill === 'string') return false;
      if (skill.price === undefined) return false;
      // check if price is in range
      if (lowPrice && skill.price < lowPrice) return false;
      if (highPrice && skill.price > highPrice) return false;
      return true;
    };
    // function to check if the skill includes any of the tags
    const tagFilter = (skill) => {
      // if no tags given, it contains them all vacuously
      if (tags === undefined) return true;
      console.log("tags not undefined");
      // handle old string system
      if (typeof skill === 'string') return false;
      // get tags as lowercase strings
      const skillTags = skill.tags.map((tag) => tag.toLowerCase());
      // if any of the user tags are a match, the skill is a match
      for(let tag of tags)
        if (skillTags.includes(tag.toLowerCase())) return true;
      return false;
    };
    // skills should pass all filters to match
    const filter = (skill) => queryFilter(skill) && priceFilter(skill) && tagFilter(skill);
    // query database
    const results = await dbLib.searchUsers(filter);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ message: `encountered error: ${err}`});
  }
});

// /**
//  * route implementation DELETE /student/:id
//  */
// webapp.delete("/student/:id", async (req, res) => {
//   try {
//     const result = await dbLib.deleteStudent(req.params.id);
//     if (result.deletedCount === 0) {
//       res.status(404).json({ error: "student not in the system" });
//       return;
//     }
//     // send the response with the appropriate status code
//     res.status(200).json({ message: result });
//   } catch (err) {
//     res.status(400).json({ message: "there was error" });
//   }
// });

/**
 * PUT endpoint to update user details by email.
 * @param {Request} req - The HTTP request object containing user's email as a URL parameter and update information in the body.
 * @param {Response} res - The HTTP response object.
 */
webapp.put("/users/:email", async (req, res) => {
  console.log(`UPDATE a student with`);
  console.log(req.body);
  // parse the body of the request
  if (!req.body.info) {
    res.status(400).json({ message: "missing info" });
    return;
  }
  try {
    const result = await dbLib.updateUserByEmail(
      req.params.email,
      req.body.info
    );
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: `error: ${err}` });
  }
});

// export the webapp
module.exports = webapp;
