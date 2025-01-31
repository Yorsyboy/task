// import React from "react";
// import { Task } from "../App";

// const TaskList: React.FC<{
//   tasks: Task[];
//   handleApproveTask?: (id: number) => void;
//   handleSendForApproval?: (id: number) => void;
//   handleDeleteTask?: (id: number) => void;
// }> = ({ tasks, handleApproveTask, handleSendForApproval, handleDeleteTask }) => (
//   <div className="space-y-4">
//     {tasks.map((task) => (
//       <div key={task.id} className="p-4 border rounded bg-gray-50">
//         <h3 className="font-bold text-lg">{task.description}</h3>
//         <p className="text-gray-500">
//           Status: <span className="font-semibold">{task.status}</span>
//         </p>
//         <p className="text-gray-500">Created At: {task.createdAt}</p>
//         {task.approvedAt && (
//           <p className="text-gray-500">Approved At: {task.approvedAt}</p>
//         )}
//         {handleSendForApproval && task.status === "pending" && (
//           <button
//             onClick={() => handleSendForApproval(task.id)}
//             className="bg-yellow-500 text-white px-3 py-1 rounded mt-2"
//           >
//             Send for Approval
//           </button>
//         )}
//         {handleApproveTask && task.status === "waiting for approval" && (
//           <button
//             onClick={() => handleApproveTask(task.id)}
//             className="bg-green-500 text-white px-3 py-1 rounded mt-2"
//           >
//             Approve Task
//           </button>
//         )}
//         {handleDeleteTask && (
//           <button
//             onClick={() => handleDeleteTask(task.id)}
//             className="bg-red-500 text-white px-3 py-1 rounded mt-2"
//           >
//             Delete Task
//           </button>
//         )}
//       </div>
//     ))}
//   </div>
// );

// export default TaskList;
