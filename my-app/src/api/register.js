import axios from 'axios';

export const registerAccount = async (emailInput, passwordInput) => {
    try {
        await axios.post('http://localhost:8080/register', {
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