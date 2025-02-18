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
        {["Pending", "Waiting for approval", "Approved"].map((status) => (
          <div key={status} className="mb-6">
            <h2 className="text-xl font-semibold mb-4">{status}</h2>
            <div className="space-y-2">
              {alltasks
                ?.filter((task) => task.status === status)
                .map((task) => (
                  <div
                    key={task._id}
                    className={`px-2 py-4 rounded shadow ${
                      status === "Pending"
                        ? "bg-gray-50"
                        : status === "Waiting for approval"
                        ? "bg-yellow-50"
                        : "bg-green-50"
                    }`}
                  >
                    <p className="font-medium">
                      Title: <span className="font-light">{task.title}</span>
                    </p>
                    <p className="font-medium">
                      Description:{" "}
                      <span className="font-light">{task.description}</span>
                    </p>
                    <p className="font-medium">
                      Designation:{" "}
                      <span className="font-light">{task.department}</span>
                    </p>
                    <p className="font-medium">
                      Due Date:{" "}
                      <span className="font-light">
                        {new Date(task.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                    <p className="font-medium">
                      Priority:{" "}
                      <span
                        className={`font-light ${
                          task.priority === "low"
                            ? "text-green-500"
                            : task.priority === "medium"
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </p>
                    {/* <p className="font-light">Progress: {task.progress}% </p> */}
                    <p className="font-medium">
                      Created At:{" "}
                      <span className="font-light">
                        {new Date(task.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                    <p className="font-medium">
                      Assigned To:{" "}
                      <span className="font-light">
                        {task.assignedTo?.name || "Not Assigned"}
                      </span>
                    </p>
                    {task.instruction && (
                      <p className="font-medium">
                        Instructions:{" "}
                        <span className="font-light">{task.instruction}</span>
                      </p>
                    )}
                    <p className="font-medium">
                      Created By:{" "}
                      <span className="font-light">{task.createdBy.name}</span>
                    </p>
                    <p className="font-medium">
                      Documents:{" "}
                      <span className="font-light">
                        {task.documents?.length
                          ? task.documents.map((doc, index) => (
                              <a
                                key={index}
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                              >
                                Document {index + 1}
                              </a>
                            ))
                          : "No Documents"}
                      </span>
                    </p>

                    {status === "Approved" && task.approvedBy && (
                      <p className="text-sm text-gray-500">
                        Approved By: {task.approvedBy.name} <br></br> | At -{" "}
                        {new Date().toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    )}
                    {status === "Pending" &&
                      (loggedInUser._id === task.createdBy._id ||
                        loggedInUser._id === task.assignedTo._id) && (
                        <button
                          onClick={() => handleSendForApproval(task._id)}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                          Send for Approval
                        </button>
                      )}
                    {loggedInUser.role === "supervisor" &&
                      status === "Waiting for approval" && (
                        <button
                          onClick={() => handleApproveTask(task._id)}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                          Approve Task
                        </button>
                      )}
                    {loggedInUser.role === "supervisor" && (
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
