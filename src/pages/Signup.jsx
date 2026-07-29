import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api.js";
import { DEPARTMENTS } from "../constants/departments.js";
import Footer from "../components/Footer.jsx";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [matriculationNumber, setMatriculationNumber] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    try {
      setLoading(true);
      const response = await api.post("/auth/signup", {
        name: name,
        email: email,
        password: password,
        department: department,
        matriculationNumber: matriculationNumber,
      });
      toast.success(response.data?.message);
      navigate("/login");
    }  catch (error) {
    const backendErrors = error.response?.data?.errors;
    if (backendErrors && Array.isArray(backendErrors)) {
        setErrors(backendErrors.map((err) => err.message));
    } else {
        setErrors([error.response?.data?.message || "Unable to sign up"]);
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
            Create your account
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Sign up to access your department's materials
          </p>

          {errors.length > 0 && errors.map((error) => (
            <p className="mb-5 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" key={error}>
              {error}
            </p>
          ))}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1C1C1C] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A2647] disabled:bg-gray-100 disabled:text-gray-400"
                required
              />
            </div>

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
                Matriculation Number
              </label>
              <input
                type="text"
                value={matriculationNumber}
                onChange={(e) => setMatriculationNumber(e.target.value)}
                disabled={loading}
                className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A2647] disabled:bg-gray-100 disabled:text-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1C1C1C] mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={loading}
                className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A2647] disabled:bg-gray-100 disabled:text-gray-400 bg-white"
                required
              >
                <option value="">Select your department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
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
              <p className="text-xs text-gray-400 mt-1">
                Must be at least 8 characters, with uppercase, lowercase, a
                number, and a symbol.
              </p>
            </div>

            <div className="border-t-2 border-[#D4A017] pt-5">
              <button
                type="submit"
                disabled={
                  !name ||
                  !email ||
                  !password ||
                  !department ||
                  !matriculationNumber ||
                  loading
                }
                className="w-full flex items-center justify-center gap-2 bg-[#0A2647] text-white py-2 rounded-sm
                                       hover:bg-[#0d3060] transition
                                       disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  "Sign up"
                )}
              </button>
            </div>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
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

export default Signup;
