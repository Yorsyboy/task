import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import ProtectedRoute from "./components/ProtectedRoute";

export type Task = {
  _id: number;
  description: string;
  status: "Pending" | "Waiting for approval" | "Approved";
  user: number;
  createdBy: {
    _id: number;
    name: string;
  }
  department: string;
  createdAt: string;
  approvedBy?: {
    name: string;
  };
  title: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  progress: number;
  assignedTo: {
    name: string;
  },
  instruction?: string;
  documents?: { public_id: string; url: string }[];
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
    if (!email || !password) {
      toast.error("Email and password cannot be empty.");
      return;
    }

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

      // Redirect based on intended page
      navigate(location.pathname !== "/" ? location.pathname : "/dashboard");

      dispatch(allTasks());
    }
  }, [authState, navigate, dispatch]);

  useEffect(() => {
    dispatch(allTasks());
  }, [dispatch]);

  const handleLogout = (): void => {
    dispatch(logout());
    dispatch(reset());
    localStorage.removeItem("loggedInUser"); // ✅ Explicitly remove from localStorage
    localStorage.removeItem("tasks"); // ✅ Clear stored tasks
    setLoggedInUser(null);
    setTasks([]);
    navigate("/");
    toast.success("Logout successful.");
  };

  useEffect(() => {
    if (loggedInUser) {
      const timer = setTimeout(() => {
        handleLogout();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearTimeout(timer);
    }
  }, [loggedInUser]);

  const handleAddTask = (title: string, description: string, dueDate: string, priority: "low" | "medium" | "high", progress: number): void => {
    if (description.trim() && loggedInUser) {
      setTasks([
        ...tasks,
        {
          _id: loggedInUser._id,
          user: loggedInUser.user,
          title,
          description,
          dueDate,
          priority,
          progress,
          status: "Pending",
          createdBy: { _id: loggedInUser._id, name: loggedInUser.name },
          department: loggedInUser.department,
          createdAt: new Date().toISOString(),
          assignedTo: {
            name: "",
          },
          instruction: "",
        },
      ]);
    } else {
      toast.error("Task description cannot be empty.");
    }
  }

  const handleSendForApproval = (id?: number): void => {
    if (!id) {
      toast.error("Task ID is missing.");
      return;
    }

    if (loggedInUser?.role === "user") {
      const taskData = {
        _id: id,
        status: "Waiting for approval", // ✅ Change to match backend
        createdBy: loggedInUser?._id, // ✅ Ensure correct key name
      };

      dispatch(updateTask(taskData));

      // After the task is updated, refetch the task list
      dispatch(allTasks());

      toast.success("Task sent for approval.");
    } else {
      toast.error("Only Creator/assignee can send tasks for approval.");
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
        status: "Approved",
        approvedAt: new Date().toISOString(),
      };
      dispatch(updateTask(taskData));

      // After the task is updated, refetch the task list
      dispatch(allTasks());

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <img src="/logo.png" alt="Logo" className="mb-6 w-32 mx-auto" />
        <div className="bg-white p-6 rounded shadow-md w-80">
          <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="w-full p-2 border rounded mb-3 focus:outline-none"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-2 border rounded mb-3 focus:outline-none"
            required
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
        <h1 className="text-2xl font-bold mb-4">Task Tracker</h1>
        <div className="flex justify-between mb-4">
          <p className="text-lg font-semibold">
            {loggedInUser.name} | Department: {loggedInUser.department}
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/add-task")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Task
            </button>
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
            element={
              <ProtectedRoute>
                <AddTask handleAddTasks={handleAddTask} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard
                  alltasks={alltasks}
                  loggedInUser={loggedInUser}
                  handleApproveTask={handleApproveTask}
                  handleSendForApproval={handleSendForApproval}
                  handleDeleteTask={handleDeleteTask}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
