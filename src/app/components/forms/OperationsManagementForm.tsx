import { useState } from "react";
import { Save, List, PlusCircle, Eye } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

export function OperationsManagementForm() {
    const { accessMode } = useStation();
    const isReadOnly = accessMode === 'view-only';

    const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
    const [formData, setFormData] = useState({
        operationId: isReadOnly ? "OPS-N101-DAILY" : "",
        operationType: isReadOnly ? "Standard Daily Operations" : "",
        department: isReadOnly ? "Front-End Service" : "",
        startDate: isReadOnly ? "2024-01-01" : "",
        status: isReadOnly ? "active" : "",
        assignedTo: isReadOnly ? "Operations Manager Mohammed" : "",
        priority: isReadOnly ? "high" : "",
        notes: isReadOnly ? "Monitoring fuel delivery schedules and store inventory replenishment." : "",
    });

    const mockRecords = [
        { id: "OPS-001", type: "Daily Operations", department: "Fuel", status: "Active", priority: "High" },
        { id: "OPS-002", type: "Maintenance", department: "Technical", status: "Scheduled", priority: "Medium" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Operations Management:", formData);
        alert("Operations record saved successfully!");
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#020713]">Operations Management</h1>
                    <p className="text-gray-600 mt-2">Manage daily operations and workflows</p>
                </div>

                {!isReadOnly && (
                    <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                        <button
                            onClick={() => setViewMode('form')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'form'
                                ? 'bg-white text-[#f97316] shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>New Entry</span>
                        </button>
                        <button
                            onClick={() => setViewMode('records')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'records'
                                ? 'bg-white text-[#f97316] shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <List className="w-4 h-4" />
                            <span>View Records</span>
                        </button>
                    </div>
                )}

                {isReadOnly && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-semibold">View Only Mode</span>
                    </div>
                )}
            </div>

            {viewMode === 'form' ? (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 vibrant-glow border-t-4 border-violet-600 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-[#020713] mb-4 border-b border-[#D2C29C] pb-2">
                            Operations Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Operation ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.operationId}
                                    onChange={(e) => setFormData({ ...formData, operationId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    required
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Operation Type</label>
                                <input
                                    type="text"
                                    value={formData.operationType}
                                    onChange={(e) => setFormData({ ...formData, operationType: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    disabled={isReadOnly}
                                >
                                    <option value="">Select Status</option>
                                    <option value="active">Active</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                                <input
                                    type="text"
                                    value={formData.assignedTo}
                                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    disabled={isReadOnly}
                                >
                                    <option value="">Select Priority</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    rows={3}
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>
                    </div>

                    {!isReadOnly && (
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-[#f97316] hover:bg-[#fb923c] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Save className="w-5 h-5" />
                                Save Operations Record
                            </button>
                        </div>
                    )}
                </form>
            ) : (
                <FormRecordsList
                    title="Operations Records"
                    columns={["ID", "Type", "Department", "Status", "Priority"]}
                    records={mockRecords}
                />
            )}
        </div>
    );
}
