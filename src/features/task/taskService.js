import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks/";

// Create a new task
export const addTask = async (taskData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(API_URL + 'new', taskData, config);

    return response.data;
};

// Get all tasks
export const getAllTasks = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL, config);
    return response.data;
};

// Get task by user
export const getTaskbyUser = async (userId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(`${API_URL}user/${userId}`, config);
    return response.data;
};


// Delete a task
export const deleteTask = async (taskId, token) => {
    console.log("Deleting Task API Call with ID:", taskId);
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.delete(`${API_URL}${taskId}`, config);
    return response.data;
};


const taskServices = {
    addTask,
    getTaskbyUser,
    getAllTasks,
    deleteTask
};

export default taskServices;