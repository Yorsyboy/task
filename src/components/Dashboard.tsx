import React, { useEffect } from "react";
import { Task } from "../App";
import { useDispatch } from "react-redux";
// @ts-ignore
import { allTasks } from "../features/task/taskSlice";

interface DashboardProps {
  alltasks: Task[];
  loggedInUser: {
    _id: number;
    name: string;
    role: "user" | "supervisor";
    department: string;
  };
  handleApproveTask: (id: number) => void;
  handleSendForApproval: (id: number) => void;
  handleDeleteTask: (id: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  alltasks,
  loggedInUser,
  handleApproveTask,
  handleSendForApproval,
  handleDeleteTask,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allTasks());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded shadow">
        {["pending", "waiting for approval", "approved"].map((status) => (
          <div key={status} className="mb-6">
            <h2 className="text-xl font-semibold mb-4">{status}</h2>
            <div className="space-y-2">
              {alltasks
                ?.filter((task) => task.status === status)
                .map((task) => (
                  <div
                    key={task._id}
                    className={`p-4 rounded shadow ${
                      status === "pending"
                        ? "bg-gray-50"
                        : status === "waiting for approval"
                        ? "bg-yellow-50"
                        : "bg-green-50"
                    }`}
                  >
                    <p className="font-medium">{task.description}</p>
                    <p className="font-light">Department: {task.department}</p>
                    <p className="font-ligh">
                      {" "}
                      Created At: {new Date(task.createdAt).toLocaleString()}
                    </p>
                    {status === "approved" && task.approvedBy && (
                      <p className="text-sm text-gray-500">
                        Approved By: {task.approvedBy.name} | At -{" "}
                        {new Date().toLocaleString()}
                      </p>
                    )}
                    {status === "pending" &&
                      loggedInUser._id === task.createdBy && (
                        <button
                          onClick={() => handleSendForApproval(task._id)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        >
                          Send for Approval
                        </button>
                      )}
                    {loggedInUser.role === "supervisor" &&
                      status === "waiting for approval" && (
                        <button
                          onClick={() => handleApproveTask(task._id)}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                          Approve Task
                        </button>
                      )}
                    {loggedInUser.role === "supervisor" &&
                      task.department === loggedInUser.department && (
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="bg-red-500 text-white px-4 py-2 ml-1 rounded hover:bg-red-600"
                        >
                          Delete Task
                        </button>
                      )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
