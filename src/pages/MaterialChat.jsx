import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, Loader2, ArrowLeft, FileText, Activity } from "lucide-react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import api from "../services/api.js";
import Navbar from "../components/Navbar.jsx";

const MaterialChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [thread, setThread] = useState([]);
  const [question, setQuestion] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [asking, setAsking] = useState(false);
  

  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchApis = async () => {
      try {
        const materialResponse = await api.get(`/materials/${id}`);
        const logResponse = await api.get("/materials/my-logs");

        setMaterial(materialResponse.data.material);
      
        const filteredLogs = logResponse.data.logs.filter(
          (log) => log?.material === id,
        );

        const mappedThread = filteredLogs.map((log) => ({
          question: log.question,
          answer: log.response,
        }));

        setThread(mappedThread);
      } catch (error) {
        toast.error(
          "Unable to load this material. It may not be available to you.",
        );
        navigate(-1);
      } finally {
        setPageLoading(false);
      }
    };

    fetchApis();
  }, [id, navigate]);

  const handleAsk = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      toast.error("Cannot send an empty message");
      setQuestion("");
      return;
    }

    try {
      setQuestion("");
      setThread((prev) => [...prev, { question, answer: null }]);
      setAsking(true);

      const response = await api.post("/materials/query", {
        materialId: id,
        question,
      });

      setThread((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          answer: response.data.message,
        };
        return updated;
      });
    } catch (error) {
      toast.error("Unable to send message. Refresh this page and try again");
    } finally {
      setAsking(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  return (
    <div className="h-screen flex flex-col bg-[#F7F4EC]">
      <Navbar />

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 sm:px-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 py-4 border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="text-[#0A2647] cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 shrink-0 rounded-sm bg-[#0A2647]/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-[#0A2647]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#1C1C1C] truncate">
              {material?.title}
            </p>
            <p className="text-xs text-gray-400">
              Ask the AI tutor about this material
            </p>
          </div>
        </div>

        {/* Conversation thread */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {pageLoading && (
            <div className="space-y-4 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-end">
                    <div className="bg-gray-200 rounded-2xl rounded-br-none h-8 w-2/3 max-w-[80%]" />
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-100 border border-gray-200 rounded-2xl rounded-bl-none h-16 w-3/4 max-w-[80%]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!pageLoading && thread.length === 0 && (
            <div className="empty-state text-center text-gray-500 py-8">
              <p>Ask your first question about this material</p>
            </div>
          )}

          {/* Chat Thread */}
          {!pageLoading && thread.length > 0 && (
            <div className="thread-list space-y-4">
              {thread.map((item, index) => {
                const isLastItem = index === thread.length - 1;

                return (
                  <div
                    key={item._id || index}
                    className="thread-item flex flex-col gap-2"
                  >
                    {/* User Question (Right-Aligned Bubble) */}
                    <div className="flex justify-end">
                      <div className="bg-[#0A2647] text-white rounded-2xl px-4 py-2 max-w-[80%] rounded-br-none text-sm">
                        <p>{item.question}</p>
                      </div>
                    </div>

                    {/* AI Answer (Left-Aligned Bubble / Spinner) */}
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl px-4 py-2 max-w-[80%] rounded-bl-none text-sm shadow-sm">
                        {!item.answer && isLastItem ? (
                          <div className="flex items-center gap-2 text-gray-500 py-1">
                            <Activity className="w-4 h-4 animate-pulse text-[#0A2647]" />
                            <span className="text-xs font-medium">
                              Thinking...
                            </span>
                          </div>
                        ) : (
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>{item.answer}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Form */}
        <p className="text-xs text-gray-400 text-center pb-2">This AI tutor only answers questions grounded in this specific material — it won't respond to unrelated topics.</p>
        <form
          onSubmit={handleAsk}
          className="py-4 border-t border-gray-200 flex gap-2"
        >
          <input
            type="text"
            placeholder="Ask a question about this material..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={asking}
            className="flex-1 border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2647] disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!question.trim() || asking}
            className="bg-[#0A2647] text-white px-4 rounded-sm hover:bg-[#0d3060] transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {asking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="text-white font-medium text-sm">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default MaterialChat;
