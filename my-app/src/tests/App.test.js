import { render, screen, waitFor } from '@testing-library/react';

import { AuthProvider } from "../auth/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';

// api functions
import { loginCall } from '../api/login';
import { registerAccount } from '../api/register';

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate, // Mock the useNavigate hook
}));

jest.mock('../api/login', () => ({
  loginCall: jest.fn(),
}));

jest.mock('../api/register', () => ({
  registerAccount: jest.fn(),
}));

describe('login tests', () => {
  it("incorrect login", async() => {
    render(
      <Router>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </Router>
    );
  
    // Typing email
    const input = await screen.findByPlaceholderText("Enter email");
    await waitFor(async () => {
      await userEvent.type(input, "bbob");
    });
    expect(input).toHaveValue("bbob");

    // Typing password
    const passwordInput = await screen.findByPlaceholderText("Enter password");
    await waitFor(async () => {
      await userEvent.type(passwordInput, "p");
    });
    expect(passwordInput).toHaveValue("p");

    loginCall.mockResolvedValueOnce({ success: false, errorMessage: "Error: authentication failed (incorrect password)"});

    // Clicking login
    const button = await screen.findByRole("button", { name: "Login" });
    await waitFor(async () => {
      await userEvent.click(button);
    });

    // Asserting error message
    const errorMessage = await screen.findByText("Error: authentication failed (incorrect password)");
    expect(errorMessage).toBeInTheDocument();
  })

  it("correct login", async() => {
    render(
      <Router>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </Router>
    );
  
    // Typing email
    const input = await screen.findByPlaceholderText("Enter email");
    await waitFor(async () => {
      await userEvent.type(input, "bbob");
    });
    expect(input).toHaveValue("bbob");

    // Typing password
    const passwordInput = await screen.findByPlaceholderText("Enter password");
    await waitFor(async () => {
      await userEvent.type(passwordInput, "job");
    });
    expect(passwordInput).toHaveValue("job");

    loginCall.mockResolvedValueOnce({ success: true, errorMessage: ""});

    // Clicking login
    const button = await screen.findByRole("button", { name: "Login" });
    await waitFor(async () => {
      await userEvent.click(button);
    });

    
    await waitFor(() => expect(mockUseNavigate).toHaveBeenCalled());
    // Assert navigation using the mocked useNavigate function
    expect(mockUseNavigate).toHaveBeenCalledWith('/profile/bbob');
  });

  it("route to register from login", async() => {
    render(
      <Router>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </Router>
    );

    // Clicking register
    const registerLink = await screen.findByRole("button", { name: "Create Account" });
    await waitFor(async () => {
      await userEvent.click(registerLink);
    });
  
    // Asserting navigation
    await waitFor(() => expect(mockUseNavigate).toHaveBeenCalled());
    expect(mockUseNavigate).toHaveBeenCalledWith('/register');
  });  
});

describe('register test fail existing email', () => {
  it("register fail", async() => {
    render(
      <Router>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </Router>
    );

    // Typing email
    const input = await screen.findByPlaceholderText("Enter email");
    await waitFor(async () => {
      await userEvent.type(input, "bbob");
    });
    expect(input).toHaveValue("bbob");

    // Typing password
    const passwordInput = await screen.findByPlaceholderText("Enter password");
    await waitFor(async () => {
      await userEvent.type(passwordInput, "p");
    });
    expect(passwordInput).toHaveValue("p");

    // Confirm password
    const confirmPasswordInput = await screen.findByPlaceholderText("Confirm password");
    await waitFor(async () => {
      await userEvent.type(confirmPasswordInput, "p");
    });
    expect(passwordInput).toHaveValue("p");

    registerAccount.mockResolvedValueOnce({ success: false, errorMessage: "Error: email already exists"});

    // Clicking register
    const button = await screen.findByRole("button", { name: "Register" });
    await waitFor(async () => {
      await userEvent.click(button);
    });

    // Asserting error message
    const errorMessage = await screen.findByText("Error: email already exists");
    expect(errorMessage).toBeInTheDocument();
    
  });

  it('register password mismatch', async() => {
    render(
      <Router>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </Router>
    );

    // Typing email
    const input = await screen.findByPlaceholderText("Enter email");
    await waitFor(async () => {
      await userEvent.type(input, "bbob");
    });
    expect(input).toHaveValue("bbob");

    // Typing password
    const passwordInput = await screen.findByPlaceholderText("Enter password");
    await waitFor(async () => {
      await userEvent.type(passwordInput, "p");
    });
    expect(passwordInput).toHaveValue("p");

    // Confirm password
    const confirmPasswordInput = await screen.findByPlaceholderText("Confirm password");
    await waitFor(async () => {
      await userEvent.type(confirmPasswordInput, "pp");
    });
    expect(confirmPasswordInput).toHaveValue("pp");

    // Clicking register
    const button = await screen.findByRole("button", { name: "Register" });
    await waitFor(async () => {
      await userEvent.click(button);
    });

    // Asserting error message
    const errorMessage = await screen.findByText("Error: passwords must match");
    expect(errorMessage).toBeInTheDocument();
  });
});
