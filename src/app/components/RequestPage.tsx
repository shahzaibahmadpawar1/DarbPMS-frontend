import { useEffect, useState } from "react";
import { Building2, MessageSquare, Send, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { departmentOptions, getRoleLabel } from "@/services/api";

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
    department: string;
    priority: string;
    requester: string;
    subject: string;
    dueDate: string;
    description: string;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

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

const initialFormState = (requester = "", department = ""): RequestFormData => ({
    requestType: "",
    department,
    priority: "medium",
    requester,
    subject: "",
    dueDate: "",
    description: "",
});

export function RequestPage() {
    const { user, token } = useAuth();
    const [formData, setFormData] = useState<RequestFormData>(() => initialFormState());
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!user) return;

        const roleLabel = getRoleLabel(user.role);
        setFormData((prev) => ({
            ...prev,
            requester: `${user.username || "Requester"} (${roleLabel})`,
            department: prev.department || (user.department ? user.department : ""),
        }));
    }, [user]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!token) {
            alert("Please log in again before submitting a request.");
            return;
        }

        if (!formData.department || !formData.requestType || !formData.subject.trim() || !formData.description.trim()) {
            alert("Select a department, request type, subject, and description.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/requests/submit`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    requestType: formData.requestType,
                    department: formData.department,
                    priority: formData.priority,
                    subject: formData.subject,
                    dueDate: formData.dueDate,
                    description: formData.description,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                alert(error?.error || "Failed to submit request");
                return;
            }

            alert("Request submitted. The department manager will review it in tasks.");
            setFormData((prev) => ({
                ...initialFormState(prev.requester, prev.department),
                department: prev.department,
                requester: prev.requester,
                requestType: prev.requestType,
            }));
        } catch (error) {
            console.error("Failed to submit request:", error);
            alert("Failed to submit request");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex flex-col gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Requests</h1>
                    <p className="text-muted-foreground mt-2">Submit a request to the relevant department manager for review.</p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <User className="w-4 h-4 text-primary" /> Requester
                        </div>
                        <p className="mt-2 text-sm font-semibold text-foreground">{formData.requester || "Ready to submit"}</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Building2 className="w-4 h-4 text-primary" /> Department routing
                        </div>
                        <p className="mt-2 text-sm font-semibold text-foreground">Task goes to the department manager</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <MessageSquare className="w-4 h-4 text-primary" /> Response tracking
                        </div>
                        <p className="mt-2 text-sm font-semibold text-foreground">Approval or rejection appears in your tasks</p>
                    </div>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-card rounded-xl shadow-xl p-8 card-glow border-t-4 border-primary relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
                        Request Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Department <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.department}
                                onChange={(event) => setFormData((prev) => ({ ...prev, department: event.target.value }))}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                required
                            >
                                <option value="">Select Department</option>
                                {departmentOptions.map((department) => (
                                    <option key={department.value} value={department.value}>
                                        {department.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Request Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.requestType}
                                onChange={(event) => setFormData((prev) => ({ ...prev, requestType: event.target.value as RequestType }))}
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
                                onChange={(event) => setFormData((prev) => ({ ...prev, priority: event.target.value }))}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Subject <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(event) => setFormData((prev) => ({ ...prev, subject: event.target.value }))}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                placeholder="Brief subject of the request"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Due Date</label>
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(event) => setFormData((prev) => ({ ...prev, dueDate: event.target.value }))}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Detailed Description <span className="text-red-500">*</span></label>
                            <textarea
                                value={formData.description}
                                onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                rows={5}
                                placeholder="Describe the request in detail so the department manager can review it."
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-60"
                    >
                        <Send className="w-5 h-5" />
                        {isSubmitting ? "Submitting..." : "Send Request"}
                    </button>
                </div>
            </form>
        </div>
    );
}

