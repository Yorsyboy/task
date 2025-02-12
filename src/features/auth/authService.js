import axios from "axios";

const API_URL = "https://task-backend-hhjo.onrender.com/api/users/";

// Register a new user
export const register = async (userData) => {
    const response = await axios.post(API_URL, userData);

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
};



// Login user
export const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData);

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
};


// Logout user
export const logout = () => {
    localStorage.removeItem("user");
};


// Get all users
export const getAllUsers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};



const authServices = {
    register,
    login,
    logout,
    getAllUsers
};

export default authServices;