import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import AddTask from "./components/AddTask";
import Dashboard from "./components/Dashboard";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
// @ts-ignore
import { reset, logout, login } from "./features/auth/authSlice";
import Spinner from "./components/Spinner";
// @ts-ignore
import { allTasks, deleteTask, updateTask } from "./features/task/taskSlice";

export type Task = {
  _id: number;
  description: string;
  status: "pending" | "waiting for approval" | "completed";
  user: number;
  createdBy: number;
  department: string;
  createdAt: string;
  approvedAt?: string;
};

type User = {
  _id: number;
  user: number;
  name: string;
  role: "user" | "supervisor";
  department: string;
};

const App: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authState = useSelector((state: any) => state.auth);
  const alltasks = useSelector((state: any) => state.task.tasks);

  const handleLogin = (): void => {
    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  useEffect(() => {
    if (authState.isError) {
      toast.error(`❌ ${authState.message}`);
    }

    if (authState.isSuccess && authState.user) {
      setLoggedInUser(authState.user);
      localStorage.setItem("loggedInUser", JSON.stringify(authState.user));
      toast.success("Login successful.");
      navigate("/dashboard");
    }
  }, [authState, navigate]);

  useEffect(() => {
    dispatch(allTasks());
  }, [dispatch]);

  const handleLogout = (): void => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
    setLoggedInUser(null);
    setTasks([]);
    toast.success("Logout successful.");
  };

  const handleAddTask = (description: string): void => {
    if (description.trim() && loggedInUser) {
      setTasks([
        ...tasks,
        {
          _id: loggedInUser._id,
          user: loggedInUser.user,
          description,
          status: "pending",
          createdBy: loggedInUser.user,
          department: loggedInUser.department,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleSendForApproval = (id?: number): void => {
    if (!id) {
        toast.error("Task ID is missing.");
        return;
    }

    if (loggedInUser?.role === "user") {
        const taskData = { 
            _id: id, 
            status: "waiting for approval", // ✅ Change to match backend
            createdBy: loggedInUser?._id // ✅ Ensure correct key name
        };

        console.log("Task Data Before Dispatch:", taskData); // Debugging log
        dispatch(updateTask(taskData));
        toast.success("Task sent for approval.");
    } else {
        toast.error("Only users can send tasks for approval.");
    }
};


 
 

const handleApproveTask = (id?: number): void => {
  if (!id) {
      toast.error("Task ID is missing.");
      return;
  }

  if (loggedInUser?.role === "supervisor") {
      const taskData = {
          _id: id,
          status: "approved", // ✅ Change to match backend
          approvedAt: new Date().toISOString(),
      };

      console.log("Task Data Before Dispatch:", taskData); // Debugging log
      dispatch(updateTask(taskData));
      toast.success("Task approved successfully.");
  } else {
      toast.error("Only supervisors can approve tasks.");
  }
};


  const handleDeleteTask = (id: number): void => {
    if (!id) {
      toast.error("❌ Error: Task ID is undefined.");
      return;
  }
    if (loggedInUser?.role === "supervisor") {
      dispatch(deleteTask(id));
      toast.success("Task deleted successfully.");
    } else {
      toast.error("Only supervisors can delete tasks.");
    }
  };

  if (authState.isLoading) {
    return <Spinner />;
  }

  if (!loggedInUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-80">
          <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter username"
            className="w-full p-2 border rounded mb-3 focus:outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter username"
            className="w-full p-2 border rounded mb-3 focus:outline-none"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Task Scheduler</h1>
        <div className="flex justify-between mb-4">
          <p className="text-lg font-semibold">
            {loggedInUser.name} | {loggedInUser.department}
          </p>
          <div className="flex space-x-4">
            <Link
              to="/add-task"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Task
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
        <Routes>
          <Route
            path="/add-task"
            element={<AddTask handleAddTasks={handleAddTask} />}
          />

          <Route
            path="/dashboard"
            element={
              <Dashboard
                alltasks={alltasks}
                loggedInUser={loggedInUser}
                handleApproveTask={handleApproveTask}
                handleSendForApproval={handleSendForApproval}
                handleDeleteTask={handleDeleteTask}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
