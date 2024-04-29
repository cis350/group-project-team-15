import { render, screen, waitFor } from '@testing-library/react';

import { AuthProvider } from "../auth/AuthContext";
import { BrowserRouter as Router, MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Marketplace from '../pages/Marketplace';
import Profile from '../pages/Profile';

// Extra Components
import NavBarPage from '../components/NavBar';

// api functions
import { loginCall } from '../api/login';
import { registerAccount } from '../api/register';
import { fetchSearchResults } from '../api/marketplace';
import { getProfile } from '../api/profile';

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

jest.mock('../api/marketplace', () => ({
  fetchSearchResults: jest.fn(),
}));

jest.mock('../api/profile', () => ({
  getProfile: jest.fn(),
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

  it('register success', async() => {
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
    expect(confirmPasswordInput).toHaveValue("p");

    registerAccount.mockResolvedValueOnce({ success: true, errorMessage: ""});

    // Clicking register
    const button = await screen.findByRole("button", { name: "Register" });
    await waitFor(async () => {
      await userEvent.click(button);
    });

    // Asserting success message
    const successMessage = await screen.findByText("Successfully registered. Redirecting to login page.");
    expect(successMessage).toBeInTheDocument();

    // Assert navigation using the mocked useNavigate function
    await waitFor(() => expect(mockUseNavigate).toHaveBeenCalled(), { timeout: 4000 });
    expect(mockUseNavigate).toHaveBeenCalledWith('/login');
  });
});

describe('marketplace tests', () => {
  it('marketplace page search find', async() => {
    render(
      <Router>
        <AuthProvider>
          <Marketplace />
        </AuthProvider>
      </Router>
    );

    // Typing search term
    const input = await screen.findByLabelText("Search skills!");

    fetchSearchResults.mockResolvedValueOnce([
      { _id: "0", email: "geant@seas.upenn.edu", skills: ["guitar"] }
    ]);

    await waitFor(async () => {
      await userEvent.type(input, "guitar");
    });
    expect(input).toHaveValue("guitar");


    // Asserting search results
    const successMessage = await screen.findByText("geant@seas.upenn.edu");
    expect(successMessage).toBeInTheDocument();
  });
});

describe('profile tests', () => {
  it('profile page not logged in + no user', async() => {
    render(
      <MemoryRouter initialEntries={[`/profile/idontexist`]}>
        <AuthProvider>
          <Routes>
            <Route path="/profile/:email" element={<Profile/>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Asserting navigation
    const noUserMessage = await screen.findByText("No user found!");
    expect(noUserMessage).toBeInTheDocument();
  });

  it('profile page not logged in', async() => {
    getProfile.mockResolvedValueOnce({
      success: true, 
      data: {
        email: "bbob",
        skills: ["drawing", "shapes", "bob"]
      }
    });

    render(
      <MemoryRouter initialEntries={[`/profile/bbob`]}>
        <AuthProvider>
          <Routes>
            <Route element={<NavBarPage />}>
              <Route path="/profile/:email" element={<Profile/>} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    
    await waitFor(() => {
      const skillsDisplayed = screen.getByText("drawing");
      expect(skillsDisplayed).toBeInTheDocument();
    });

    // find the login button because the user is not logged in
    const loginButton = await screen.findByRole("button", { name: "Login" });
    expect(loginButton).toBeInTheDocument();

    // this should not work
    const editSkillsButton = screen.queryByRole("button", { name: "Edit Skills" });
    expect(editSkillsButton).not.toBeInTheDocument();
  });
});
