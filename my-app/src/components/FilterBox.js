import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

import tagPresets from '../utils/tag-preset';
import { skillSearch } from '../api/filter';

// filter box returns the users with the skills
function valuetext(value) {
    return `$${value}`;
}

const marks = [
    {
        value: 100,
        label: '100+'
    }
];


export default function FilterBox({ setSearchResults }) {
    const [data, setData] = useState({
        name: '',
        description: '',
        tags: undefined
    })

    const [value, setValue] = useState([0, 100]);
    const sliderChange = (event, newValue) => {
        setValue(newValue);
    };

    async function submitFilter(e) {
        e.preventDefault();

        //console.log(value[1] === 100);

        const query = {
            name: data.name,
            tags: data.tags,
            low_price: (value[0] === 0 ? undefined : value[0]),
            high_price: (value[1] === 100 ? undefined : value[1])
        }

        console.log(query);
        const response = await skillSearch(query.name, query.low_price, query.high_price, query.tags);
        console.log(response);

        if (!response || !response.data) {
            setSearchResults([]);
            return;
        }

        const results = response.data.map((info) => {
            const skill = info.skill;
            const user = info.user;
            const email = info.user.email;

            return {
                skill: skill,
                user: email,
                link: `/profile/${user.email}`
            };
        });

        console.log(results);
        setSearchResults(results);
    }

    return (
        <div className="flex flex-col">
            <Grid container spacing={2} >
                <Grid item xs={12}>
                    <TextField
                        label='Skill'
                        variant='outlined'
                        fullWidth
                        data-cy='search'
                        onChange={(e) => setData(old => ({ ...old, name: e.target.value }))}
                        data-testid='Skill'
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography id="input-slider" gutterBottom>
                        Price
                    </Typography>
                    <Slider
                        getAriaLabel={() => 'Price range'}
                        value={value}
                        onChange={sliderChange}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        marks={marks}
                        data-cy='slider'
                        data-testid='slider'
                    />
                </Grid>
                <Grid item xs={12}> 
                    <Autocomplete
                        multiple
                        id="tags-filled"
                        onChange={(_, val) => setData(old => ({ ...old, tags: val }))}
                        options={tagPresets.map((option) => option)}
                        freeSolo
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip variant="filled" label={option} {...getTagProps({ index })} />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Tags"
                            />
                        )}
                        data-cy="tags"
                        data-testid="tags"
                    />
                </Grid>
                {/* First element */}
                <Grid item xs={6}>
                    {/* Content for the first element */}
                </Grid>

                {/* Second element */}
                <Grid item xs={6} container justifyContent="flex-end">
                    {/* Content for the second element */}
                    <Button
                        variant='contained'
                        disableElevation
                        type='submit'
                        onClick={submitFilter}
                        data-cy="filter"
                        data-testid="filter"
                    >Filter</Button>
                </Grid>
            </Grid>
        </div>
    )
}
