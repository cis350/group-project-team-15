import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../resources/logo.png';
import { registerAccount } from '../api/register';

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

  async function registerEvent() {
    const { success, errorMessage } = await registerAccount(emailInput, passwordInput);
    setSuccess(success);
    setErrorMessage(errorMessage);
    if (success) {
      setTimeout(() => navigate('/login'), 3000);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add logic to handle login here
    //console.log('Register account', emailInput, passwordInput);

    if (passwordInput !== confirmPasswordInput) {
      setErrorMessage("Error: passwords must match");
      return;
    }

    registerEvent();
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
              placeholder="Enter email"
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
              placeholder="Enter password"
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
              placeholder="Confirm password"
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
              Register
            </Button>
          </CardActions>
        </Card>
      </Box>
    </>
  );
}

export default Register;
