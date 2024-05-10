import React, { useState } from 'react';

import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { fetchSearchResults } from '../api/marketplace';
import SkillModal from '../components/SkillModal';
import SkillCard from "../components/SkillCard";

import FilterBox from '../components/FilterBox';

import Masonry from '@mui/lab/Masonry';

/**
 * The Marketplace component that serves as a platform for users to browse and filter skills available for trade or purchase.
 * It incorporates a filter sidebar using the FilterBox component to specify search criteria and displays search results
 * in a masonry grid layout of SkillCards, each representing a skill available in the marketplace.
 *
 * The component maintains the state of search results which updates dynamically based on the filters applied through the FilterBox.
 * Each SkillCard displays detailed information about a skill and provides a link to the provider's profile.
 *
 * @returns {JSX.Element} A layout with a filterable listing of skills, presenting each skill in a visually appealing masonry grid format.
 */
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
                {/* className="grid grid-cols-2 gap-4 w-full" */}
                    <Masonry columns={{xs: 1, sm: 2}} spacing={2} data-cy="search-results" data-testid="search-results">
                        {searchResults.map((result, id) => (
                            <div key={`m ${id}`} data-cy={result.user}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            <a href={"../profile/" + result.user}>{result.user}</a>
                                        </Typography>
                                        <Typography variant="body2">
                                            <SkillCard skillObject={result.skill} />
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </Masonry>
                </div>
            </div>
        </div >
    )
}

export default Marketplace;