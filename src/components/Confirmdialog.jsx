import { AlertTriangle } from "lucide-react";

const ConfirmDialog = ({ title, message, onConfirm, onCancel, loading }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

            <div className="relative bg-white rounded-sm shadow-lg p-6 max-w-sm w-full">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>

                <h3 className="font-medium text-[#1C1C1C] mb-1">{title}</h3>
                <p className="text-sm text-gray-500 mb-6">{message}</p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 text-sm rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 text-sm rounded-sm bg-red-600 text-white hover:bg-red-700 transition disabled:bg-red-300"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;