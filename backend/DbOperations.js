// this is a node app, we must use commonJS modules/ require
// the names of the functions come from the operationId field
/**
 * This module implements model queries functions
 * the names of the functions come from the operationId field
 * in the API documentation
 */

// import the mongodb driver
const { MongoClient } = require("mongodb");

// import ObjectID
const { ObjectId } = require("mongodb");

require("dotenv").config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

// the mongodb server URL
const dbURL = `mongodb+srv://${dbUser}:${dbPassword}@cis3500group15.ogicd3s.mongodb.net/?retryWrites=true&w=majority&appName=cis3500group15`;

/**
 * MongoDB database connection
 * It will be exported so we can close the connection
 * after running our tests
 */
let MongoConnection;
// connection to the db
const connect = async () => {
  // always use try/catch to handle any exception
  try {
    MongoConnection = await MongoClient.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }); // we return the entire connection, not just the DB
    // check that we are connected to the db
    console.log(`connected to db: ${MongoConnection.db().databaseName}`);
    return MongoConnection;
  } catch (err) {
    return console.log(err.message);
  }
};

/**
 *
 * @returns the database attached to this MongoDB connection
 */
const getDB = async () => {
  // test if there is an active connection
  if (!MongoConnection) {
    await connect();
  }
  return MongoConnection.db();
};

/**
 *
 * Close the mongodb connection
 */
const closeMongoDBConnection = async () => {
  await MongoConnection.close();
};

/**
 * READ all the users (HTTP GET /users)
 * https://app.swaggerhub.com/apis/ericfouh/usersRoster_App/1.0.0#/users/getusers
 * @returns list/array of all the users enrolled in the course
 */
const getUsers = async () => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection("users").find({}).toArray();
    // print the results
    console.log(`users: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    return console.log(`error: ${err.message}`);
  }
};

/**
 * CREATE a new user (HTTP POST /user)
 * https://app.swaggerhub.com/apis/ericfouh/usersRoster_App/1.0.0#/users/adduser
 * @param {newUser}   the new user object
 * @returns the id of the new user
 */
const addUser = async (newUser) => {
  // get the db
  const db = await getDB();
  console.log("inserting new user");
  const result = await db.collection("users").insertOne(newUser);
  return result.insertedId;

  /**  This is a callback version of a mongodb query
      db.collection('users').insertOne(
        newuser,
        (err, result) => {
          // if there was an error
          if (err) {
            console.log(`error: ${err.message}`);
          }
          // print the id of the user
          console.log(`New user created with id: ${result.insertedId}`);
          // return the result
          return result.insertedId;
        },
      );
      */
};

/**
 * READ a user (HTTP GET /user/:id)
 * https://app.swaggerhub.com/apis/ericfouh/usersRoster_App/1.0.0#/users/getuser
 * @param {userID}  the id of the user
 * @returns the user data
 */
const getUser = async (userID) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userID) });
    // print the result
    console.log(`user: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    return console.log(`error: ${err.message}`);
  }
};

/**
 * READ a user by name
 * @param {email}  the email of the user
 * @returns the user data
 */
const getUserByEmail = async (email) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection("users").findOne({ email: email });
    // print the result
    console.log(`user: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    return console.log(`error: ${err.message}`);
  }
};

// getAuser('641cbbba7307d82e8c2fff67');

/**
 * UPDATE a user (PUT /user/:id)
 * https://app.swaggerhub.com/apis/ericfouh/usersRoster_App/1.0.0#/users/updateuser
 * @param {userID}  the id of the user
 * @param {newInfo} array of key, value pairs to be updated on the user
 * @returns
 */
const updateUser = async (userID, newInfo) => {
  console.log(newInfo);
  const updateObj = {};
  newInfo.forEach((kv) => {
    console.log(kv);
    updateObj[kv.key] = kv.value;
  });
  console.log(updateObj);
  try {
    // get the db
    const db = await getDB();
    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userID) }, { $set: updateObj });
    return result;
  } catch (err) {
    return console.log(`error: ${err.message}`);
  }
};

/**
 * DELETE a user (DELETE /user/:id)
 * https://app.swaggerhub.com/apis/ericfouh/usersRoster_App/1.0.0#/users/deleteuser
 * @param {userID} the id of the user
 * @returns the result/status of the delete operation
 */

const deleteUser = async (userID) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(userID) });
    // print the result
    console.log(`user: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    return console.log(`error: ${err.message}`);
  }
};

// export the functions
module.exports = {
  closeMongoDBConnection,
  getDB,
  connect,
  addUser,
  getUserByEmail,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
