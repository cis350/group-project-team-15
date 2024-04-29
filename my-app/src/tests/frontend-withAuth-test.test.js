import { render, screen, waitFor } from '@testing-library/react';

import { AuthProvider } from "../auth/AuthContext";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import Profile from '../pages/Profile';
import NavBarPage from '../components/NavBar';

import { getProfile, updateProfile } from '../api/profile';

jest.mock('../api/profile', () => ({
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
}));

jest.mock('../auth/AuthContext', () => ({
    ...jest.requireActual('../auth/AuthContext'),
    useAuth: () => ({
      isLoggedIn: true,
      email: 'bbob',
      login: jest.fn(),
      logout: jest.fn(),
      message: '',
    }),
}));

describe('Profile page logged in', () => {
    it('motherload test', async () => {
        getProfile.mockResolvedValueOnce({
            success: true, 
            data: {
            email: "bbob",
            skills: ["drawing", "shapes", "bob"]
            }
        });

        const loggedInContextValue = {
            isLoggedIn: true,
            email: 'bbob',
            login: jest.fn(),
            logout: jest.fn(),
            message: '',
        };

        render(
            <MemoryRouter initialEntries={[`/profile/bbob`]}>
            <AuthProvider value={loggedInContextValue}>
                <Routes>
                <Route element={<NavBarPage />}>
                    <Route path="/profile/:email" element={<Profile/>} />
                </Route>
                </Routes>
            </AuthProvider>
            </MemoryRouter>
        );
    
        // find the logout button because the user is logged in
        const logoutButton = await screen.findByRole("button", { name: "Logout" });
        expect(logoutButton).toBeInTheDocument();
        
        // find the edit skills button because the user is the owner
        const editSkillsButton = await screen.findByTestId("update-skills");
        expect(editSkillsButton).toBeInTheDocument();
        
        // click on the edit skills button
        await waitFor(async () => {
            await userEvent.click(editSkillsButton);
        });
    
        // more stuff should display ig
        const saveChangesButton = await screen.findByRole("button", { name: "Save changes" });
        expect(saveChangesButton).toBeInTheDocument();

        // add a skill
        const addSkillButton = await screen.findByTestId("update-skills-add");
        await waitFor(async () => {
            await userEvent.click(addSkillButton);
        });

        // save changes but it should fail
        await waitFor(async () => {
            await userEvent.click(saveChangesButton);
        });

        // check for error message
        const errorMessage = await screen.findByText("Please fill in all the fields");
        expect(errorMessage).toBeInTheDocument();

        // fill in the skill
        const skillInput = await screen.findByTestId("update-skills-skill-3");
        await waitFor(async () => {
            await userEvent.type(skillInput, "new skill");
        })
        expect(skillInput).toHaveValue("new skill");

        updateProfile.mockResolvedValueOnce({
            success: true,
            errorMessage: ""
        });

        // save changes
        await waitFor(async () => {
            await userEvent.click(saveChangesButton);
        });
        

        // check for new skill
        const newSkill = await screen.findByTestId("has-skills-chip-3");
        expect(newSkill).toBeInTheDocument();
    });
})

