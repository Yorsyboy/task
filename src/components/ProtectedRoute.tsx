import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem("loggedInUser");

  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
