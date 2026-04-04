import { useEffect, useState } from "react";
import { FileText, Check, X, Save, List, PlusCircle } from "lucide-react";
import { FormRecordsList } from "./FormRecordsList";
import { departmentSections } from "../data/formSections";
import { useAuth } from "@/context/AuthContext";
import { getDepartmentLabel, getRoleLabel } from "@/services/api";

type RequestType =
    | "general-request"
    | "maintenance-request"
    | "it-support"
    | "hr-request"
    | "procurement-request"
    | "finance-request"
    | "legal-request"
    | "facility-request";

interface RequestFormData {
    requestType: RequestType | "";
    requestNumber: string;
    requestDate: string;
    requester: string;
    department: string;
    priority: string;
    status: string;
    subject?: string;
    description?: string;
    notes: string;
}

const requestTypes = [
    { value: "general-request", label: "General Request" },
    { value: "maintenance-request", label: "Maintenance Request" },
    { value: "it-support", label: "IT Support Request" },
    { value: "hr-request", label: "HR Request" },
    { value: "procurement-request", label: "Procurement Request" },
    { value: "finance-request", label: "Finance Request" },
    { value: "legal-request", label: "Legal Request" },
    { value: "facility-request", label: "Facility Request" },
];

const departmentOptions = Array.from(
    new Set(departmentSections.flatMap((section) => section.items.map((item) => item.title)))
);

const mockRecords = [
    { id: "REQ-001", type: "General Request", requester: "Ahmed Ali", status: "Approved", date: "2024-06-01" },
    { id: "REQ-002", type: "IT Support Request", requester: "Sara Hassan", status: "Pending", date: "2024-06-08" },
    { id: "REQ-003", type: "Maintenance Request", requester: "Mohammed Khalid", status: "In Review", date: "2024-06-12" },
    { id: "REQ-004", type: "HR Request", requester: "Fatima Al-Dosari", status: "Rejected", date: "2024-06-14" },
];

export function RequestPage() {
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState<"form" | "records">("form");
    const [formData, setFormData] = useState<RequestFormData>({
        requestType: "",
        requestNumber: "",
        requestDate: "",
        requester: "",
        department: "",
        priority: "",
        status: "",
        subject: "",
        description: "",
        notes: "",
    });

    useEffect(() => {
        if (!user) return;

        const roleLabel = getRoleLabel(user.role);
        const rawDepartment = getDepartmentLabel(user.department);
        const requesterDepartment = rawDepartment === "All Departments" ? "All Departments" : `${rawDepartment} Department`;
        const suggestedDepartment =
            requesterDepartment === "All Departments"
                ? ""
                : departmentOptions.find((option) => option.toLowerCase() === requesterDepartment.toLowerCase()) || "";

        setFormData((prev) => ({
            ...prev,
            requester: `${user.username || "Requester"} (${roleLabel}) - ${requesterDepartment}`,
            department: prev.department || suggestedDepartment,
        }));
    }, [user]);

    const renderRequestTypeFields = () => {
        if (!formData.requestType) {
            return (
                <div className="md:col-span-2 text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Please select a request type to continue</p>
                </div>
            );
        }

        return (
            <>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Subject *</label>
                    <input
                        type="text"
                        value={formData.subject || ""}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                        placeholder="Brief subject of the request"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Due Date</label>
                    <input
                        type="date"
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Detailed Description</label>
                    <textarea
                        value={formData.description || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                        rows={4}
                        placeholder="Describe your request in detail..."
                    />
                </div>
            </>
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Request saved successfully!");
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Requests</h1>
                    <p className="text-muted-foreground mt-2">Submit and manage all departmental requests</p>
                </div>

                <div className="flex bg-muted p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setViewMode("form")}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === "form"
                            ? "bg-card text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>New Request</span>
                    </button>
                    <button
                        onClick={() => setViewMode("records")}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === "records"
                            ? "bg-card text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <List className="w-4 h-4" />
                        <span>View Records</span>
                    </button>
                </div>
            </div>

            {viewMode === "form" ? (
                <form
                    onSubmit={handleSubmit}
                    className="bg-card rounded-xl shadow-xl p-8 card-glow border-t-4 border-primary relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                    {/* Request Information */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
                            Request Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Department */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Department <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departmentOptions.map((department) => (
                                        <option key={department} value={department}>
                                            {department}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Request Type */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Request Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.requestType}
                                    onChange={(e) => setFormData({ ...formData, requestType: e.target.value as RequestType })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                    required
                                >
                                    <option value="">Select Request Type</option>
                                    {requestTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Request Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.requestNumber}
                                    onChange={(e) => setFormData({ ...formData, requestNumber: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Request Date</label>
                                <input
                                    type="date"
                                    value={formData.requestDate}
                                    onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Requester</label>
                                <input
                                    type="text"
                                    value={formData.requester}
                                    readOnly
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-muted/40 text-foreground"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Priority</label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                >
                                    <option value="">Select Priority</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                >
                                    <option value="">Select Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in-review">In Review</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Info based on Type */}
                    {formData.requestType && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
                                {requestTypes.find((t) => t.value === formData.requestType)?.label} Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {renderRequestTypeFields()}
                            </div>
                        </div>
                    )}

                    {/* Additional Information */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
                            Additional Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    rows={4}
                                    placeholder="Add any additional notes or comments"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Request Action</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status: "approved" })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all ${formData.status === "approved"
                                            ? "bg-success/5 border-success text-success shadow-md ring-2 ring-success/10"
                                            : "bg-card border-border text-muted-foreground hover:border-success/30 hover:text-success"
                                            }`}
                                    >
                                        <div className={`p-1 rounded-full ${formData.status === "approved" ? "bg-success text-white" : "bg-muted"}`}>
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold">Approve</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status: "rejected" })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all ${formData.status === "rejected"
                                            ? "bg-error/5 border-error text-error shadow-md ring-2 ring-error/10"
                                            : "bg-card border-border text-muted-foreground hover:border-error/30 hover:text-error"
                                            }`}
                                    >
                                        <div className={`p-1 rounded-full ${formData.status === "rejected" ? "bg-error text-white" : "bg-muted"}`}>
                                            <X className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold">Reject</span>
                                    </button>
                                </div>
                                {formData.status && (
                                    <div
                                        className={`mt-4 p-3 rounded-lg text-sm font-semibold flex items-center gap-2 ${formData.status === "approved"
                                            ? "bg-success/5 text-success"
                                            : formData.status === "rejected"
                                                ? "bg-error/5 text-error"
                                                : "bg-info/5 text-info"
                                            }`}
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${formData.status === "approved"
                                                ? "bg-success"
                                                : formData.status === "rejected"
                                                    ? "bg-error"
                                                    : "bg-info"
                                                }`}
                                        />
                                        Current Status:{" "}
                                        <span className="capitalize">{formData.status.replace("-", " ")}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20"
                        >
                            <Save className="w-5 h-5" />
                            Send Requset
                        </button>
                    </div>
                </form>
            ) : (
                <FormRecordsList
                    title="Requests"
                    columns={["Request ID", "Type", "Requester", "Status", "Date"]}
                    records={mockRecords}
                />
            )}
        </div>
    );
}

