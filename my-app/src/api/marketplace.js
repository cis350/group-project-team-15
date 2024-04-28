import axios from 'axios';

export const fetchSearchResults = async (searchTerm) => {
    try {
        const response = await axios.get(`http://localhost:8080/skill-search/${encodeURIComponent(searchTerm)}`);
        return (response.data.data);
    } catch (err) {
        console.error('Failed to fetch search results', err);
        return [];
    }
}