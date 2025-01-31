import React from "react";
import { Task } from "../App";  // Import Task type

interface TaskOverviewProps {
  tasks: Task[];
  loggedInUser: { username: string; role: "user" | "supervisor"; department: string };
  handleApproveTask: (id: number) => void;
  handleSendForApproval: (id: number) => void;
  handleDeleteTask: (id: number) => void;
}

const TaskOverview: React.FC<TaskOverviewProps> = ({
  tasks,
  loggedInUser,
  handleApproveTask,
  handleSendForApproval,
  handleDeleteTask,
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Task Overview</h2>
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded shadow">
      {["pending", "waiting for approval", "completed"].map((status) => (
        <div key={status}>
          <h3 className="text-lg font-semibold">{status}</h3>
          <div className="grid grid-cols-1 gap-4">
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div key={task.id} className="border p-4 rounded shadow-sm">
                  <p>{task.description}</p>
                  <p className="text-sm text-gray-500">Created by: {task.createdBy}</p>
                  <p className="text-sm text-gray-500">Department: {task.department}</p>
                  <p className="text-sm text-gray-500">
                    Created at: {new Date(task.createdAt).toLocaleString()}
                  </p>
                  {task.status === "pending" && loggedInUser.username === task.createdBy && (
                    <button
                      onClick={() => handleSendForApproval(task.id)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Send for Approval
                    </button>
                  )}
                  {loggedInUser.role === "supervisor" && task.status === "waiting for approval" && (
                    <button
                      onClick={() => handleApproveTask(task.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Approve Task
                    </button>
                  )}
                  {loggedInUser.role === "supervisor" && (
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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

export default TaskOverview;
