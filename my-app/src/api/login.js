import axios from 'axios';

const config = require('../config.json');
const rootURL = config.SERVER_URL;

/**
 * Attempts to log in a user by sending their credentials to the server.
 * This function posts the user's email and password to the server's login endpoint.
 * If the login is successful, it stores the authentication token and user's email in localStorage.
 *
 * @param {string} email - The email address of the user attempting to log in.
 * @param {string} password - The password of the user.
 * @returns {Promise<{success: boolean, errorMessage: string}>} A promise that resolves to an object indicating the success or failure of the login attempt and an error message if applicable.
 */
export const loginCall = async (email, password) => {
    try {
        
        const response = await axios.post(`${rootURL}/login`, {
            email: email,
            password: password
        });

        localStorage.setItem('appToken', response.data.apptoken);
        localStorage.setItem('email', email);

        console.log("login call success");

        return {
            success: true,
            errorMessage: ""
        };
    } catch (error) {
        return {
            success: false,
            errorMessage: `Error: ${error.response.data.error}`
        };
    }
}