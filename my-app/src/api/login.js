import axios from 'axios';

export const loginCall = async (email, password) => {

    try {
        const response = await axios.post("https://group-project-team-15-git-deployment-attempt-2-group-15.vercel.app/login", {
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