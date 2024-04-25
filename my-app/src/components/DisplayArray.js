import React, { useState } from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

function DisplayArray(props) {
    const skillArray = props.skillArray;
    return (
        <div className="my-3">
            <Stack direction="row" spacing={1}>
                {skillArray.length !== 0 && skillArray.map((skill) => {
                    return (
                        <Chip 
                            label={skill} 
                            color={'success'}
                        />
                    );
                })}
            </Stack>
        </div>
    );
}

export default DisplayArray;