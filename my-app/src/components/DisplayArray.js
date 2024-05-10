import React from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Grid } from '@mui/material';
import Masonry from '@mui/lab/Masonry';


import SkillCard from './SkillCard';

/**
 * A functional component that renders an array of skills as a masonry grid layout using Material-UI components.
 * Each skill is displayed using the SkillCard component. The layout adapts to different screen sizes with varying column counts.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {Array<Object>} props.skillArray - An array of skill objects to be displayed.
 * @param {boolean} props.edit - Indicates if the edit functionality should be enabled for each skill card.
 * @param {Function} props.deleteSkill - A function to be called when a skill needs to be deleted.
 * @returns {JSX.Element} A masonry grid layout displaying skill cards.
 */
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