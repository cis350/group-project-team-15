import axios from 'axios';

const config = require('../config.json');

export const fetchSearchResults = async (searchTerm) => {
    try {
        const response = await axios.get(`${config.serverURL}/skill-search/${encodeURIComponent(searchTerm)}`);
        return (response.data.data);
    } catch (err) {
        console.error('Failed to fetch search results', err);
        return [];
    }
}