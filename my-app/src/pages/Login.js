import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import logo from '../resources/logo.png';

import Button from '@mui/material/Button';
import {
  Box, TextField,
  Card,
  CardActions,
  CardContent,
  CardMedia
} from '@mui/material'
import Typography from '@mui/material/Typography';

import { useAuth } from "../auth/AuthContext";

/**
 * A login form component that allows users to authenticate by entering their email and password. 
 * If the user is already logged in, it redirects to the user's profile page. Otherwise, it displays a form
 * for the user to enter their credentials. It uses the `useAuth` hook for authentication logic and `useNavigate`
 * from react-router-dom for navigation.
 *
 * This component handles user inputs for email and password, validates these inputs, and submits them for authentication.
 * If authentication is successful, the user is redirected to their profile page. If not, error messages are displayed.
 *
 * @returns {JSX.Element} The component returns either a redirect to the user's profile if already logged in or a login form for authentication.
 */
function Login() {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { isLoggedIn, email, login, message } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmailInput(value);
    } else if (name === "password") {
      setPasswordInput(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Logging in with", emailInput, passwordInput);

    const res = login({ email: emailInput, password: passwordInput });
    setErrorMessage(res);
  };

  return isLoggedIn ? <Navigate to={`/profile/${email}`} /> : (
    <>
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
              Login
            </Typography>
            <TextField
              error={!!message}
              id="outlined-input"
              label="Email"
              name="email"
              autoComplete="email"
              fullWidth
              placeholder="Enter email"
              value={emailInput}
              onChange={handleInputChange}
              autoFocus
              sx={{ mb: 2 }}
              helperText={errorMessage}
            />
            <TextField
              error={!!message}
              helperText={message}
              id="outlined-password-input"
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              fullWidth
              placeholder="Enter password"
              value={passwordInput}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-between', m: 1, mt: 0 }}>
            <Button size="medium" onClick={() => navigate('/register')}>Create Account</Button>
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

export default Login;
