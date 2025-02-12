import axios from "axios";

const API_URL = "https://task-backend-hhjo.onrender.com/api/tasks/";

// Create a new task
export const addTask = async (taskData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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

// Update a task
export const updateTask = async (taskData, token) => {

    if (taskData.status === 'pending' && (!taskData || !taskData._id || !taskData.createdBy)) {
        throw new Error("Invalid task data. 'createdBy' field is required for approval.");
    }

    const config = {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    };

    try {
        const response = await axios.put(`${API_URL}${taskData._id}`, taskData, config);
        return response.data;
    } catch (error) {
        console.error("Update Task Error:", error.response?.data || error.message);
        throw error;
    }
};



 


// Delete a task
export const deleteTask = async (taskId, token) => {
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
    deleteTask,
    updateTask
};

export default taskServices;