import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { fetchSearchResults } from '../api/marketplace';
import SkillModal from '../components/SkillModal';

const Marketplace = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const querySearch = async () => {
        if (searchTerm.trim()) {
            const response = await fetchSearchResults(searchTerm.trim());
            setSearchResults(response);
        }
    };

    // const handleKeyPress = (e) => {
    //     if (e.key === 'Enter') {
    //         querySearch();
    //     }
    // };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        querySearch();
    };

    return (
        <div className="mx-[15%] mt-[20px]">
            {/* TODO: DELETE */}
            
            {/* END TODO */}
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
                    />
                </div>
                <div className="w-[70%] px-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 w-full" data-cy="search-results" data-testid="search-results">
                        {searchResults.map((user, id) => (
                            <div data-cy={user.email} key={id}>
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