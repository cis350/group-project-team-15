import axios from 'axios';
import { loginCall } from "../api/login";
import { registerAccount } from "../api/register";
import { fetchSearchResults } from "../api/marketplace";
import { getProfile, updateProfile } from "../api/profile";

jest.mock('axios');

describe('loginCall', () => {
    it('should return success true if login successful', async () => {
        const email = "bbob";
        const password = "password";
        
        axios.post.mockResolvedValueOnce({
            data: {
                apptoken: "1234"
            }
        });

        const { success, errorMessage } = await loginCall(email, password);
        expect(success).toBe(true);
        expect(errorMessage).toBe("");
    });

    it('should return success false if login unsuccessful', async () => {
        const email = "bbob";
        const password = "password";
        
        axios.post.mockRejectedValueOnce({
            response: {
                data: {
                    error: "Invalid email or password"
                }
            }
        });

        const { success, errorMessage } = await loginCall(email, password);
        expect(success).toBe(false);
        expect(errorMessage).toBe("Error: Invalid email or password");
    });
});

describe('registerCall', () => {
    it('register success', async () => {
        const email = "i_am_a_new_user";
        const password = "password";

        axios.post.mockResolvedValueOnce({
            data: {
                apptoken: "1234"
            }
        });

        const { success, errorMessage } = await registerAccount(email, password);
        expect(success).toBe(true);
        expect(errorMessage).toBe("");
    });

    it('register fail', async () => {
        const email = "i_am_a_new_user";
        const password = "password";

        axios.post.mockRejectedValueOnce({
            response: {
                data: {
                    error: "User already exists"
                }
            }
        });

        const { success, errorMessage } = await registerAccount(email, password);
        expect(success).toBe(false);
        expect(errorMessage).toBe("Error: User already exists");
    });
});

describe('marketplaceCall', () => {
    it('marketplace success', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                data: ["drawing", "shapes", "bob"]
            }
        });

        const results = await fetchSearchResults("drawing");
        expect(results).toEqual(["drawing", "shapes", "bob"]);
    });

    it('marketplace fail', async () => {
        axios.get.mockRejectedValueOnce({
            response: {
                data: {
                    error: "Failed to fetch search results"
                }
            }
        });

        const results = await fetchSearchResults("drawing");
        expect(results).toEqual([]);
    });
});

describe('profile api', () => {
    it('get profile success', async () => {
        const email = "bbob";
        axios.get.mockResolvedValueOnce({
            data: {
                data: {
                    email: "bbob",
                    skills: ["drawing", "shapes", "bob"]
                }
            }
        });

        const { success, data } = await getProfile(email);
        expect(success).toBe(true);
        expect(data.email).toBe("bbob");
        expect(data.skills).toEqual(["drawing", "shapes", "bob"]);
    });

    it('get profile fail', async () => {
        const email = "bbob";
        axios.get.mockRejectedValueOnce({
            response: {
                data: {
                    error: "Failed to fetch profile"
                }
            }
        });

        const { success, data } = await getProfile(email);
        expect(success).toBe(false);
        expect(data).toBe(null);
    });

    it('update profile success', async () => {
        const email = "bbob";
        const key = "skills";
        const value = ["drawing", "shapes", "bob"];
        axios.put.mockResolvedValueOnce({
            data: {
                success: true
            }
        });

        const { success, errorMessage } = await updateProfile(email, key, value);
        expect(success).toBe(true);
        expect(errorMessage).toBe("");
    });

    it('update profile fail', async () => {
        const email = "bbob";
        const key = "skills";
        const value = ["drawing", "shapes", "bob"];
        axios.put.mockRejectedValueOnce({
            response: {
                data: {
                    error: "Failed to update profile"
                }
            }
        });

        const { success, errorMessage } = await updateProfile(email, key, value);
        expect(success).toBe(false);
        expect(errorMessage).toBe("Error: Failed to update profile");
    });
});