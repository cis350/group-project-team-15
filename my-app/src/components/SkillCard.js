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

export default function SkillCard({ skillObject }) {
    const centsToDollars = (cents) => {
        const dollars = Math.floor(cents / 100);
        const actualCents = cents % 100;
        const centsStr = actualCents < 10 ? `0${actualCents}` : actualCents;
        return `${dollars}.${centsStr}`;
    };
    const priceRangeToString = (low, high) => {
        if (low === undefined && high === undefined) return "No price given";
        if (low === undefined) return `Up to ${centsToDollars(high)}`;
        if (high === undefined) return `${centsToDollars(low)}+`;
        return `$${centsToDollars(low)} - $${centsToDollars(high)}`;
    }
    return (
        <Box sx={{ minWidth: 275, maxWidth: 300 }}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" component="div" sx={{ mb: 0.5 }}>
                        {skillObject.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{ mb: 0.5 }}>
                        {skillObject.description}
                    </Typography>
                    <div className="flex justify-between w-full mt-2 mb-1.4">
                        <Typography variant="body2" fontWeight="bold">
                            Price:
                        </Typography>
                        <Typography variant="body2">
                            {priceRangeToString(skillObject.lowPrice, skillObject.highPrice)}
                        </Typography>
                    </div>
                    <Typography variant="body2" component="div">
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
                </CardContent>
            </Card>
        </Box >
    );
}
