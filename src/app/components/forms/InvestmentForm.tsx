import { useState } from "react";
import { Save, List, PlusCircle, Eye } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

export function InvestmentForm() {
    const { accessMode } = useStation();
    const isReadOnly = accessMode === 'view-only';

    const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
    const [formData, setFormData] = useState({
        projectId: isReadOnly ? "INV-7721-01" : "",
        projectName: isReadOnly ? "Solar Power Integration" : "",
        investmentAmount: isReadOnly ? "250000" : "",
        startDate: isReadOnly ? "2024-04-01" : "",
        expectedROI: isReadOnly ? "18" : "",
        status: isReadOnly ? "active" : "",
        investorName: isReadOnly ? "Darb Capital Group" : "",
        notes: isReadOnly ? "Installation of solar panels on station canopy to reduce electricity costs by 30%." : "",
    });

    const mockRecords = [
        { id: "INV-001", project: "Station Expansion", amount: "5,000,000 SAR", roi: "15%", status: "Active" },
        { id: "INV-002", project: "New Equipment", amount: "2,500,000 SAR", roi: "12%", status: "Pending" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Investment:", formData);
        alert("Investment record saved successfully!");
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#020713]">Investment</h1>
                    <p className="text-gray-600 mt-2">Manage investment projects and financial planning</p>
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
                            Investment Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Project ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.projectId}
                                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    required
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    value={formData.projectName}
                                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Investment Amount (SAR)</label>
                                <input
                                    type="number"
                                    value={formData.investmentAmount}
                                    onChange={(e) => setFormData({ ...formData, investmentAmount: e.target.value })}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expected ROI (%)</label>
                                <input
                                    type="number"
                                    value={formData.expectedROI}
                                    onChange={(e) => setFormData({ ...formData, expectedROI: e.target.value })}
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
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Investor Name</label>
                                <input
                                    type="text"
                                    value={formData.investorName}
                                    onChange={(e) => setFormData({ ...formData, investorName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    disabled={isReadOnly}
                                />
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
                                Save Investment
                            </button>
                        </div>
                    )}
                </form>
            ) : (
                <FormRecordsList
                    title="Investment Records"
                    columns={["ID", "Project", "Amount", "ROI", "Status"]}
                    records={mockRecords}
                />
            )}
        </div>
    );
}
