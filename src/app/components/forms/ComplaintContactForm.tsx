import { useState } from "react";
import { List, PlusCircle, Send, MessageSquare, User, Mail, Phone } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

interface ComplaintFormData {
    complaintId: string;
    submissionDate: string;
    senderName: string;
    senderEmail: string;
    senderPhone: string;
    department: string;
    subject: string;
    priority: string;
    category: string;
    description: string;
    attachments?: string;
    status: string;
}

export function ComplaintContactForm() {
    const { accessMode } = useStation();

    const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
    const [formData, setFormData] = useState<ComplaintFormData>({
        complaintId: "",
        submissionDate: new Date().toISOString().split('T')[0],
        senderName: "",
        senderEmail: "",
        senderPhone: "",
        department: "",
        subject: "",
        priority: "",
        category: "",
        description: "",
        status: "pending",
    });

    const mockRecords = [
        { id: "COMP-001", sender: "Ahmed Ali", subject: "Equipment Issue", priority: "High", status: "In Review", date: "2024-01-15" },
        { id: "COMP-002", sender: "Sara Hassan", subject: "Process Improvement", priority: "Medium", status: "Resolved", date: "2024-01-20" },
        { id: "COMP-003", sender: "Mohammed Khalid", subject: "Safety Concern", priority: "Urgent", status: "Pending", date: "2024-01-22" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Complaint/Contact Form:", formData);
        alert("Your message has been sent directly to the CEO. You will receive a response within 24-48 hours.");
        // Reset form
        setFormData({
            complaintId: "",
            submissionDate: new Date().toISOString().split('T')[0],
            senderName: "",
            senderEmail: "",
            senderPhone: "",
            department: "",
            subject: "",
            priority: "",
            category: "",
            description: "",
            status: "pending",
        });
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Contact CEO Office</h1>
                    <p className="text-muted-foreground mt-2">Submit complaints, suggestions, or direct messages to the CEO</p>
                </div>

                {accessMode === 'admin' && (
                    <div className="flex bg-muted p-1 rounded-xl w-fit">
                        <button
                            onClick={() => setViewMode('form')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'form'
                                ? 'bg-card text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>New Message</span>
                        </button>
                        <button
                            onClick={() => setViewMode('records')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'records'
                                ? 'bg-card text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <List className="w-4 h-4" />
                            <span>View History</span>
                        </button>
                    </div>
                )}
            </div>

            {viewMode === 'form' ? (
                <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-xl p-8 card-glow border-t-4 border-primary relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* CEO Contact Notice */}
                    <div className="mb-6 bg-info/5 border-l-4 border-info p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                            <MessageSquare className="w-6 h-6 text-info mt-1" />
                            <div>
                                <h3 className="font-bold text-foreground mb-1">Direct Line to CEO Office</h3>
                                <p className="text-sm text-muted-foreground">
                                    This form sends your message directly to the CEO's office. All submissions are reviewed personally and you will receive a response within 24-48 hours.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sender Information */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Your Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.senderName}
                                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="email"
                                        value={formData.senderEmail}
                                        onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                                        className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="tel"
                                        value={formData.senderPhone}
                                        onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
                                        className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                        placeholder="+966 XX XXX XXXX"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Department/Station</label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    placeholder="e.g., Location N101"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Message Details */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            Message Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="complaint">Complaint</option>
                                    <option value="suggestion">Suggestion</option>
                                    <option value="inquiry">General Inquiry</option>
                                    <option value="feedback">Feedback</option>
                                    <option value="urgent">Urgent Matter</option>
                                    <option value="appreciation">Appreciation</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Priority <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                    required
                                >
                                    <option value="">Select Priority</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Subject <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                placeholder="Brief summary of your message"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Message <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                rows={6}
                                placeholder="Please provide detailed information about your complaint, suggestion, or inquiry..."
                                required
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Be as specific as possible to help us address your concerns effectively.
                            </p>
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
                            Attachments (Optional)
                        </h2>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    multiple
                                />
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">Upload supporting documents</span>
                                    <span className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData({
                                complaintId: "",
                                submissionDate: new Date().toISOString().split('T')[0],
                                senderName: "",
                                senderEmail: "",
                                senderPhone: "",
                                department: "",
                                subject: "",
                                priority: "",
                                category: "",
                                description: "",
                                status: "pending",
                            })}
                            className="px-6 py-3 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-all"
                        >
                            Clear Form
                        </button>
                        <button
                            type="submit"
                            className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20"
                        >
                            <Send className="w-5 h-5" />
                            Send to CEO Office
                        </button>
                    </div>
                </form>
            ) : (
                <FormRecordsList
                    title="Message History"
                    columns={["ID", "Sender", "Subject", "Priority", "Status", "Date"]}
                    records={mockRecords}
                />
            )}
        </div>
    );
}
