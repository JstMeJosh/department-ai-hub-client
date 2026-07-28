import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api.js";
import Footer from "../components/Footer.jsx";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    if (password !== confirmPassword) {
      return setErrors(["Passwords do not match"]);
    }
    try {
      setLoading(true);
      const response = await api.post(`/auth/reset-password/${token}`, {
        password,
      });
      toast.success(response.data?.message);
      navigate("/login");
    } catch (error) {
      const backendErrors = error.response?.data?.errors;
      if (backendErrors && Array.isArray(backendErrors)) {
        setErrors(backendErrors.map((err) => err.message));
      } else {
        setErrors([
          error.response?.data?.message || "Unable to update password",
        ]);
      }
      toast.error("Please fix the errors below");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EC]">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-sm shadow-sm p-8">
          <h1 className="font-serif text-2xl text-[#0A2647] text-center mb-1">
            Reset Password
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Choose a new password for your account
          </p>

          {errors.length > 0 &&
            errors.map((error) => (
              <p
                className="mb-5 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                key={error}
              >
                {error}
              </p>
            ))}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1C1C1C] mb-1">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A2647] disabled:bg-gray-100 disabled:text-gray-400"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Must be at least 8 characters, with uppercase, lowercase, a
                number, and a symbol.
              </p>
              <label className="block text-sm font-medium text-[#1C1C1C] mb-1">
                Re-enter Your New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A2647] disabled:bg-gray-100 disabled:text-gray-400"
                required
              />
            </div>

            <div className="border-t-2 border-[#D4A017] pt-5">
              <button
                type="submit"
                disabled={!password || !confirmPassword || loading}
                className="w-full flex items-center justify-center gap-2 bg-[#0A2647] text-white py-2 rounded-sm
                                       hover:bg-[#0d3060] transition
                                       disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating Password
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
          <p className="text-sm text-center text-gray-500 mt-6">
            Remembered your Password?{" "}
            <Link
              to="/login"
              className="text-[#0A2647] font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
