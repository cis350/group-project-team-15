import axios from 'axios';

export const registerAccount = async (emailInput, passwordInput) => {
    try {
         await axios.post('https://group-project-team-15-git-deployment-attempt-2-group-15.vercel.app/register', {
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