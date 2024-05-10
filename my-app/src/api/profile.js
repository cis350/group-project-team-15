import axios from 'axios';
// import  {serverUrl}  from './url';

const config = require('../config.json');
const rootURL = config.SERVER_URL;

/**
 * Retrieves a user's profile from the server based on the user's ID.
 * This function sends a GET request to fetch the profile information of a specified user.
 * It returns an object indicating whether the operation was successful and the retrieved data, if available.
 *
 * @param {string} id - The unique identifier for the user whose profile is being retrieved.
 * @returns {Promise<{success: boolean, data: Object|null}>} A promise that resolves to an object containing a success status and the user's profile data, or null if the operation fails.
 */
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

/**
 * Updates a user's profile information on the server based on the user's ID.
 * This function sends a PUT request with the user's ID and the specific key-value pair to be updated in the user profile.
 * It logs the request URL for debugging purposes and returns an object indicating the success or failure of the update operation.
 *
 * @param {string} id - The unique identifier of the user whose profile is to be updated.
 * @param {string} key - The key corresponding to the attribute of the profile that needs updating.
 * @param {*} value - The new value for the specified key.
 * @returns {Promise<{success: boolean, errorMessage: string}>} A promise that resolves to an object indicating the success or failure of the update operation and contains an error message if applicable.
 */
export const updateProfile = async (id, key, value) => {
    try {
        console.log("TRY" + `${rootURL}/users/${id}`)
        const response = await axios.put(`${rootURL}/users/${id}`, {
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