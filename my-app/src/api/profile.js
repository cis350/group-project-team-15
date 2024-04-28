import axios from 'axios';

export const getProfile = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8080/users/${id}`);
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
        const response = await axios.put(`http://localhost:8080/users/${id}`, {
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