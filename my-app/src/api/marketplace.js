import axios from 'axios';

const config = require('../config.json');
const rootURL = config.SERVER_URL;

export const fetchSearchResults = async (searchTerm) => {
    try {
        const response = await axios.get(`${rootURL}/${encodeURIComponent(searchTerm)}`);
        return (response.data.data);
    } catch (err) {
        console.error('Failed to fetch search results', err);
        return [];
    }
}