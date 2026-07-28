import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api.js";
import useAuthStore from "../store/authStore.js";
import Footer from "../components/Footer.jsx";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const login = useAuthStore.getState().login;
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            setLoading(true);
            const response = await api.post("/auth/login", { email, password });
            login(response.data?.user, response.data?.token);
            toast.success(response.data?.message);
            const role = response.data.user.role;
            if (role === "student") {
                navigate("/dashboard/student");
            } else if (role === "lecturer" || role === "course-rep") {
                navigate("/dashboard/moderator");
            } else if (role === "admin") {
                navigate("/dashboard/admin");
            }
        } catch (err) {
            const message = err.response?.data?.message || "Unable to log in. Please try again.";
            toast.error(message);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F4EC] px-4 flex-col">
            <div className="w-full max-w-md bg-white rounded-sm shadow-sm p-8">
                <h1 className="font-serif text-2xl text-[#0A2647] text-center mb-1">
                    Departmental AI Revision Hub
                </h1>
                <p className="text-sm text-gray-500 text-center mb-8">
                    Sign in to continue
                </p>

                {error && (
                    <div className="mb-5 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-[#1C1C1C] mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A2647] disabled:bg-gray-100 disabled:text-gray-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#1C1C1C] mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A2647] disabled:bg-gray-100 disabled:text-gray-400"
                            required
                        />
                    </div>

                    <div className="text-right">
                        <Link to="/forgot-password" className="text-[#0A2647] font-medium hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <div className="border-t-2 border-[#D4A017] pt-5">
                        <button
                            type="submit"
                            disabled={!email || !password || loading}
                            className="w-full flex items-center justify-center gap-2 bg-[#0A2647] text-white py-2 rounded-sm
                                       hover:bg-[#0d3060] transition
                                       disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </div>
                </form>

                <p className="text-sm text-center text-gray-500 mt-6">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-[#0A2647] font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
            <Footer/>
        </div>
    );
};

export default Login;