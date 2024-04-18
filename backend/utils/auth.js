/**
 * This module contains authentication and session functions
 */

// import JWT
const jwt = require("jsonwebtoken");

// import the env variables
require("dotenv").config();

// import DB function
const { getStudentByName, getUser, getUserByEmail } = require("../DbOperations");

/**
 * Create a JWT containing the username
 * @param {*} userid
 * @returns the token
 */

const secret = process.env.KEY;

const authenticateUser = (userid) => {
  try {
    const token = jwt.sign({ username: userid }, secret, { expiresIn: "120s" });
    console.log("token", token);
    return token;
  } catch (err) {
    return console.log("error", err.message);
  }
};

/**
 * Verify a token. Check if the user is valid
 * @param {*} token
 * @returns true if the user is valid
 */
const verifyUser = async (token) => {
  try {
    // decoded contains the payload of the token
    const decoded = jwt.verify(token, secret);
    console.log("payload", decoded);
    // check that the payload contains a valid user
    const user = await getUserByEmail(decoded.username);
    if (!user) {
      return false;
    }
    return user;
  } catch (err) {
    // invalid token
    console.log("error", err.message);
    return false;
  }
};

/**
const main = () =>{
    const token = authenticateUser('cis3500');
    verifyUser(token);
}
main();
*/

module.exports = { authenticateUser, verifyUser };
