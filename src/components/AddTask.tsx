import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import { addTask } from "../features/task/taskSlice";
// @ts-ignore
import { getAllUsers } from "../features/auth/authSlice";
import { toast } from "react-toastify";

type AddTaskProps = {
  handleAddTasks: (
    title: string,
    description: string,
    dueDate: string,
    priority: "low" | "medium" | "high",
    progress: number
  ) => void;
};

const AddTask: React.FC<AddTaskProps> = ({}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { users, isLoading, isError, message } = useSelector(
    (state: any) => state.auth
  );
  const authState = useSelector((state: any) => state.auth);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [progress, setProgress] = useState<number>(0);
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [instruction, setInstruction] = useState<string>("");

  useEffect(() => {
    if (!isLoading && users.length === 0) {
      console.log("Fetching users...");
      dispatch(getAllUsers())
        .unwrap()
        .then((data: any) => console.log("Users fetched:", data))
        .catch((error: unknown) =>
          console.error("Error fetching users:", error)
        );
    }
  }, [dispatch, isLoading, users.length]);

  const handleAddTask = (): void => {
    if (!title || !description || !dueDate || !assignedTo) {
      toast.error("Please fill in all fields");
      return;
    }
    const currentDate = new Date();
    const selectedDueDate = new Date(dueDate);

    if (selectedDueDate < currentDate) {
      toast.error("Due date cannot be in the past");
      return;
    }
    
    dispatch(
      addTask({
        title,
        description,
        dueDate,
        priority,
        progress,
        createdBy: authState.user.name,
        department: authState.user.department,
        user: authState.user._id,
        status: "Pending",
        createdAt: new Date().toISOString(),
        assignedTo,
        instruction: instruction,
      })
    );

    toast.success("Task added successfully");
    navigate("/dashboard");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add New Task</h2>
      <div className="mb-4 flex flex-col space-y-2">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter task description"
          className="w-full p-2 border rounded mb-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div>
          <label htmlFor="assignedTo" className="text-sm">
            Assigned To
          </label>
          {isLoading ? (
            <p>Loading users...</p>
          ) : isError ? (
            <p className="text-red-500">{message}</p>
          ) : (
            <select
              id="assignedTo"
              className="w-full p-2 border rounded mb-2"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Select a user</option>
              {users.map((user: any) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label htmlFor="date" className="text-sm">
            Due Date
          </label>
          <input
            type="date"
            id="date"
            className="w-full p-2 border rounded mb-2"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="priority" className="text-sm">
            Priority
          </label>
          <select
            className="w-full p-2 border rounded mb-2"
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "low" | "medium" | "high")
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="instruction" className="text-sm">
            Instructions
          </label>
          <textarea
            className="w-full p-2 border rounded mb-2"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
          />
        </div>

        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default AddTask;
