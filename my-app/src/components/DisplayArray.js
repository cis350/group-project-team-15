import React from 'react';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

function DisplayArray(props) {
    const skillArray = props.skillArray;
    return (
        <div className="my-3" data-testid={props.testID}>
            <Stack direction="row" spacing={1}>
                {skillArray && skillArray.map((skill, id) => {
                    return (
                        <Chip 
                            label={skill} 
                            color={'success'}
                            key={id}
                            data-testid={props.testID + "-chip-" + id}
                        />
                    );
                })}
            </Stack>
        </div>
    );
}

export default DisplayArray;