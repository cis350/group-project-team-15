import { render, screen, waitFor } from '@testing-library/react';

import { AuthProvider } from "../auth/AuthContext";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { fireEvent } from '@testing-library/react';

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
            skills: [{
                name: "burger flipping",
                description: "hamburger",
                price: 1,
                tags: ["art"]
            }]
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
    
        

        // add a skill
        const addSkillButton = await screen.findByTestId("add-skill");
        await waitFor(async () => {
            await userEvent.click(addSkillButton);
        });
        const cancelButton = await screen.findByTestId("cancel");
        await waitFor(async () => {
            await userEvent.click(cancelButton);
        });
        await waitFor(async () => {
            await userEvent.click(addSkillButton);
        });

        // submit the skill
        const submitSkillButton = await screen.findByTestId("submit");
        await waitFor(async () => {
            await userEvent.click(submitSkillButton);
        });

        // check for error message
        //const errorMessage = await screen.find("Required field");
        //expect(errorMessage).toBeInTheDocument();

        // fill in the skill
        const name = (await screen.findByTestId("name")).querySelector('input');
        expect(name).toBeInTheDocument();
        fireEvent.change(name, {target: {value: 'fishing'}});
        expect(name).toHaveValue("fishing");

        const desc = (await screen.findByTestId("desc")).querySelector('textarea');
        expect(desc).toBeInTheDocument();
        fireEvent.change(desc, {target: {value: 'fish'}});
        expect(desc).toHaveValue("fish");

        const price = (await screen.findByTestId("price")).querySelector('input');
        expect(price).toBeInTheDocument();
        fireEvent.change(price, {target: {value: '2'}});
        expect(price).toHaveValue(2);

        updateProfile.mockResolvedValueOnce({
            success: true,
            errorMessage: ""
        });

        // save changes
        await waitFor(async () => {
            await userEvent.click(submitSkillButton);
        });

        // check for new skill
        const newSkill = await screen.findByTestId("1-skill");
        expect(newSkill).toBeInTheDocument();

        // find the logout button because the user is logged in
        const logoutButton = await screen.findByRole("button", { name: "Logout" });
        expect(logoutButton).toBeInTheDocument();
        await waitFor(async () => {
            await userEvent.click(logoutButton);
        });
    });
})

