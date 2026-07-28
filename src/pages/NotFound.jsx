import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Footer from "../components/Footer.jsx";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#F7F4EC]">
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#0A2647]/10 flex items-center justify-center mb-6">
                    <Compass className="w-8 h-8 text-[#0A2647]" />
                </div>
                <h1 className="font-serif text-5xl text-[#0A2647] mb-2">404</h1>
                <p className="text-gray-600 max-w-sm mb-8">
                    This page doesn't exist, or you don't have access to it.
                </p>
                <Link
                    to="/login"
                    className="inline-flex items-center justify-center bg-[#0A2647] text-white px-6 py-2.5 rounded-sm hover:bg-[#0d3060] transition text-sm"
                >
                    Back to Sign In
                </Link>
            </div>
            <Footer />
        </div>
    );
};

export default NotFound;