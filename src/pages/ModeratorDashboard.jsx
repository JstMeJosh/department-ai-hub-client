import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Upload, Loader2, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api.js";
import useAuthStore from "../store/authStore.js";
import Navbar from "../components/Navbar.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import Pagination from "../components/Pagination.jsx";
import Footer from "../components/Footer.jsx";

const ModeratorDashboard = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadCount, setUploadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const user = useAuthStore().user;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/materials?page=${page}&limit=10`);
        setMaterials(response.data.materials);
        setTotalPages(response.data.totalPages);
        const uploadedCount = response.data.materials.filter(
          (material) => material.uploadedBy?._id === user.userId,
        ).length;
        setUploadCount(uploadedCount);
      } catch (error) {
        toast.error(
          "Unable to fetch course materials, refresh the page to try again",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, [page]);

  const handleDeleteClick = (material) => {
    setConfirmingDelete(material);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/materials/${confirmingDelete._id}`);
      setMaterials((prev) =>
        prev.filter((m) => m._id !== confirmingDelete._id),
      );
      setUploadCount((prev) => prev - 1);
      toast.success("Material deleted");
      setConfirmingDelete(null);
    } catch (error) {
      toast.error("Unable to delete material");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EC]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl text-[#0A2647]">
            Department Materials
          </h1>
          <button
            onClick={() => navigate("/upload")}
            className="hidden sm:flex items-center gap-2 bg-[#0A2647] text-white px-4 py-2 rounded-sm hover:bg-[#0d3060] transition text-sm"
          >
            <Upload className="w-4 h-4" />
            Upload Material
          </button>
        </div>

        {/* Stats card */}
        <div className="bg-white rounded-sm shadow-sm p-5 flex items-center gap-4 mb-8 max-w-xs">
          <div className="w-10 h-10 rounded-full bg-[#0A2647]/10 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-[#0A2647]" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-[#0A2647]">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#0A2647]/40" />
              ) : (
                uploadCount
              )}
            </p>
            <p className="text-xs text-gray-500">Materials you've uploaded (this page)</p>
          </div>
        </div>

        {/* Materials list */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-sm shadow-sm p-4 h-28" />
            ))}
          </div>
        )}

        {!loading && materials.length === 0 && (
          <div className="text-center py-16 bg-white rounded-sm shadow-sm">
            <FileText className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              No materials have been uploaded for your department yet.
            </p>
          </div>
        )}

        {!loading && materials.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((material) => {
                const isOwner = material.uploadedBy?._id === user?.userId;

                return (
                  <div
                    key={material._id}
                    onClick={() => navigate(`/materials/${material._id}`)}
                    className="bg-white rounded-sm shadow-sm p-4 cursor-pointer hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm font-medium text-[#1C1C1C] leading-snug">
                          {material.title}
                        </h3>

                        {isOwner && (
                          <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide bg-[#D4A017]/15 text-[#8a6a0f] px-2 py-0.5 rounded-full">
                            Yours
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-400 truncate">
                        {material.fileName}
                      </p>
                      <p className="text-xs text-gray-400">
                        Uploaded by: {material.uploadedBy?.name} ({material.uploadedBy?.role})
                      </p>
                    </div>

                    {isOwner && (
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
                    )}
                  </div>
                );
              })}
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
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

export default ModeratorDashboard;