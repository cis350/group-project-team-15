import React from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Grid } from '@mui/material';
import Masonry from '@mui/lab/Masonry';


import SkillCard from './SkillCard';

function DisplayArray(props) {
    const skillArray = props.skillArray;
    return (
        <Masonry columns={{xs: 1, md: 2, lg: 3}} spacing={2}>
            {skillArray && skillArray.map((skill, id) => 
                    <SkillCard edit={props.edit} key={id} index={id} skillObject={skill} deleteSkill={props.deleteSkill}/>
            )}
        </Masonry>
    );
}

export default DisplayArray;