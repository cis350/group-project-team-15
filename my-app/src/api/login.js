import axios from 'axios';

export const loginCall = async (email, password) => {

    try {
        const response = await axios.post("http://localhost:8080/login", {
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