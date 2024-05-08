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

// root endpoint route
webapp.get("/", (req, resp) => {
  resp.json({ message: "hello CIS3500 friends!!! You have dreamy eyes" });
});

// Serve static files from the React frontend app
webapp.use(express.static(path.join(__dirname, '../my-app/build')));



/**
 * Login endpoint
 * The name is used to log in
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
 * Route implementation POST /register
 * to register new user
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
 * route implementation POST /verify
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
 * route implementation GET /students
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
 * route implementation GET /users/:email
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

webapp.get("/skill-search/:skill", async (req, res) => {
  console.log(`search for users with skill: ${req.params.skill}`);
  try {
    const results = await dbLib.searchUsersBySkill(req.params.skill, (x) => true);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ message: `encountered error: ${err}`});
  }
});

webapp.get("/skill-price-filter/:skill/:lowPrice/:highPrice"), async (req, res) => {
    try {
        const filter = (skill) => (
            skill.highPrice >= req.params.lowPrice && skill.lowPrice <= req.params.highPrice
        );
        const results = await dbLib.searchUsersBySkill(req.params.skill, filter);
        res.status(200).json({data: results});
    } catch (err) {
        res.status(500).json({message: `encountered error: ${err}`});
    }
});

webapp.get("/skill-tag-filter/:skill/:tags"), async (req, res) => {
    try {
        const tags = req.params.tags.split('-');
        const filter = (skill) => {
            for(let tag of skill.tags)
                if (tags.includes(tag))
                    return true;
            return false;
        }
        const results = await dbLib.searchUsersBySkill(req.params.skill, filter);
        res.status(200).json({data: results});
    } catch (err) {
        res.status(500).json({message: `encountered error: ${err}`});
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
 * route implementation PUT /student/:email
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
