/*
SkillCard Component:
- name : value: string (req*)
- description : string (req*)
- tags : array of strings??? (opt)
- price: number (opt)

{skill.name && {name}}
{skill.availbility && Start: {.} ? }
*/

import React from 'react';

import Box from '@mui/material/Box';
import Card from "@mui/material/Card";
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Chip from '@mui/material/Chip';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import { Grid } from '@mui/material';


/**
 * Represents a single skill card component that displays information about a skill such as name, description, tags, and price.
 * It also includes an optional delete button to remove the skill from the list if in edit mode.
 *
 * Props:
 * - index: number - The index of the skill in the list (used for unique identification).
 * - skillObject: object - The skill data to display. It must contain the following properties:
 *    - name: string (required) - The name of the skill.
 *    - description: string (required) - A brief description of the skill.
 *    - tags: array of strings (optional) - A list of tags related to the skill.
 *    - price: number (optional) - The price associated with the skill, if any.
 * - deleteSkill: function - A function to call when the delete button is clicked, it should take the skill's index as an argument.
 * - edit: boolean - A flag indicating whether the card is in editable mode which allows for deletion of the skill.
 *
 * @param {object} props - The properties passed to the SkillCard component.
 * @returns {JSX.Element} A styled card component displaying the skill information with an optional delete button.
 */
export default function SkillCard({ index, skillObject, deleteSkill, edit }) {
    return (
        <Box data-testid={index + '-skill'}>
            <Card variant="outlined">



                <CardContent>
                    <Grid container spacing={1} justifyContent='flex-start' alignItems="flex-start">
                        <Grid item xs={10}>
                            <Typography variant="h6" component="div" sx={{ mb: 0.5 }}>
                                {skillObject.name}
                            </Typography>
                        </Grid>
                        {edit && 
                        <Grid item xs={1} alignContent='flex-end'>
                            <IconButton color='error' size='small' onClick={() => { deleteSkill(index)}} aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
}
                    </Grid>

                    <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{ mb: 0.5 }}>
                        {skillObject.description}
                    </Typography>
                    
                        {!!skillObject.price  && <div className="flex justify-between w-full mt-2 mb-1.4">
                            <Typography variant="body2" fontWeight="bold">
                                Price
                            </Typography>
                            <Typography variant="body2">
                                ${Number(skillObject.price).toFixed(2)}
                            </Typography></div>}
                    

                    {skillObject.tags && <><Typography variant="body2" fontWeight='bold' component="div">
                        Tags
                    </Typography>
                        <div className="my-1.5 flex-row space-x-1">
                            {skillObject.tags && skillObject.tags.map((skill, id) => {
                                return (
                                    <Chip
                                        label={skill}
                                        color={'success'}
                                        key={id}
                                    />
                                );
                            })}
                        </div>
                    </>}
                </CardContent>
            </Card>
        </Box >
    );
}