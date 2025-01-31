import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import taskServices from "./taskService";

const initialState = {
    tasks: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

//Create a new task
export const addTask = createAsyncThunk("goals/create", async (taskData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await taskServices.addTask(taskData, token);
    } catch (error) {
        const message = (error.response && error.response.data &&
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
});

// Get all tasks
export const allTasks = createAsyncThunk("tasks/allTasks", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await taskServices.getAllTasks(token);
    } catch (error) {
        const message = (error.response && error.response.data &&
            error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get user tasks
export const userTasks = createAsyncThunk("tasks/userTask", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const userId = thunkAPI.getState().auth.user._id; // Ensure this value exists
        return await taskServices.getTaskbyUser(userId, token);
    } catch (error) {
        const message = (error.response && error.response.data &&
            error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Update a task
export const updateTask = createAsyncThunk("tasks/update", async (taskData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await taskServices.updateTask(taskData, token);
    } catch (error) {
        const message = (error.response && error.response.data &&
            error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete a task
export const deleteTask = createAsyncThunk("tasks/delete", async (taskId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await taskServices.deleteTask(taskId, token);
    } catch (error) {
        const message = (error.response && error.response.data &&
            error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});





export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(addTask.pending, (state) => {
                state.isLoading = true
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.tasks.push(action.payload)
            })
            .addCase(addTask.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(allTasks.pending, (state) => {
                state.isLoading = true
            })
            .addCase(allTasks.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.tasks = action.payload
            })
            .addCase(allTasks.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(userTasks.pending, (state) => {
                state.isLoading = true
            })
            .addCase(userTasks.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.tasks = action.payload
            })
            .addCase(userTasks.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deleteTask.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.tasks = state.tasks.filter(task => task._id !== action.payload.id);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(updateTask.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.tasks = state.tasks.map(task => {
                    if (task._id === action.payload._id) {
                        return action.payload
                    }
                    return task
                })
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
});



export const { reset } = taskSlice.actions;
export default taskSlice.reducer;