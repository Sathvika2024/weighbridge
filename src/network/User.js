import axios from "axios";
import { API_ENDPOINTS } from "../URLConstants"; // Import the API_ENDPOINTS

export const AdminLogin = async (email, password) => {
        const response = await axios.post(
            API_ENDPOINTS.ADMIN_SIGN_IN, // Use the endpoint from API_ENDPOINTS
            {
                email,
                password,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response;
    
};

export const adminLogOut = async () => {
    try {
        const response = await axios.post(
            API_ENDPOINTS.ADMIN_SIGN_OUT, // Use the endpoint from API_ENDPOINTS
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    // Add Authorization header if needed
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // Replace with the token logic
                },
            }
        );
        console.log("Logout Successful:", response.data);
        return response;
    } catch (error) {
        console.error("Logout Failed:", error?.response?.data || error);
        throw error;
    }
};
