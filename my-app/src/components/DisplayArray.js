import React from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Grid } from '@mui/material';

import SkillCard from './SkillCard';

function DisplayArray(props) {
    const skillArray = props.skillArray;
    return (
        <Grid container spacing={2}>
            {skillArray && skillArray.map((skill, id) => 
         <Grid item key={id} xs={12} md={6} lg={4}>
                    <SkillCard edit={props.edit} key={id} index={id} skillObject={skill} deleteSkill={props.deleteSkill}/>
                </Grid>
            )}
        </Grid>
    );
}

export default DisplayArray;