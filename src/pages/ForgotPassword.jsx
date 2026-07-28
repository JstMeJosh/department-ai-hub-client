import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, MailCheck } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api.js";
import Footer from "../components/Footer.jsx";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post("/auth/forgot-password", { email });
            toast.success(response.data?.message);
            setSubmitted(true);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F7F4EC]">
            <div className="flex-1 flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-md bg-white rounded-sm shadow-sm p-8">
                    {submitted ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-[#0A2647]/10 flex items-center justify-center mx-auto mb-5">
                                <MailCheck className="w-8 h-8 text-[#0A2647]" />
                            </div>
                            <h1 className="font-serif text-2xl text-[#0A2647] mb-2">
                                Check your inbox
                            </h1>
                            <p className="text-sm text-gray-500">
                                If that email is registered, a link is on its way.
                            </p>
                            <Link
                                to="/login"
                                className="inline-block mt-6 text-sm text-[#0A2647] font-medium hover:underline"
                            >
                                Back to sign in
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h1 className="font-serif text-2xl text-[#0A2647] text-center mb-1">
                                Forgot Password
                            </h1>
                            <p className="text-sm text-gray-500 text-center mb-8">
                                Enter your email and we'll send you a reset link
                            </p>

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

                                <div className="border-t-2 border-[#D4A017] pt-5">
                                    <button
                                        type="submit"
                                        disabled={!email || loading}
                                        className="w-full flex items-center justify-center gap-2 bg-[#0A2647] text-white py-2 rounded-sm
                                                   hover:bg-[#0d3060] transition
                                                   disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            "Send Reset Link"
                                        )}
                                    </button>
                                </div>
                            </form>

                            <p className="text-sm text-center text-gray-500 mt-6">
                                Remember your password?{" "}
                                <Link to="/login" className="text-[#0A2647] font-medium hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ForgotPassword;