import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
export const ProtectedRoute = () => {
    const {isAuthenticated} = useSelector((state)=>state.auth.user);

    // Check if the user is authenticated
    if (!isAuthenticated) {
        // If not authenticated, redirect to the login page
        return <Navigate to="/signin" />;
    }

    // If authenticated, render the child routes
    return <Outlet />;
};