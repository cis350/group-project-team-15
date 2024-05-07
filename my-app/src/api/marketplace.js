import axios from 'axios';

export const fetchSearchResults = async (searchTerm) => {
    try {
        const response = await axios.get(`https://group-project-team-15.vercel.app/skill-search/${encodeURIComponent(searchTerm)}`);
        return (response.data.data);
    } catch (err) {
        console.error('Failed to fetch search results', err);
        return [];
    }
}