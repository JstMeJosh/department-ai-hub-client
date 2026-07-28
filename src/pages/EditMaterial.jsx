import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, FileText, Upload } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const EditMaterial = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [newFile, setNewFile] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const response = await api.get(`/materials/${id}`);
                setTitle(response.data.material.title);
            } catch (error) {
                toast.error("PDF not found");
                navigate(-1);
            } finally {
                setPageLoading(false);
            }
        };
        fetchApi();
    }, [id]);

    const handleFileChange = (e) => {
        setNewFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        if (newFile !== null) {
            formData.append("file", newFile);
        }

        try {
            setSaving(true);
            const response = await api.patch(`/materials/${id}`, formData);
            toast.success(response.data.message);
            navigate(-1);
        } catch (error) {
            const message = error.response?.data?.error || "Unable to upload materials. Please try again.";
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F7F4EC]">
            <Navbar />

            <main className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm text-[#0A2647] mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                {pageLoading ? (
                    <div className="space-y-5 animate-pulse">
                        <div className="h-7 w-40 bg-gray-200 rounded-sm" />
                        <div className="h-4 w-64 bg-gray-200 rounded-sm" />
                        <div className="h-10 w-full bg-gray-200 rounded-sm mt-6" />
                        <div className="h-10 w-full bg-gray-200 rounded-sm" />
                        <div className="h-10 w-full bg-gray-300 rounded-sm mt-6" />
                    </div>
                ) : (
                    <>
                        <h1 className="font-serif text-2xl text-[#0A2647] mb-1">
                            Edit Material
                        </h1>
                        <p className="text-sm text-gray-500 mb-8">
                            Update the title, or replace the file entirely
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-[#1C1C1C] mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    disabled={saving}
                                    className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A2647] disabled:bg-gray-100"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1C1C1C] mb-1">
                                    Replace File (optional)
                                </label>
                                <label className="flex items-center gap-2 border border-gray-300 rounded-sm px-3 py-2 cursor-pointer hover:border-[#0A2647] transition text-sm text-gray-500">
                                    <Upload className="w-4 h-4" />
                                    {newFile ? newFile.name : "No file selected — current file will be kept"}
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        disabled={saving}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="border-t-2 border-[#D4A017] pt-5">
                                <button
                                    type="submit"
                                    disabled={!title.trim() || saving}
                                    className="w-full flex items-center justify-center gap-2 bg-[#0A2647] text-white py-2.5 rounded-sm
                                               hover:bg-[#0d3060] transition
                                               disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default EditMaterial;