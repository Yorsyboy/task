import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addTask } from "../features/task/taskSlice";
import { toast } from "react-toastify";


type AddTaskProps = {

  handleAddTasks: (description: string) => void;

};



const AddTask: React.FC<AddTaskProps> = ({ handleAddTasks }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state: any) => state.auth);
  const [description, setDescription] = useState<string>(""); // State to manage input value

  const handleAddTask = (): void => {
    if (description && authState.user) {
      dispatch(
        addTask({
          description,
          createdBy: authState.user.name,
          department: authState.user.department,
          user: authState.user._id, // Include the user ID
          status: "pending",
          createdAt: new Date().toISOString(),
        })
      );
      toast.success("Task added successfully");
      navigate("/dashboard");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add New Task</h2>
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Enter task description"
          className="flex-grow p-2 border rounded-l focus:outline-none"
          value={description} // Bind input value to state
          onChange={(e) => setDescription(e.target.value)} // Update state on change
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTask(); // Call handleAddTask on Enter key
            }
          }}
        />
        <button
          onClick={handleAddTask} // Call handleAddTask on button click
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default AddTask;