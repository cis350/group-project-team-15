import {
  Modal,
  TextField,
  Card,
  Typography,
  Grid,
  Autocomplete,
  Chip,
  Button,
  Snackbar
} from '@mui/material';

import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
import InputAdornment from '@mui/material/InputAdornment';
import { useState } from 'react';

import { updateProfile } from '../api/profile';
import { useAuth } from '../auth/AuthContext';

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

/**
 * A modal component for adding or editing a skill. It provides form inputs for skill name, description, price, and tags.
 * The modal supports validation for required fields and ensures the price is a positive number. It allows for dynamic tag selection from a predefined set.
 * The modal can be closed or submitted, with submission triggering a custom update function passed as a prop.
 *
 * Props:
 * - open: boolean - Controls the visibility of the modal.
 * - setOpen: function - Function to update the open state of the modal.
 * - update: function - Function to call when the form is submitted with valid data, passing the new or updated skill data.
 *
 * @param {object} props - The properties passed to the SkillModal component.
 * @returns {JSX.Element} A modal dialog with a form for adding or editing a skill.
 */
const SkillModal = ({ open, setOpen, update }) => {

  const [data, setData] = useState({
      name: '',
      description: '',
      price: '',
      tags: null
  })
  const [blurred, setBlurred] = useState({
      name: false,
      description: false
  })
  const errors = {
      name: data.name === '' ? 'Required field' : '',
      description: data.description === '' ? 'Required field' : '',
      price: data.price[0] === '-' ? 'Price must be positive' : '',
  }

  return (
      <Modal
          open={open}
      // onClose={}
      >
          <Card sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2"
                  sx={{ marginBottom: 1 }}
              >
                  Add a new skill
              </Typography>
              <form onSubmit={(e) => {
                  e.preventDefault();
                  // console.log(Object.values(errors)) 
                  const numPrice = data?.price !== undefined ? parseFloat(data.price): undefined;
                  if (!Object.values(errors).some(v => !!v)) {
                      data.price = numPrice;
                      update(data);
                      setOpen(false);
                      // updateProfile(email, field, 
                      //     Object.fromEntries(Object.entries(data).filter(([key, value]) => value))
                      // ).catch((err) => console.error(err));
                      // console.log('submit')
                      console.log( )
                  } else {
                      setBlurred({name: true, description: true})
                  }}
              }>
                  <Grid container spacing={2} >
                      <Grid item xs={12}>
                          <TextField
                              label='Name *'
                              error={blurred.name && !!errors.name}
                              helperText={blurred.name && errors.name}
                              variant='outlined'
                              fullWidth
                              onBlur={() => setBlurred(old => ({ ...old, name: true }))}
                              onChange={(e) => setData(old => ({ ...old, name: e.target.value }))}
                              data-testid='name'
                          />
                      </Grid>
                      <Grid item xs={12}>
                          <TextField
                              label='Description *'
                              error={blurred.description && !!errors.description}
                              helperText={blurred.description && errors.description}
                              variant='outlined'
                              fullWidth
                              multiline
                              aria-required
                              minRows={3}
                              maxRows={5}
                              onBlur={() => setBlurred(old => ({ ...old, description: true }))}
                              onChange={(e) => setData(old => ({ ...old, description: e.target.value }))}
                              data-testid='desc'
                          />
                      </Grid>
                      <Grid item xs={12}>
                          <TextField
                              error={data.price[0] === '-'}
                              helperText={data.price[0] === '-' && 'Positive numbers only'}
                              value={data.price}
                              label='Price'
                              variant='outlined'
                              fullWidth
                              type='number'
                              InputProps={{
                                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                              }}
                              onChange={(e) => setData(old => ({ ...old, price: e.target.value }))}
                              data-testid='price'
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
                          />
                      </Grid>
                      {/* First element */}
                      <Grid item xs={6}>
                          {/* Content for the first element */}
                          <Button 
                            variant='outlined'
                            onClick={() => setOpen(false)}
                            data-testid='cancel'
                          >Cancel</Button>
                      </Grid>

                      {/* Second element */}
                      <Grid item xs={6} container justifyContent="flex-end">
                          {/* Content for the second element */}
                          <Button
                              variant='contained'
                              disableElevation
                              type='submit'
                              data-testid='submit'
                          >Add</Button>
                      </Grid>
                  </Grid>
              </form>
          </Card>
      </Modal>
  )
}

const tagPresets = [
  'creative',
  'math',
  'science',
  'history',
  'english',
  'programming',
  'art',
]

export default SkillModal;