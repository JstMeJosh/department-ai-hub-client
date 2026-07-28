import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore.js";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);

    if (!token) {
        return <Navigate to="/login" replace />;
    }
    const getDashboardPath = (role) => {
    if (role === "student") return "/dashboard/student";
    if (role === "lecturer" || role === "course-rep") return "/dashboard/moderator";
    if (role === "admin") return "/dashboard/admin";
}
if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getDashboardPath(user?.role)} replace />;
}
   

    return children;
};

export default ProtectedRoute;