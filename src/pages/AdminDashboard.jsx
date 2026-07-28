import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, FileText, MessageCircleQuestion, Loader2, Pencil, Check, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api.js";
import { DEPARTMENTS } from "../constants/departments.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Pagination from "../components/Pagination.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

const AdminDashboard = () => {
    const navigate = useNavigate();

    // Overview stats
    const [totalMaterials, setTotalMaterials] = useState(0);
    const [totalLogs, setTotalLogs] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [studentCount, setStudentCount] = useState(0);
    const [lecturerCount, setLecturerCount] = useState(0);
    const [adminCount, setAdminCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    // Materials tab
    const [materials, setMaterials] = useState([]);
    const [materialsPage, setMaterialsPage] = useState(1);
    const [materialsTotalPages, setMaterialsTotalPages] = useState(1);
    const [confirmingDelete, setConfirmingDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Logs tab
    const [logs, setLogs] = useState([]);
    const [logsPage, setLogsPage] = useState(1);
    const [logsTotalPages, setLogsTotalPages] = useState(1);

    // Users tab
    const [users, setUsers] = useState([]);
    const [usersPage, setUsersPage] = useState(1);
    const [usersTotalPages, setUsersTotalPages] = useState(1);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editRole, setEditRole] = useState("");
    const [editDepartment, setEditDepartment] = useState("");
    const [savingUser, setSavingUser] = useState(false);

    // Overview stats: fetched once, using page=1 responses just for their `total` fields
    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const [materialsRes, logsRes, usersRes] = await Promise.all([
                    api.get("/materials?page=1&limit=1"),
                    api.get("/admin/logs?page=1&limit=1"),
                    api.get("/admin/users?page=1&limit=1"),
                ]);
                setTotalMaterials(materialsRes.data.total);
                setTotalLogs(logsRes.data.total);
                setTotalUsers(usersRes.data.total);
                setStudentCount(usersRes.data.studentCount);
                setLecturerCount(usersRes.data.lecturerCount);
                setAdminCount(usersRes.data.adminCount);
            } catch (error) {
                toast.error("Error fetching overview stats");
            } finally {
                setLoading(false);
            }
        };
        fetchOverview();
    }, []);

    // Materials tab data
    useEffect(() => {
        if (activeTab !== "materials") return;
        const fetchMaterials = async () => {
            try {
                const response = await api.get(`/materials?page=${materialsPage}&limit=10`);
                setMaterials(response.data.materials);
                setMaterialsTotalPages(response.data.totalPages);
            } catch (error) {
                toast.error("Unable to load materials");
            }
        };
        fetchMaterials();
    }, [activeTab, materialsPage]);

    // Logs tab data
    useEffect(() => {
        if (activeTab !== "logs") return;
        const fetchLogs = async () => {
            try {
                const response = await api.get(`/admin/logs?page=${logsPage}&limit=10`);
                setLogs(response.data.logs);
                setLogsTotalPages(response.data.totalPages);
            } catch (error) {
                toast.error("Unable to load logs");
            }
        };
        fetchLogs();
    }, [activeTab, logsPage]);

    // Users tab data
    useEffect(() => {
        if (activeTab !== "users") return;
        const fetchUsers = async () => {
            try {
                const response = await api.get(`/admin/users?page=${usersPage}&limit=10`);
                setUsers(response.data.users);
                setUsersTotalPages(response.data.totalPages);
            } catch (error) {
                toast.error("Unable to load users");
            }
        };
        fetchUsers();
    }, [activeTab, usersPage]);

    // Materials handlers
    const handleDeleteClick = (material) => setConfirmingDelete(material);

    const handleConfirmDelete = async () => {
        try {
            setDeleting(true);
            await api.delete(`/materials/${confirmingDelete._id}`);
            setMaterials((prev) => prev.filter((m) => m._id !== confirmingDelete._id));
            setTotalMaterials((prev) => prev - 1);
            toast.success("Material deleted");
            setConfirmingDelete(null);
        } catch (error) {
            toast.error("Unable to delete material");
        } finally {
            setDeleting(false);
        }
    };

    // Users handlers
    const handleStartEdit = (user) => {
        setEditingUserId(user._id);
        setEditRole(user.role);
        setEditDepartment(user.department);
    };

    const handleCancelEdit = () => setEditingUserId(null);

    const handleSaveUser = async (userId) => {
        try {
            setSavingUser(true);
            await api.patch(`/admin/users/${userId}`, { role: editRole, department: editDepartment });
            setUsers((prev) =>
                prev.map((u) => (u._id === userId ? { ...u, role: editRole, department: editDepartment } : u))
            );
            toast.success("User updated");
            setEditingUserId(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to update user");
        } finally {
            setSavingUser(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F7F4EC]">
            <Navbar />
            <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
                <h1 className="font-serif text-2xl text-[#0A2647] mb-6">
                    Admin Dashboard
                </h1>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
                    {["overview", "materials", "logs", "users"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition whitespace-nowrap
                                ${activeTab === tab
                                    ? "border-[#0A2647] text-[#0A2647]"
                                    : "border-transparent text-gray-500 hover:text-[#0A2647]"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-6 h-6 animate-spin text-[#0A2647]/40" />
                    </div>
                ) : (
                    <>
                        {activeTab === "overview" && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="bg-white rounded-sm shadow-sm p-5">
                                    <div className="w-9 h-9 rounded-full bg-[#0A2647]/10 flex items-center justify-center mb-3">
                                        <Users className="w-4 h-4 text-[#0A2647]" />
                                    </div>
                                    <p className="text-2xl font-semibold text-[#0A2647]">{totalUsers}</p>
                                    <p className="text-xs text-gray-500">Total Users</p>
                                </div>
                                <div className="bg-white rounded-sm shadow-sm p-5">
                                    <div className="w-9 h-9 rounded-full bg-[#0A2647]/10 flex items-center justify-center mb-3">
                                        <FileText className="w-4 h-4 text-[#0A2647]" />
                                    </div>
                                    <p className="text-2xl font-semibold text-[#0A2647]">{totalMaterials}</p>
                                    <p className="text-xs text-gray-500">Total Materials</p>
                                </div>
                                <div className="bg-white rounded-sm shadow-sm p-5">
                                    <div className="w-9 h-9 rounded-full bg-[#0A2647]/10 flex items-center justify-center mb-3">
                                        <MessageCircleQuestion className="w-4 h-4 text-[#0A2647]" />
                                    </div>
                                    <p className="text-2xl font-semibold text-[#0A2647]">{totalLogs}</p>
                                    <p className="text-xs text-gray-500">Total Queries</p>
                                </div>
                                <div className="bg-white rounded-sm shadow-sm p-5">
                                    <p className="text-xs text-gray-500 mb-2">By Role</p>
                                    <div className="space-y-1 text-xs text-gray-700">
                                        <div className="flex justify-between">
                                            <span>Students</span>
                                            <span className="font-medium">{studentCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Lecturers</span>
                                            <span className="font-medium">{lecturerCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Admins</span>
                                            <span className="font-medium">{adminCount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "materials" && (
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                    {materials.map((material) => (
                                        <div
                                            key={material._id}
                                            onClick={() => navigate(`/materials/${material._id}`)}
                                            className="bg-white rounded-sm shadow-sm p-4 cursor-pointer hover:shadow-md transition flex flex-col justify-between"
                                        >
                                            <div>
                                                <h3 className="text-sm font-medium text-[#1C1C1C] leading-snug mb-1">
                                                    {material.title}
                                                </h3>
                                                <p className="text-xs text-gray-400 truncate">{material.fileName}</p>
                                            </div>

                                            <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-gray-100">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/materials/${material._id}/edit`);
                                                    }}
                                                    className="p-1.5 text-gray-500 hover:text-[#0A2647] hover:bg-gray-100 rounded-sm transition"
                                                    title="Edit Material"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClick(material);
                                                    }}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-sm transition"
                                                    title="Delete Material"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Pagination
                                    currentPage={materialsPage}
                                    totalPages={materialsTotalPages}
                                    onPageChange={setMaterialsPage}
                                />
                            </div>
                        )}

                        {activeTab === "logs" && (
                            <div>
                                <div className="bg-white rounded-sm shadow-sm overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
                                                <th className="px-4 py-3 font-medium">Student</th>
                                                <th className="px-4 py-3 font-medium">Material</th>
                                                <th className="px-4 py-3 font-medium">Question</th>
                                                <th className="px-4 py-3 font-medium hidden sm:table-cell">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logs.map((log) => (
                                                <tr key={log._id} className="border-b border-gray-50 last:border-0">
                                                    <td className="px-4 py-3 text-[#1C1C1C]">{log.user?.name || "—"}</td>
                                                    <td className="px-4 py-3 text-gray-600">{log.material?.title || "—"}</td>
                                                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{log.question}</td>
                                                    <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                                                        {new Date(log.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination
                                    currentPage={logsPage}
                                    totalPages={logsTotalPages}
                                    onPageChange={setLogsPage}
                                />
                            </div>
                        )}

                        {activeTab === "users" && (
                            <div>
                                <div className="bg-white rounded-sm shadow-sm overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wide">
                                                <th className="px-4 py-3 font-medium">Name</th>
                                                <th className="px-4 py-3 font-medium hidden sm:table-cell">Email</th>
                                                <th className="px-4 py-3 font-medium">Role</th>
                                                <th className="px-4 py-3 font-medium hidden md:table-cell">Department</th>
                                                <th className="px-4 py-3 font-medium text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => {
                                                const isEditing = editingUserId === user._id;
                                                return (
                                                    <tr key={user._id} className="border-b border-gray-50 last:border-0">
                                                        <td className="px-4 py-3 text-[#1C1C1C]">{user.name}</td>
                                                        <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{user.email}</td>
                                                        <td className="px-4 py-3">
                                                            {isEditing ? (
                                                                <select
                                                                    value={editRole}
                                                                    onChange={(e) => setEditRole(e.target.value)}
                                                                    disabled={savingUser}
                                                                    className="border border-gray-300 rounded-sm px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#0A2647]"
                                                                >
                                                                    <option value="student">student</option>
                                                                    <option value="course-rep">course-rep</option>
                                                                    <option value="lecturer">lecturer</option>
                                                                    <option value="admin">admin</option>
                                                                </select>
                                                            ) : (
                                                                <span className="capitalize text-gray-700">{user.role}</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 hidden md:table-cell">
                                                            {isEditing ? (
                                                                <select
                                                                    value={editDepartment}
                                                                    onChange={(e) => setEditDepartment(e.target.value)}
                                                                    disabled={savingUser}
                                                                    className="border border-gray-300 rounded-sm px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#0A2647]"
                                                                >
                                                                    {DEPARTMENTS.map((dept) => (
                                                                        <option key={dept} value={dept}>{dept}</option>
                                                                    ))}
                                                                </select>
                                                            ) : (
                                                                <span className="text-gray-500 text-xs">{user.department}</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            {isEditing ? (
                                                                <div className="flex items-center justify-end gap-1">
                                                                    <button
                                                                        onClick={() => handleSaveUser(user._id)}
                                                                        disabled={savingUser}
                                                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-sm transition"
                                                                        title="Save"
                                                                    >
                                                                        <Check className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={handleCancelEdit}
                                                                        disabled={savingUser}
                                                                        className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-sm transition"
                                                                        title="Cancel"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleStartEdit(user)}
                                                                    className="p-1.5 text-gray-500 hover:text-[#0A2647] hover:bg-gray-100 rounded-sm transition"
                                                                    title="Edit"
                                                                >
                                                                    <Pencil className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination
                                    currentPage={usersPage}
                                    totalPages={usersTotalPages}
                                    onPageChange={setUsersPage}
                                />
                            </div>
                        )}
                    </>
                )}
            </main>

            {confirmingDelete && (
                <ConfirmDialog
                    title="Delete Material"
                    message={`Are you sure you want to delete "${confirmingDelete.title}"? This cannot be undone.`}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setConfirmingDelete(null)}
                    loading={deleting}
                />
            )}

            <Footer />
        </div>
    );
};

export default AdminDashboard;