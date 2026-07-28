import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck, Menu, X } from "lucide-react";
import useAuthStore from "../store/authStore.js";

const getInitials = (name) => {
    if (!name) return "";
    return name
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
};

const Navbar = () => {
    const user = useAuthStore().user
    const logout = useAuthStore().logout
    const navigate = useNavigate()
    const [drawerOpen, setDrawerOpen] = useState(false)

    const handleLogout = () =>{
        logout()
        navigate("/login")
        setDrawerOpen(false)
    }

    const initials = getInitials(user?.name);

    return (
        <>
            <nav className="w-full bg-[#0A2647] text-white px-4 sm:px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#D4A017]" />
                    <span className="font-serif text-sm sm:text-base">Revision Hub</span>
                </div>

                {/* Desktop: avatar + name/role + logout */}
                <div className="hidden sm:flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#D4A017] text-[#0A2647] flex items-center justify-center font-semibold text-sm">
                        {initials}
                    </div>
                    <div>
                        <p className="text-sm font-medium leading-tight">{user?.name}</p>
                        <p className="text-xs text-white/60 capitalize leading-tight">{user?.role}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="ml-2 flex items-center gap-1.5 text-sm bg-white/10 hover:bg-red-700 transition px-3 py-1.5 rounded-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>

                {/* Mobile: hamburger only */}
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="sm:hidden p-1"
                    aria-label="Open menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </nav>

            {/* Mobile drawer overlay */}
{drawerOpen &&
            <div className="fixed inset-0 z-50 sm:hidden">
                {/* backdrop */}
                <div
                    className="absolute inset-0 bg-black/40"
                    onClick={() => setDrawerOpen(false)}
                />
                {/* drawer panel */}
                <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-6 flex flex-col">
                    <button
                        onClick={() => setDrawerOpen(false)}
                        className="self-end mb-6 text-[#0A2647]"
                        aria-label="Close menu"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-11 h-11 rounded-full bg-[#D4A017] text-[#0A2647] flex items-center justify-center font-semibold">
                            {initials}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[#1C1C1C]"> {user?.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="mt-auto flex items-center justify-center gap-2 text-sm bg-red-700 text-white py-2.5 rounded-sm hover:bg-red-900 transition"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>
}
        </>
    );
};

export default Navbar;