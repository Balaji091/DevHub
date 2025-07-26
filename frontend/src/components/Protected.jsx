// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("jwtToken");
  

  if (!token) {
    // Redirect to auth page if token doesn't exist
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
