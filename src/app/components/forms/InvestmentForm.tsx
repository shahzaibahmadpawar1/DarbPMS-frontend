import { useState } from "react";
import { Save, List, PlusCircle, Eye, AlertCircle } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

export function InvestmentForm() {
    const { accessMode, setInvestmentProjectData } = useStation();
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
        // Location Information
        projectCode: isReadOnly ? "SOLAR-001" : "",
        city: isReadOnly ? "Riyadh" : "",
        district: isReadOnly ? "North District" : "",
        area: isReadOnly ? "Industrial Zone" : "",
        googleLocation: isReadOnly ? "https://maps.google.com/..." : "",
        // Owner Information
        ownerName: isReadOnly ? "Ahmed Al-Rashid" : "",
        ownerContactNo: isReadOnly ? "+966501234567" : "",
        idNo: isReadOnly ? "1234567890" : "",
        nationalAddress: isReadOnly ? "123 Main Street, Riyadh" : "",
        email: isReadOnly ? "owner@example.com" : "",
    });

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const mockRecords = [
        { id: "INV-001", project: "Station Expansion", amount: "5,000,000 SAR", roi: "15%", status: "Active" },
        { id: "INV-002", project: "New Equipment", amount: "2,500,000 SAR", roi: "12%", status: "Pending" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Set investment data to context for auto-population in station and owner forms
        setInvestmentProjectData({
            projectName: formData.projectName,
            projectCode: formData.projectCode,
            city: formData.city,
            district: formData.district,
            area: formData.area,
            googleLocation: formData.googleLocation,
            ownerName: formData.ownerName,
            ownerContactNo: formData.ownerContactNo,
            idNo: formData.idNo,
            nationalAddress: formData.nationalAddress,
            email: formData.email,
        });

        console.log("Investment:", formData);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
        
        // In a real app, you would make an API call here
        alert("Investment record saved successfully! You can now auto-fill Station and Owner information forms.");
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Investment</h1>
                    <p className="text-muted-foreground mt-2">Manage investment projects and financial planning</p>
                </div>

                {!isReadOnly && (
                    <div className="flex bg-muted p-1 rounded-xl w-fit">
                        <button
                            onClick={() => setViewMode('form')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'form'
                                ? 'bg-card text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>New Entry</span>
                        </button>
                        <button
                            onClick={() => setViewMode('records')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'records'
                                ? 'bg-card text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <List className="w-4 h-4" />
                            <span>View Records</span>
                        </button>
                    </div>
                )}

                {isReadOnly && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-info/5 text-info rounded-lg border border-info/20">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-semibold">View Only Mode</span>
                    </div>
                )}
            </div>

            {viewMode === 'form' ? (
                <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-xl p-8 card-glow border-t-4 border-primary relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
                            Investment Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Project ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.projectId}
                                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    required
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Project Name</label>
                                <input
                                    type="text"
                                    value={formData.projectName}
                                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Investment Amount (SAR)</label>
                                <input
                                    type="number"
                                    value={formData.investmentAmount}
                                    onChange={(e) => setFormData({ ...formData, investmentAmount: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Expected ROI (%)</label>
                                <input
                                    type="number"
                                    value={formData.expectedROI}
                                    onChange={(e) => setFormData({ ...formData, expectedROI: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
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
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Investor Name</label>
                                <input
                                    type="text"
                                    value={formData.investorName}
                                    onChange={(e) => setFormData({ ...formData, investorName: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    rows={3}
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location Information - For Auto-Population */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
                            Location Information <span className="text-xs text-primary font-normal">(Used for Station Auto-Fill)</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Project Code</label>
                                <input
                                    type="text"
                                    value={formData.projectCode}
                                    onChange={(e) => setFormData({ ...formData, projectCode: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    placeholder="e.g., SOLAR-001"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">City</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">District</label>
                                <input
                                    type="text"
                                    value={formData.district}
                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Area/Region</label>
                                <input
                                    type="text"
                                    value={formData.area}
                                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Geographic Location (Google Maps URL)</label>
                                <input
                                    type="url"
                                    value={formData.googleLocation}
                                    onChange={(e) => setFormData({ ...formData, googleLocation: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    placeholder="https://maps.google.com/..."
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Owner Information - For Auto-Population */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
                            Owner Information <span className="text-xs text-primary font-normal">(Used for Owner Auto-Fill)</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Owner Name</label>
                                <input
                                    type="text"
                                    value={formData.ownerName}
                                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Owner ID/National ID</label>
                                <input
                                    type="text"
                                    value={formData.idNo}
                                    onChange={(e) => setFormData({ ...formData, idNo: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Owner Mobile</label>
                                <input
                                    type="tel"
                                    value={formData.ownerContactNo}
                                    onChange={(e) => setFormData({ ...formData, ownerContactNo: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Owner Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Owner National Address</label>
                                <textarea
                                    value={formData.nationalAddress}
                                    onChange={(e) => setFormData({ ...formData, nationalAddress: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    rows={2}
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>
                    </div>

                    {!isReadOnly && (
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20"
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
