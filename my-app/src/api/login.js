import axios from 'axios';

const config = require('../config.json');

export const loginCall = async (email, password) => {
    try {
        const response = await axios.post(`${config.serverURL}/login`, {
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