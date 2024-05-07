import {
    Modal,
    TextField,
    Card,
    Typography,
    Grid,
    Autocomplete,
    Chip,
    Button
} from '@mui/material';

import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
import InputAdornment from '@mui/material/InputAdornment';




const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const SkillModal = () => {
    return (
        <Modal
            open={true}
        // onClose={}
        >
            <Card sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2"
                    sx={{ marginBottom: 1 }}
                >
                    Add a new skill
                </Typography>
                <Grid container spacing={2} >
                    <Grid item xs={12}>
                        <TextField
                            label='Name'
                            variant='outlined'
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Description'
                            variant='outlined'
                            fullWidth
                            multiline
                            minRows={3}
                            maxRows={5}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Price'
                            variant='outlined'
                            fullWidth
                            type='number'
                        />
                    </Grid>
                    {/* <Grid item xs={6}>
                        <TextField
                            label='Available from'
                            variant='outlined'
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label='Available to'
                            variant='outlined'
                            required
                            fullWidth
                        />
                    </Grid> */}
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            id="tags-filled"
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
                        />
                    </Grid>
                    {/* First element */}
                    <Grid item xs={6}>
                        {/* Content for the first element */}
                        <Button variant='outlined'>Cancel</Button>
                    </Grid>

                    {/* Second element */}
                    <Grid item xs={6} container justifyContent="flex-end">
                        {/* Content for the second element */}
                        <Button variant='contained' disableElevation>Add</Button>
                    </Grid>
                </Grid>
            </Card>
        </Modal>
    )
}

const tagPresets = [
    'hi',
    'bye',
    'lol',
    'anthony',
    'hey',
    'go',
    'find'
]

export default SkillModal;