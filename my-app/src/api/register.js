import axios from 'axios';
const config = require('../config.json');

export const registerAccount = async (emailInput, passwordInput) => {
    try {
         await axios.post(`${config.serverURL}/register`, {
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