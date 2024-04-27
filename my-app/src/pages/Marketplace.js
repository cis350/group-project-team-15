import React, { useState } from 'react';
import axios from 'axios';

import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Marketplace = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const fetchSearchResults = async () => {
        if (searchTerm.trim()) {
            try {
                const response = await axios.get(`http://localhost:8080/skill-search/${encodeURIComponent(searchTerm.trim())}`);
                setSearchResults(response.data.data || []);
            } catch (err) {
                console.error('Failed to fetch search results', err);
                setSearchResults([]);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchSearchResults();
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        fetchSearchResults();
    };

    /*
    <div key={user._id} className="search-result-item">
        {user.email} - Skills: {user.skills.join(", ")}
    </div>
    */


    return (
        <div className="mx-[15%] mt-[20px]">
            <div className="flex w-full gap-[10px]">
                <div className="outline outline-slate-400 outline-1 w-[30%] p-4 rounded-lg">
                    <h1 className="text-2xl">Marketplace</h1>
                    <div className="py-2">
                        Find some skills!
                    </div>
                    <TextField
                        id="filled-search"
                        label="Search skills!"
                        type="search"
                        variant="filled"
                        data-cy="marketplace-search"

                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={handleKeyPress}
                    />
                </div>
                <div className="w-[70%] px-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 w-full" data-cy="search-results">
                        {searchResults.map((user) => (
                            <div data-cy={user.email}>
                                <Box>
                                    <Card variant="outlined">
                                        <React.Fragment>
                                            <CardContent>
                                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    {user.email}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Skills: {user.skills.join(", ")}
                                                </Typography>
                                            </CardContent>
                                        </React.Fragment>
                                    </Card>
                                </Box>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Marketplace;