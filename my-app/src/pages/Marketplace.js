import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { fetchSearchResults } from '../api/marketplace';
import SkillModal from '../components/SkillModal';

import FilterBox from '../components/FilterBox';

const Marketplace = () => {
    const [searchResults, setSearchResults] = useState([]);

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
                    <FilterBox setSearchResults={setSearchResults}/>
                </div>
                <div className="w-[70%] px-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 w-full" data-cy="search-results" data-testid="search-results">
                        {searchResults.map((result, id) => (
                            <div key={`m ${id}`}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            {result.user}
                                        </Typography>
                                        <Typography variant="body2">
                                            {result.skill.name}
                                        </Typography>
                                        
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Marketplace;