import axios from 'axios';
const config = require('../config.json');
const rootURL = config.SERVER_URL;

/**
 * Registers a new user account on the server with an email and password.
 * This function sends a POST request to the server's register endpoint with the user's email and password.
 * It returns an object indicating the success or failure of the registration process along with an appropriate error message if the registration fails.
 *
 * @param {string} emailInput - The email address to register.
 * @param {string} passwordInput - The password for the new account.
 * @returns {Promise<{success: boolean, errorMessage: string}>} A promise that resolves to an object indicating the outcome of the registration attempt, including any error message received in case of failure.
 */
export const registerAccount = async (emailInput, passwordInput) => {
    try {
         await axios.post(`${rootURL}/register`, {
            email: emailInput,
            password: passwordInput
        });

        return {
            success: true,
            errorMessage: ""
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            errorMessage: `Error: ${error.response.data.error}`
        };
    }
};