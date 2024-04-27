import axios from 'axios';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../resources/logo.png';

import Button from '@mui/material/Button';
import {
  Box, TextField,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Alert,
  Slide,
  IconButton
} from '@mui/material'
import { Close } from '@mui/icons-material'
import Typography from '@mui/material/Typography';

function Register() {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmailInput(value);
    } else if (name === "password") {
      setPasswordInput(value);
    } else if (name === "confirmPassword") {
      setConfirmPasswordInput(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add logic to handle login here
    console.log('Register account', emailInput, passwordInput);

    if (passwordInput !== confirmPasswordInput) {
      setErrorMessage("Error: passwords must match");
      return;
    }

    axios.post('http://localhost:8080/register', {
      email: emailInput,
      password: passwordInput
    }).then((response) => {
      console.log(response);
      setSuccess(true);
      setErrorMessage("");
      // Moves to login page in 3 sec
      setTimeout(() => navigate('/login'), 3000);
    }).catch(error => {
      console.error(error);
      setErrorMessage(`Error: ${error.response.data.error}`);
    });
  };

  return (
    <>
      {
        <Slide direction='left' in={success}>
          <Alert
            sx={{
              position: 'fixed',
              top: 0,
              right: 0,
              m: 4
            }}
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setSuccess(false);
                }}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }>
            Successfully registered. Redirecting to login page.
          </Alert>
        </Slide>
      }
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        component="form"
        onSubmit={handleSubmit}
      >
        <Card sx={{ width: 400, p: 1 }}>
          <CardMedia
            sx={{ width: '100%', aspectRatio: '1/1' }}
            image={logo}
            title="logo"
          />
          <CardContent>
            <Typography sx={{ fontSize: 24, fontWeight: 'bold', pb: 2 }}>
              Register
            </Typography>
            <TextField
              error={!!errorMessage}
              id="outlined-input"
              label="Email"
              name="email"
              autoComplete="email"
              fullWidth
              value={emailInput}
              onChange={handleInputChange}
              autoFocus
              sx={{ mb: 2 }}
            />
            <TextField
              error={!!errorMessage}
              id="outlined-password-input"
              label="Password"
              name="password"
              type="password"
              fullWidth
              value={passwordInput}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              error={!!errorMessage}
              helperText={errorMessage}
              id="outlined-password-input"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              value={confirmPasswordInput}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-between', m: 1, mt: 0 }}>
            <div></div>
            <Button
              type="submit"
              size="medium"
              variant="contained"
              disableElevation
            >
              Login
            </Button>
          </CardActions>
        </Card>
      </Box>
    </>
  );
}

export default Register;
