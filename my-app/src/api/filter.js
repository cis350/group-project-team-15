import axios from "axios";

const config = require('../config.json');
const rootURL = config.SERVER_URL;

/**
 * Searches for skills on the server based on provided search criteria.
 * This function sends a POST request to the server's search endpoint with the search parameters.
 *
 * @param {string} query - The query string to search for within the skill descriptions.
 * @param {number} lowPrice - The minimum price of the skills to search for.
 * @param {number} highPrice - The maximum price of the skills to search for.
 * @param {Array<string>} tags - An array of tags to filter the skills.
 * @returns {Promise<Array>} A promise that resolves to an array of skills matching the criteria or an empty array if an error occurs.
 */
export const skillSearch = async (query, lowPrice, highPrice, tags) => {
  try {
    const body = {query, lowPrice, highPrice, tags};
    console.log(body);
    const resp = await axios.post(`${rootURL}/search`, body);
    return resp.data;
  } catch (err) {
    console.log(`skill search error: ${err}`);
    return [];
  }
};
