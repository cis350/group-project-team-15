import axios from 'axios';

const config = require('../config.json');
const rootURL = config.SERVER_URL;

/**
 * Fetches search results from the server based on a given search term.
 * This function sends a GET request to the server, encoding the search term to ensure it's URL-safe.
 * The search results are expected in the response's data property.
 *
 * @param {string} searchTerm - The term to search for on the server.
 * @returns {Promise<Array>} A promise that resolves to an array of search results, or an empty array if an error occurs or no data is found.
 */
export const fetchSearchResults = async (searchTerm) => {
    try {
        const response = await axios.get(`${rootURL}/${encodeURIComponent(searchTerm)}`);
        return (response.data.data);
    } catch (err) {
        console.error('Failed to fetch search results', err);
        return [];
    }
}