import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  MessageCircleQuestion,
  Loader2,
  FileText,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Pagination from "../components/Pagination.jsx";

const StudentDashboard = () => {
  const [materials, setMaterials] = useState([]);
  const [totalMaterials, setTotalMaterials] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApis = async () => {
      try {
        setLoading(true);
        const materialResponse = await api.get(`/materials?page=${page}&limit=10`);
        const logResponse = await api.get("/materials/my-logs");
        setMaterials(materialResponse.data.materials);
        setTotalMaterials(materialResponse.data.total);
        setTotalPages(materialResponse.data.totalPages);
        setLogs(logResponse.data.logs);
      } catch (error) {
        console.error("Failed to fetch materials:", error);
        toast.error("Unable to load your dashboard. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchApis();
  }, [page]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EC]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <h1 className="font-serif text-2xl text-[#0A2647] mb-6">
          Your Materials
        </h1>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-sm shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#0A2647]/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-[#0A2647]" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#0A2647]">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#0A2647]/40" />
                ) : (
                  totalMaterials
                )}
              </p>
              <p className="text-xs text-gray-500">Materials available</p>
            </div>
          </div>

          <div className="bg-white rounded-sm shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#0A2647]/10 flex items-center justify-center shrink-0">
              <MessageCircleQuestion className="w-5 h-5 text-[#0A2647]" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#0A2647]">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#0A2647]/40" />
                ) : (
                  logs.length
                )}
              </p>
              <p className="text-xs text-gray-500">Questions asked</p>
            </div>
          </div>
        </div>

        {/* Materials list */}
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#0A2647]/40" />
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
            <div className="space-y-3">
              {materials.map((material) => (
                <button
                  key={material._id}
                  onClick={() => navigate(`/materials/${material._id}`)}
                  className="w-full bg-white rounded-sm shadow-sm p-4 flex items-center justify-between text-left hover:shadow-md transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 shrink-0 rounded-sm bg-[#0A2647]/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[#0A2647]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1C1C1C] truncate">
                        {material.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {material.fileName}
                      </p>
                      <p className="text-xs text-gray-400 font-bold">
                      Uploaded by: {material.uploadedBy?.name} ({material.uploadedBy?.role})
                    </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#0A2647] transition shrink-0" />
                </button>
              ))}
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default StudentDashboard;