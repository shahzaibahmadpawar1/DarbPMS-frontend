import { useState, useEffect } from "react";
import { Save, Eye, Upload, FileCheck, Trash2, Paperclip, X, ExternalLink, FileText } from "lucide-react";
import { useStation } from "../../context/StationContext";

const ATTACHMENT_TYPES = [
    { key: "operatingLicense", label: "Operating License", description: "Official operating license document" },
    { key: "petroleumTradeLicense", label: "Petroleum Materials Trade License", description: "License for petroleum materials trading" },
    { key: "civilDefenseCertificate", label: "Civil Defense Receipt Certificate", description: "Civil defense compliance receipt" },
    { key: "safetyInstallationsCertificate", label: "Safety Installations Completion Certificate", description: "Certificate of completed safety installations" },
    { key: "maintenanceContract", label: "Maintenance Contract", description: "Station maintenance agreement" },
    { key: "containerContract", label: "Container Contract", description: "Fuel container contractual agreement" },
    { key: "municipalLicense", label: "Municipal License", description: "Municipal authority approval document" },
];

type AttachmentState = Record<string, File | null>;
type ObjectUrls = Record<string, string>;

function isImage(file: File) {
    return file.type.startsWith("image/");
}

function isPdf(file: File) {
    return file.type === "application/pdf";
}

// ── Preview Modal ────────────────────────────────────────────────────────────
function PreviewModal({ file, label, onClose }: { file: File; label: string; onClose: () => void }) {
    const [url, setUrl] = useState<string>("");

    useEffect(() => {
        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground text-base">{label}</h3>
                            <p className="text-xs text-muted-foreground truncate max-w-xs">{file.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={url}
                            download={file.name}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" /> Open in New Tab
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            title="Close preview"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-auto bg-muted/30 flex items-center justify-center p-4 min-h-0">
                    {url && isImage(file) && (
                        <img
                            src={url}
                            alt={label}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                        />
                    )}
                    {url && isPdf(file) && (
                        <iframe
                            src={url}
                            title={label}
                            className="w-full h-full min-h-[60vh] rounded-lg border border-border"
                        />
                    )}
                    {url && !isImage(file) && !isPdf(file) && (
                        <div className="flex flex-col items-center justify-center gap-4 text-center py-12">
                            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <FileText className="w-10 h-10 text-primary" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-foreground">{file.name}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Preview not available for this file type.
                                </p>
                            </div>
                            <a
                                href={url}
                                download={file.name}
                                className="btn-primary px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold"
                            >
                                <ExternalLink className="w-4 h-4" /> Download File
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export function GovernmentLicenseAttachmentsPage() {
    const { accessMode } = useStation();
    const isReadOnly = accessMode === "view-only";

    const [attachments, setAttachments] = useState<AttachmentState>(
        Object.fromEntries(ATTACHMENT_TYPES.map((t) => [t.key, null]))
    );
    const [preview, setPreview] = useState<{ file: File; label: string } | null>(null);

    const handleFileChange = (key: string, file: File | null) => {
        setAttachments((prev) => ({ ...prev, [key]: file }));
    };

    const uploadedCount = Object.values(attachments).filter(Boolean).length;

    return (
        <div className="p-8">
            {/* Preview Modal */}
            {preview && (
                <PreviewModal
                    file={preview.file}
                    label={preview.label}
                    onClose={() => setPreview(null)}
                />
            )}

            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Paperclip className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">Government License Attachments</h1>
                    </div>
                    <p className="text-muted-foreground mt-1 ml-13">
                        Attach all official documents required for the Government Licenses section
                    </p>
                </div>

                {isReadOnly ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-info/5 text-info rounded-lg border border-info/20">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-semibold">View Only Mode</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-lg border border-emerald-500/20">
                        <FileCheck className="w-4 h-4" />
                        <span className="text-sm font-semibold">{uploadedCount} / {ATTACHMENT_TYPES.length} Uploaded</span>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="mb-6 bg-card rounded-xl border border-border p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-muted-foreground">Upload Progress</span>
                    <span className="text-sm font-bold text-primary">{Math.round((uploadedCount / ATTACHMENT_TYPES.length) * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                    <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(uploadedCount / ATTACHMENT_TYPES.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Attachments List */}
            <div className="bg-card rounded-xl shadow-xl border-t-4 border-primary card-glow animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">Required Documents</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Upload all required documents in PDF, JPG, PNG, or DOC format
                    </p>
                </div>

                <div className="divide-y divide-border">
                    {ATTACHMENT_TYPES.map((att, index) => {
                        const file = attachments[att.key];
                        const isUploaded = Boolean(file);

                        return (
                            <div
                                key={att.key}
                                className={`flex items-center justify-between p-5 transition-all duration-200 ${isUploaded ? "bg-emerald-500/3 hover:bg-emerald-500/5" : "hover:bg-muted/30"}`}
                            >
                                {/* Left: icon + info */}
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${isUploaded ? "bg-emerald-500/15" : "bg-muted"}`}>
                                        {isUploaded ? (
                                            <FileCheck className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <span className="text-sm font-bold text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className={`text-sm font-semibold transition-colors ${isUploaded ? "text-emerald-700 dark:text-emerald-400" : "text-foreground"}`}>
                                            {att.label}
                                        </p>
                                        {isUploaded ? (
                                            <p className="text-xs text-emerald-600 dark:text-emerald-500 truncate mt-0.5">
                                                ✓ {file!.name}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-muted-foreground mt-0.5">{att.description}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Right: action buttons */}
                                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                    {/* VIEW button – shown whenever a file is uploaded (both modes) */}
                                    {isUploaded && (
                                        <button
                                            type="button"
                                            onClick={() => setPreview({ file: file!, label: att.label })}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-primary/5 hover:border-primary/40 text-sm font-semibold text-foreground transition-all"
                                            title="View attachment"
                                        >
                                            <Eye className="w-4 h-4 text-primary" />
                                            View
                                        </button>
                                    )}

                                    {/* UPLOAD / REPLACE button – only in edit mode */}
                                    {!isReadOnly && (
                                        <label className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${isUploaded
                                            ? "bg-muted hover:bg-muted/80 text-foreground border border-border"
                                            : "btn-primary"
                                            }`}>
                                            <Upload className="w-4 h-4" />
                                            {isUploaded ? "Replace" : "Upload"}
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                onChange={(e) => handleFileChange(att.key, e.target.files?.[0] ?? null)}
                                            />
                                        </label>
                                    )}

                                    {/* DELETE button – only in edit mode + file present */}
                                    {!isReadOnly && isUploaded && (
                                        <button
                                            type="button"
                                            onClick={() => handleFileChange(att.key, null)}
                                            className="p-2 rounded-lg border border-border hover:bg-destructive/10 hover:border-destructive/40 transition-colors"
                                            title="Remove file"
                                        >
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </button>
                                    )}

                                    {/* Read-only badges */}
                                    {isReadOnly && !isUploaded && (
                                        <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-bold">
                                            Missing
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!isReadOnly && (
                    <div className="p-6 border-t border-border flex justify-end">
                        <button
                            type="button"
                            onClick={() => alert("Attachments saved successfully!")}
                            className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20"
                        >
                            <Save className="w-5 h-5" /> Save All Attachments
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
