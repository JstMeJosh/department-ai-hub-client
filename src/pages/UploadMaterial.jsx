import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, FileText, Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const UploadMaterial = () => {
    const [files, setFiles] = useState([]);
    const [titles, setTitles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);

    const handleAddFile = (e) =>{
        e.preventDefault()
        setIsDragging(false)
        const selectedFiles = Array.from(e.target.files || e.dataTransfer.files)
        setFiles((prev) => [...prev, ...selectedFiles])
        setTitles((prev) => [...prev, ...selectedFiles.map(() => "")]);
        if(e.target){
        e.target.value = "";
        }
    }
    
    const handleTitleChange = (index, value) => {
        setTitles((prev) => {
            const titlesArray = [...prev];
            titlesArray[index] = value;
            return titlesArray;
        });
    };

    const handleRemoveFile = (index) => {
        setFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
        setTitles((prev) => prev.filter((_, titleIndex) => titleIndex !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            toast.error("Please select at least one file to upload");
            return;
        }

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file);
        });
        titles.forEach((title) => {
            formData.append("title", title);
        });

        try {
            setUploading(true);
            await api.post("/materials", formData);
            toast.success(`${files.length} material${files.length > 1 ? "s" : ""} uploaded successfully`);
            navigate("/dashboard/moderator");
        } catch (error) {
            const message = error.response?.data?.error || "Unable to upload materials. Please try again.";
            toast.error(message);
        } finally {
            setUploading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    }


    return (
        <div className="min-h-screen flex flex-col bg-[#F7F4EC]">
            <Navbar />

            <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm text-[#0A2647] mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <h1 className="font-serif text-2xl text-[#0A2647] mb-1">
                    Upload Materials
                </h1>
                <p className="text-sm text-gray-500 mb-8">
                    Add one or more PDF documents for your department
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* File picker */}
                    <div>
                        <label
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleAddFile}
    className={`flex flex-col items-center justify-center gap-2 border-2 rounded-sm py-10 cursor-pointer transition
        ${isDragging
            ? "border-solid border-[#0A2647] bg-[#0A2647]/5"
            : "border-dashed border-gray-300 hover:border-[#0A2647]"
        }`}
>
                            <Upload className="w-6 h-6 text-gray-400" />
                            <span className="text-sm text-gray-500">
                               {isDragging ? "Drop the PDF here." : "Click to select PDF files, or drag and drop" }
                            </span>
                            <input
                                type="file"
                                accept="application/pdf"
                                multiple
                                onChange={handleAddFile}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Selected files with title inputs */}
                    {files.length > 0 && (
                        <div className="space-y-3">
                            {files.map((file, i) => (
                                <div
                                    key={`${file.name}-${i}`}
                                    className="bg-white rounded-sm shadow-sm p-3 flex items-center gap-3"
                                >
                                    <div className="w-9 h-9 shrink-0 rounded-sm bg-[#0A2647]/10 flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-[#0A2647]" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-400 truncate mb-1">
                                            {file.name}
                                        </p>
                                        <input
                                            type="text"
                                            placeholder="Enter a title for this material"
                                            value={titles[i]}
                                            onChange={(e) => handleTitleChange(i, e.target.value)}
                                            disabled={uploading}
                                            required
                                            className="w-full text-sm border border-gray-300 rounded-sm px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0A2647] disabled:bg-gray-100"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile(i)}
                                        disabled={uploading}
                                        className="shrink-0 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="border-t-2 border-[#D4A017] pt-5">
                        <button
                            type="submit"
                            disabled={files.length === 0 || uploading}
                            className="w-full flex items-center justify-center gap-2 bg-[#0A2647] text-white py-2.5 rounded-sm
                                       hover:bg-[#0d3060] transition
                                       disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                "Upload"
                            )}
                        </button>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    );
};

export default UploadMaterial;