import { render, screen, waitFor } from '@testing-library/react';

import { AuthProvider } from "../auth/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from '../pages/Login';
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom"; // Import useNavigate from the mocked module

// api functions
import { loginCall } from '../api/login';

import { act } from "react-dom/test-utils";

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate, // Mock the useNavigate hook
}));

jest.mock('../api/login', () => ({
  loginCall: jest.fn(),
}));

describe('renders learn react link', () => {
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
