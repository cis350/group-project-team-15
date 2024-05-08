import React from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import SkillCard from './SkillCard';

function DisplayArray(props) {
    const skillArray = props.skillArray;
    return (
        <div className="my-3" data-testid={props.testID}>
            {skillArray && skillArray.map((skill, id) => {
                return (
                    <SkillCard key={id} skillObject={skill} />
                );
            })}
        </div>
    );
}

export default DisplayArray;