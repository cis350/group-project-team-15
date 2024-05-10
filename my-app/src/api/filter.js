import axios from "axios";

const config = require('../config.json');
const rootURL = config.SERVER_URL;

export const skillSearch = async (query, lowPrice, highPrice, tags) => {
  try {
    const body = {query, lowPrice, highPrice, tags};
    const resp = await axios.post(`${rootURL}/search`, body);
    return resp.data;
  } catch (err) {
    console.log(`skill search error: ${err}`);
    return [];
  }
};
