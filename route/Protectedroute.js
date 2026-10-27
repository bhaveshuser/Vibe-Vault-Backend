import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// Returns true if the JWT is missing, malformed or past its "exp" time
const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(
            atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        if (!payload.exp) return false;
        return payload.exp * 1000 < Date.now();
    } catch (error) {
        return true;
    }
};

const ProtectedRoute = ({ children }) => {
    const location = useLocation();

    const token = localStorage.getItem("token");
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!token || !loggedInUser || isTokenExpired(token)) {
        // clear stale data so the rest of the app sees a logged-out user
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");

        // "from" lets Login send the user back to the page they wanted
        return <Navigate to="/Login" replace state={{ from: location.pathname }} />;
    }

    return children;
};

export default ProtectedRoute;