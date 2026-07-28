import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import NotFound from "./pages/NotFound.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import ModeratorDashboard from "./pages/ModeratorDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MaterialChat from "./pages/MaterialChat.jsx";
import UploadMaterial from "./pages/UploadMaterial.jsx";
import EditMaterial from "./pages/EditMaterial.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route
        path="/dashboard/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/moderator"
        element={
          <ProtectedRoute allowedRoles={["lecturer", "course-rep"]}>
            <ModeratorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
    path="/upload"
    element={
        <ProtectedRoute allowedRoles={["lecturer", "course-rep", "admin"]}>
            <UploadMaterial />
        </ProtectedRoute>
    }
/>
<Route
    path="/materials/:id/edit"
    element={
        <ProtectedRoute allowedRoles={["lecturer", "course-rep", "admin"]}>
            <EditMaterial />
        </ProtectedRoute>
    }
/>
      <Route path="/materials/:id" element={<MaterialChat />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
