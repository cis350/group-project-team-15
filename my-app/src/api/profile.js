import axios from 'axios';
const config = require('../config.json');

export const getProfile = async (id) => {
    try {
        const response = await axios.get(`https://skillshare-server-bay.vercel.app/users/${id}`);
        const data = response.data.data;
        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            data: null
        };
    }
};

export const updateProfile = async (id, key, value) => {
    try {
        const response = await axios.put(`${config.serverURL}/users/${id}`, {
            id: id,
            info: [
                {
                    key: key,
                    value: value,
                },
            ],
        });
        console.log(response);
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