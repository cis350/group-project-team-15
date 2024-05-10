import axios from 'axios';
const config = require('../config.json');
const rootURL = config.SERVER_URL;

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