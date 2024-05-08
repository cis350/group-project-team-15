// this is a node app, we must use commonJS modules/ require
// the names of the functions come from the operationId field
/**
 * This module implements model queries functions
 * the names of the functions come from the operationId field
 * in the API documentation
 */

const { getDB } = require("../backend/DbConnection");

// import ObjectID
const { ObjectId } = require("mongodb");

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
    //console.log(`user: ${JSON.stringify(result)}`);
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
  console.log(`new obj: ${updateObj}`);
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
 * UPDATE a user (PUT /user/:id)
 * https://app.swaggerhub.com/apis/ericfouh/usersRoster_App/1.0.0#/users/updateuser
 * @param {email}  the email of the user
 * @param {newInfo} array of key, value pairs to be updated on the user
 * @returns
 */
const updateUserByEmail = async (email, newInfo) => {
  const updateObj = {};
  newInfo.forEach((kv) => {
    updateObj[kv.key] = kv.value;
  });
  try {
    // get the db
    const db = await getDB();
    const result = await db
      .collection("users")
      .updateOne({ email: email }, { $set: updateObj });
    return result;
  } catch (err) {
    return console.log(`error: ${err.message}`);
  }
};

const searchUsersBySkill = async (skill, filter) => {
  try {
    // get the db
    const db = await getDB();
    const users = await db.collection("users");
    // functions to check users to see if their skills contain the query string
    const skillStringMatch = (skill, query) => skill.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    const skillObjectMatch = (skill, query) => {
      const skillStr = `${skill.name}, ${skill.description}, ${skill.tags}`;
      return skillStringMatch(skillStr, query);
    };
    const userMatch = (user, query) => {
      for(let skill of user.skills) {
        // the string type case is here until all skills are converted to objects
        if (typeof skill === 'string' && skillStringMatch(skill, query) && filter(skill))
          return true;
        else if (skillObjectMatch(skill, query) && filter(skill)) return true;
      }
      return false;
    };
    // return array of all matching users
    // TODO: strip user objects of sensitive data like passwords
    const result = [];
    const usersArray = await users.find().toArray();
    usersArray.forEach((user) => {
      if (userMatch(user, skill)) result.push(user);
    });
    return result;
  } catch (err) {
    return console.log(`error: ${err.message}`);
  }
};

// /**
//  * DELETE a user (DELETE /user/:id)
//  * https://app.swaggerhub.com/apis/ericfouh/usersRoster_App/1.0.0#/users/deleteuser
//  * @param {userID} the id of the user
//  * @returns the result/status of the delete operation
//  */

// const deleteUser = async (userID) => {
//   try {
//     // get the db
//     const db = await getDB();
//     const result = await db
//       .collection("users")
//       .deleteOne({ _id: new ObjectId(userID) });
//     // print the result
//     console.log(`user: ${JSON.stringify(result)}`);
//     return result;
//   } catch (err) {
//     return console.log(`error: ${err.message}`);
//   }
// };

// export the functions
module.exports = {
  addUser,
  getUserByEmail,
  getUsers,
  getUser,
  updateUser,
  updateUserByEmail,
  searchUsersBySkill
  // deleteUser,
};
