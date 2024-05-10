import axios from 'axios';
import  {serverUrl}  from './url';

const config = require('../config.json');
const rootURL = config.SERVER_URL;

export const getProfile = async (id) => {
    try {
        const response = await axios.get(`${rootURL}/users/${id}`);
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
        console.log("TRY" + `${serverUrl}/users/${id}`)
        const response = await axios.put(`${serverUrl}/users/${id}`, {
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