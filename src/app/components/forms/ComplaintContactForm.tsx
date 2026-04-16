import { useState } from "react";
import { Building2, Mail, MessageSquare, Paperclip, Phone, Send, User, Upload } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ComplaintFormData {
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

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export function ComplaintContactForm() {
    const { token, user } = useAuth();

    const [formData, setFormData] = useState<ComplaintFormData>({
        senderName: user?.username || "",
        senderEmail: user?.email || "",
        senderPhone: user?.phone || "",
        department: user?.department || "",
        subject: "",
        priority: "medium",
        category: "",
        description: "",
        status: "pending",
    });
    const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const uploadAttachment = async (file: File): Promise<{ name: string; url: string }> => {
        if (!token) {
            throw new Error("Authentication token is missing");
        }

        const fileData = new FormData();
        fileData.append("file", file);

        const response = await fetch(`${API_URL}/files/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: fileData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error?.error || "Failed to upload attachment");
        }

        const result = await response.json();
        return {
            name: file.name,
            url: result?.data?.url || "",
        };
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!token) {
            alert("Please log in again before sending a message.");
            return;
        }

        if (!formData.senderName.trim() || !formData.senderEmail.trim() || !formData.subject.trim() || !formData.description.trim()) {
            alert("Name, email, subject, and message are required.");
            return;
        }

        setIsSubmitting(true);

        try {
            const attachments = await Promise.all(attachmentFiles.map((file) => uploadAttachment(file)));
            const response = await fetch(`${API_URL}/ceo-contact/submit`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    senderName: formData.senderName,
                    senderEmail: formData.senderEmail,
                    senderPhone: formData.senderPhone,
                    department: formData.department,
                    category: formData.category,
                    priority: formData.priority,
                    subject: formData.subject,
                    description: formData.description,
                    attachments,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                alert(error?.error || "Failed to submit message");
                return;
            }

            alert("Your message has been sent to the CEO office and will appear in the executive task queue.");
            setFormData({
                senderName: user?.username || "",
                senderEmail: user?.email || "",
                senderPhone: user?.phone || "",
                department: user?.department || "",
                subject: "",
                priority: "medium",
                category: "",
                description: "",
                status: "pending",
            });
            setAttachmentFiles([]);
        } catch (error) {
            console.error("Failed to submit CEO contact form:", error);
            alert(error instanceof Error ? error.message : "Failed to submit CEO contact form");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openAttachmentPreview = (file: File) => {
        const previewUrl = URL.createObjectURL(file);
        window.open(previewUrl, '_blank', 'noopener,noreferrer');
        setTimeout(() => URL.revokeObjectURL(previewUrl), 60000);
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Contact CEO Office</h1>
                    <p className="text-muted-foreground mt-2">Submit complaints, suggestions, or direct messages to the CEO</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-xl p-8 card-glow border-t-4 border-primary relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 bg-info/5 border-l-4 border-info p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                        <MessageSquare className="w-6 h-6 text-info mt-1" />
                        <div>
                            <h3 className="font-bold text-foreground mb-1">Direct Line to CEO Office</h3>
                            <p className="text-sm text-muted-foreground">
                                This form creates an executive-review task with all submitted details and attachments.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Your Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name <span className="text-red-500">*</span></label>
                            <input type="text" value={formData.senderName} onChange={(event) => setFormData((prev) => ({ ...prev, senderName: event.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Email Address <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input type="email" value={formData.senderEmail} onChange={(event) => setFormData((prev) => ({ ...prev, senderEmail: event.target.value }))} className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input type="tel" value={formData.senderPhone} onChange={(event) => setFormData((prev) => ({ ...prev, senderPhone: event.target.value }))} className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="+966 XX XXX XXXX" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Department/Station</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input type="text" value={formData.department} onChange={(event) => setFormData((prev) => ({ ...prev, department: event.target.value }))} className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="e.g., Location N101" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        Message Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Category <span className="text-red-500">*</span></label>
                            <select value={formData.category} onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" required>
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
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Priority <span className="text-red-500">*</span></label>
                            <select value={formData.priority} onChange={(event) => setFormData((prev) => ({ ...prev, priority: event.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" required>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Subject <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.subject} onChange={(event) => setFormData((prev) => ({ ...prev, subject: event.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="Brief summary of your message" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Message <span className="text-red-500">*</span></label>
                        <textarea value={formData.description} onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" rows={6} placeholder="Please provide detailed information about your message..." required />
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 flex items-center gap-2">
                        <Paperclip className="w-5 h-5 text-primary" />
                        Attachments (Optional)
                    </h2>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <label className="cursor-pointer">
                            <input type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple onChange={(event) => setAttachmentFiles(Array.from(event.target.files || []))} />
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Upload className="w-6 h-6 text-primary" />
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">Upload supporting documents</span>
                                <span className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG</span>
                            </div>
                        </label>
                        {attachmentFiles.length > 0 && (
                            <div className="mt-4 space-y-2 text-left">
                                {attachmentFiles.map((file, index) => (
                                    <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-2 bg-muted/40 rounded px-3 py-2">
                                        <span className="text-xs text-foreground truncate">{file.name}</span>
                                        <span className="text-xs text-muted-foreground">Ready to upload</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            setFormData({
                                senderName: user?.username || "",
                                senderEmail: user?.email || "",
                                senderPhone: user?.phone || "",
                                department: user?.department || "",
                                subject: "",
                                priority: "medium",
                                category: "",
                                description: "",
                                status: "pending",
                            });
                            setAttachmentFiles([]);
                        }}
                        className="px-6 py-3 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-all"
                    >
                        Clear Form
                    </button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-60">
                        <Send className="w-5 h-5" />
                        {isSubmitting ? 'Sending...' : 'Send to CEO Office'}
                    </button>
                </div>
            </form>
        </div>
    );
}
