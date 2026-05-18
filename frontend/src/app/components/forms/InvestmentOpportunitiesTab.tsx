import { useEffect, useMemo, useState } from "react";
import { Upload, PlusCircle, X, Search, Download, Eye, FileCheck, Trash2, ExternalLink, FileText, Clock, Sparkles, CheckCircle2, Printer } from "lucide-react";
import { departmentOptions, investmentWorkflowAPI, usersAPI, type Department } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { canCreateInvestmentOpportunityOrProject } from "@/utils/investmentPermissions";
import { InvestmentOpportunityDetailModal } from "@/app/components/forms/InvestmentWorkflowDetailModals";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

type AttachmentKind =
  | "id_photo"
  | "commercial_register"
  | "tax_number"
  | "national_address"
  | "deed"
  | "licenses"
  | "certificates"
  | "contracts"
  | "other";

const ATTACHMENT_KINDS: Array<{ kind: AttachmentKind; label: string }> = [
  { kind: "id_photo", label: "ID Photo" },
  { kind: "commercial_register", label: "Commercial Register" },
  { kind: "tax_number", label: "Tax Number" },
  { kind: "national_address", label: "National Address" },
  { kind: "deed", label: "Deed" },
  { kind: "licenses", label: "Licenses" },
  { kind: "certificates", label: "Certificates" },
  { kind: "contracts", label: "Contracts" },
  { kind: "other", label: "Other" },
];

const OPPORTUNITY_TYPES = [
  { value: "rent", label: "Rent" },
  { value: "operation", label: "Operation" },
  { value: "investment", label: "Investment" },
  { value: "ownership", label: "Ownership" },
];

const STREET_TYPES = [
  { value: "main", label: "Main" },
  { value: "secondary", label: "Secondary" },
  { value: "neighbourhood", label: "Neighbourhood" },
];

const LOCATION_STATUS = [
  { value: "ready", label: "Ready" },
  { value: "underconstruction", label: "Under construction" },
  { value: "renovation", label: "Renovation" },
  { value: "land", label: "Land" },
];

function toFileHref(url: any) {
  const u = String(url || "").trim();
  if (!u) return null;
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("/")) return `${API_URL}${u}`;
  return `${API_URL}/${u}`;
}

async function uploadFile(token: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/files/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result?.data?.url) {
    throw new Error(result?.details || result?.error || "Failed to upload file");
  }

  return result.data.url as string;
}

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

function isPdfFile(file: File) {
  return file.type === "application/pdf";
}

function AttachmentPreviewModal({ file, label, onClose }: { file: File; label: string; onClose: () => void }) {
  const [objectUrl, setObjectUrl] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      style={{ paddingLeft: "var(--sidebar-offset, 0rem)" }}
      onClick={onClose}
    >
      <div className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-foreground text-base">{label}</h3>
              <p className="text-xs text-muted-foreground truncate">{file.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={objectUrl || "#"}
              download={file.name}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Open
            </a>
            <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Close">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-muted/30 flex items-center justify-center p-4 min-h-0">
          {objectUrl && isImageFile(file) && (
            <img src={objectUrl} alt={label} className="max-w-full max-h-[min(70vh,100%)] object-contain rounded-lg shadow-lg" />
          )}
          {objectUrl && isPdfFile(file) && (
            <iframe src={objectUrl} title={label} className="w-full min-h-[60vh] rounded-lg border border-border" />
          )}
          {objectUrl && !isImageFile(file) && !isPdfFile(file) && (
            <div className="flex flex-col items-center justify-center gap-4 text-center py-12">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground mt-1">Preview is not available for this file type. Use Open to download or open it.</p>
              </div>
              <a
                href={objectUrl}
                download={file.name}
                className="btn-primary px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold"
              >
                <ExternalLink className="w-4 h-4" /> Download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      style={{ paddingLeft: "var(--sidebar-offset, 0rem)" }}
    >
      <div className="w-full max-w-5xl bg-card rounded-2xl border border-border shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <p className="text-lg font-bold text-foreground">{title}</p>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5 block">
      <span className="text-xs font-bold text-muted-foreground">
        {label} {required ? <span className="text-destructive">*</span> : null}
      </span>
      {children}
    </label>
  );
}

const inputCls = "w-full px-3 py-2 border border-border rounded-lg bg-background";
const selectCls = "w-full px-3 py-2 border border-border rounded-lg bg-background";

type OppUiTab = "all" | "new" | "under_study" | "approved" | "rejected" | "cancelled" | "contracted" | "documented";

const APPROVED_WORKFLOW_STATUSES = new Set([
  "approved",
  "station_published",
  "approved_pending_station_assignment",
]);

const CONTRACT_STAGE_STATUSES = new Set(["contract_in_progress", "awaiting_ceo_final_approval"]);

function opportunityWorkflowStatus(o: any): string {
  return String(o.workflow_status || "").trim().toLowerCase();
}

/** CEO routed this opportunity through the contract branch (fields persist after final approval). */
function isOpportunityContracted(o: any): boolean {
  if (o.contract_department || o.contract_manager_user_id) return true;
  return CONTRACT_STAGE_STATUSES.has(opportunityWorkflowStatus(o));
}

/**
 * Direct CEO approval (no contract branch), or linked project on the documents workflow path.
 */
function isOpportunityDocumented(o: any): boolean {
  const linkedPath = String(o.linked_project_workflow_path || o.workflow_path || "").trim().toLowerCase();
  if (linkedPath === "documents") return true;
  if (isOpportunityContracted(o)) return false;
  const wf = opportunityWorkflowStatus(o);
  if (APPROVED_WORKFLOW_STATUSES.has(wf) && o.ceo_approved_at) return true;
  return false;
}

function primaryOpportunityBucket(o: any): "new" | "under_study" | "approved" | "rejected" {
  const wf = opportunityWorkflowStatus(o);
  if (APPROVED_WORKFLOW_STATUSES.has(wf)) return "approved";
  if (wf === "rejected") return "rejected";
  if (wf === "new" || String(o.status || "") === "draft") return "new";

  const required = Number(o.opinions_required_count ?? 5);
  const submitted = Number(o.opinions_submitted_count ?? 0);
  if (submitted >= required && (wf === "awaiting_ceo_decision" || wf === "awaiting_ceo_final_approval" || wf === "contract_in_progress")) {
    return "under_study";
  }

  const sc = Number(o.studies_count ?? 0);
  if (sc > 0) return "under_study";
  return "new";
}

function matchesOpportunityTab(o: any, tab: OppUiTab): boolean {
  switch (tab) {
    case "all":
      return true;
    case "contracted":
      return isOpportunityContracted(o);
    case "documented":
      return isOpportunityDocumented(o);
    case "cancelled":
      return false;
    default:
      return primaryOpportunityBucket(o) === tab;
  }
}

const OPPORTUNITY_FILTER_TABS: { key: OppUiTab; label: string }[] = [
  { key: "new", label: "New" },
  { key: "under_study", label: "Under Study" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "cancelled", label: "Cancelled" },
  { key: "contracted", label: "Contracted" },
  { key: "documented", label: "Documented" },
  { key: "all", label: "All" },
];

function labelOpportunityTypeShort(v: string) {
  const m: Record<string, string> = {
    rent: "Rent",
    operation: "Operation",
    investment: "Investment",
    ownership: "Ownership",
  };
  return m[String(v || "").toLowerCase()] || v || "—";
}

export function InvestmentOpportunitiesTab({
  focusOpportunityId,
  onFocused,
  departmentType = "investment",
}: {
  focusOpportunityId?: string | null;
  onFocused?: () => void;
  departmentType?: "investment" | "franchise";
} = {}) {
  const { token, user } = useAuth();
  const [opps, setOpps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<OppUiTab>("all");
  const [detailOppId, setDetailOppId] = useState<string | null>(null);
  const [autoPrintRequest, setAutoPrintRequest] = useState(0);

  const canCreate = canCreateInvestmentOpportunityOrProject(user);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const list = await investmentWorkflowAPI.listOpportunities(departmentType);
      setOpps(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [token, departmentType]);

  useEffect(() => {
    if (!focusOpportunityId) return;
    setActiveTab("all");
    setDetailOppId(focusOpportunityId);
    onFocused?.();
  }, [focusOpportunityId, onFocused]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return opps;
    return opps.filter((o) => {
      const hay = `${o.client_name || ""} ${o.city || ""} ${o.region || ""} ${o.opportunity_type || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [opps, search]);

  const tabCounts = useMemo(() => {
    const rows = filtered;
    const counts: Record<OppUiTab, number> = {
      all: rows.length,
      new: 0,
      under_study: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
      contracted: 0,
      documented: 0,
    };
    for (const o of rows) {
      for (const { key } of OPPORTUNITY_FILTER_TABS) {
        if (matchesOpportunityTab(o, key)) counts[key] += 1;
      }
    }
    return counts;
  }, [filtered]);

  const displayedOpps = useMemo(() => {
    if (activeTab === "all") return filtered;
    return filtered.filter((o) => matchesOpportunityTab(o, activeTab));
  }, [filtered, activeTab]);

  function BucketBadge({ o }: { o: any }) {
    const b = primaryOpportunityBucket(o);
    if (b === "approved") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 text-[11px] font-bold shrink-0">
          <CheckCircle2 className="w-3 h-3" /> Approved
        </span>
      );
    }
    if (b === "under_study") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 px-2 py-0.5 text-[11px] font-bold shrink-0">
          <Clock className="w-3 h-3" /> Under Study
        </span>
      );
    }
    if (b === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 text-red-700 dark:text-red-400 px-2 py-0.5 text-[11px] font-bold shrink-0">
          <X className="w-3 h-3" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 text-sky-800 dark:text-sky-300 px-2 py-0.5 text-[11px] font-bold shrink-0">
        <Sparkles className="w-3 h-3" /> New
      </span>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {departmentType === "franchise" ? "Franchise Opportunities" : "Investment Opportunities"}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} opportunities</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-xs min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputCls} pl-9`} placeholder="Search..." />
          </div>
          {canCreate && (
            <button type="button" onClick={() => setShowNew(true)} className="btn-primary px-5 py-2.5 rounded-lg text-sm font-semibold inline-flex items-center gap-2 shadow-md">
              <PlusCircle className="w-4 h-4" /> New Opportunity
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {OPPORTUNITY_FILTER_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              activeTab === t.key ? "btn-primary border-primary shadow-sm" : "border-border bg-background text-foreground hover:bg-muted/60"
            }`}
          >
            {t.label} ({tabCounts[t.key]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground rounded-xl border border-border bg-card">Loading...</div>
      ) : displayedOpps.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground rounded-xl border border-border bg-card">No opportunities match this filter.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayedOpps.map((o) => (
            <div
              key={o.id}
              role="button"
              tabIndex={0}
              onClick={() => setDetailOppId(o.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setDetailOppId(o.id);
                }
              }}
              className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow text-left cursor-pointer flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="p-4 border-b border-border/80 flex items-start justify-between gap-2">
                <h3 className="font-bold text-foreground leading-snug line-clamp-2">{o.client_name || "Opportunity"}</h3>
                <BucketBadge o={o} />
              </div>
              <div className="p-4 space-y-2 text-sm flex-1">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground font-medium">Type</span>
                  <span className="font-semibold text-foreground text-right">{labelOpportunityTypeShort(o.opportunity_type)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground font-medium">Client type</span>
                  <span className="font-semibold text-foreground text-right capitalize">{o.client_type || "—"}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground font-medium">Date</span>
                  <span className="font-semibold text-foreground text-right">
                    {o.opportunity_date ? new Date(o.opportunity_date).toLocaleDateString() : "—"}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground font-medium">Specialist</span>
                  <span className="font-semibold text-foreground text-right line-clamp-2">{o.specialist_display_name || o.specialist_username || "—"}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground font-medium">Created by</span>
                  <span className="font-semibold text-foreground text-right text-xs break-all">{o.created_by_email || o.created_by_username || "—"}</span>
                </div>
              </div>
              <div className="px-4 pb-3">
                <div className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Current dept:</span> —
                </div>
              </div>
              <div className="px-4 pb-4 flex flex-wrap gap-2 border-t border-border pt-3" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted/60"
                  onClick={() => {
                    setDetailOppId(o.id);
                    setAutoPrintRequest((n) => n + 1);
                  }}
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <InvestmentOpportunityDetailModal
        opportunityId={detailOppId}
        onClose={() => setDetailOppId(null)}
        autoPrintRequest={autoPrintRequest}
        onAutoPrintDone={() => setAutoPrintRequest(0)}
      />

      {showNew && token && (
        <NewOpportunityModal
          token={token}
          departmentType={departmentType}
          onClose={() => setShowNew(false)}
          onCreated={async () => {
            setShowNew(false);
            await load();
          }}
        />
      )}
    </div>
  );
}

export function InvestmentOpportunitiesTabWithFocus({
  focusOpportunityId,
  onFocused,
  departmentType = "investment",
}: {
  focusOpportunityId?: string | null;
  onFocused?: () => void;
  departmentType?: "investment" | "franchise";
}) {
  return <InvestmentOpportunitiesTab focusOpportunityId={focusOpportunityId} onFocused={onFocused} departmentType={departmentType} />;
}

function NewOpportunityModal({
  token,
  departmentType,
  onClose,
  onCreated,
}: {
  token: string;
  departmentType: "investment" | "franchise";
  onClose: () => void;
  onCreated: () => void;
}) {
  const [regions, setRegions] = useState<Array<{ id: string; name: string }>>([]);
  const [cities, setCities] = useState<Array<{ id: string; name: string }>>([]);

  const loadRegions = async () => {
    const list = await investmentWorkflowAPI.listRegions();
    setRegions(list);
  };

  const [clients, setClients] = useState<any[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [showNewClient, setShowNewClient] = useState(false);
  const [saving, setSaving] = useState(false);

  const [specialistQuery, setSpecialistQuery] = useState("");
  const [specialistOptions, setSpecialistOptions] = useState<any[]>([]);
  const [specialistDepartment, setSpecialistDepartment] = useState<Department | "">("");
  const [selectedSpecialistId, setSelectedSpecialistId] = useState("");

  const [form, setForm] = useState({
    opportunityDate: new Date().toISOString().slice(0, 10),
    opportunityType: "",
    region: "",
    city: "",
    district: "",
    street: "",
    streetType: "",
    stationNameIfExists: "",
    locationStatus: "",
    areaM2: "",
    frontageM: "",
    depthM: "",
    locationUrl: "",
    issuedLicenses: "",
    pendingLicenses: "",
    notes: "",
  });

  const [attachments, setAttachments] = useState<Record<AttachmentKind, File | null>>(() => {
    const base: any = {};
    ATTACHMENT_KINDS.forEach((k) => (base[k.kind] = null));
    return base;
  });
  const [otherFiles, setOtherFiles] = useState<File[]>([]);
  const [attachmentPreview, setAttachmentPreview] = useState<{ file: File; label: string } | null>(null);

  const loadClients = async () => {
    const list = await investmentWorkflowAPI.listClients(clientSearch);
    setClients(list);
  };

  useEffect(() => {
    void loadRegions();
    void loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const run = async () => {
      const regionName = form.region.trim();
      if (!regionName) {
        setCities([]);
        setForm((p: any) => ({ ...p, city: "" }));
        return;
      }
      const region = regions.find((r) => r.name === regionName);
      if (!region?.id) {
        setCities([]);
        return;
      }
      const list = await investmentWorkflowAPI.listCities(region.id);
      setCities(list);
      // Reset city if it no longer exists
      if (form.city && !list.some((c) => c.name === form.city)) {
        setForm((p: any) => ({ ...p, city: "" }));
      }
    };
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.region, regions]);


  useEffect(() => {
    const t = setTimeout(() => void loadClients(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSearch]);

  useEffect(() => {
    const run = async () => {
      if (!specialistDepartment) {
        setSpecialistOptions([]);
        setSelectedSpecialistId("");
        return;
      }
      const q = specialistQuery.trim();
      // Allow blank search: show first N users for the selected department.
      const list = await usersAPI.search(q, 50, specialistDepartment as Department);
      setSpecialistOptions(list);
    };
    const t = setTimeout(() => void run(), 250);
    return () => clearTimeout(t);
  }, [specialistQuery, specialistDepartment]);

  const set = (k: string, v: string) => setForm((p: any) => ({ ...p, [k]: v }));

  const onSave = async () => {
    if (!form.opportunityType || !selectedClientId) {
      alert("Opportunity Type and Client are required.");
      return;
    }
    if (!specialistDepartment || !selectedSpecialistId) {
      alert("Investment Specialist department and assigned user are required.");
      return;
    }
    setSaving(true);
    try {
      const uploaded: Array<{ kind: string; fileName: string; fileUrl: string }> = [];
      for (const { kind } of ATTACHMENT_KINDS) {
        const file = attachments[kind];
        if (!file) continue;
        const url = await uploadFile(token, file);
        uploaded.push({ kind, fileName: file.name, fileUrl: url });
      }
      for (const file of otherFiles) {
        const url = await uploadFile(token, file);
        uploaded.push({ kind: "other", fileName: file.name, fileUrl: url });
      }

      await investmentWorkflowAPI.createOpportunity({
        opportunityDate: form.opportunityDate,
        opportunityType: form.opportunityType,
        clientId: selectedClientId,
        region: form.region,
        city: form.city,
        district: form.district,
        street: form.street,
        streetType: form.streetType,
        stationNameIfExists: form.stationNameIfExists,
        locationStatus: form.locationStatus,
        areaM2: form.areaM2 ? Number(form.areaM2) : null,
        frontageM: form.frontageM ? Number(form.frontageM) : null,
        depthM: form.depthM ? Number(form.depthM) : null,
        locationUrl: form.locationUrl,
        issuedLicenses: form.issuedLicenses,
        pendingLicenses: form.pendingLicenses,
        investmentSpecialistUserId: selectedSpecialistId,
        notes: form.notes,
        attachments: uploaded,
      }, departmentType);

      await onCreated();
    } catch (e: any) {
      alert(String(e?.message || "Failed to save"));
    } finally {
      setSaving(false);
    }
  };

  const fixedAttachmentKinds = ATTACHMENT_KINDS.filter((k) => k.kind !== "other");
  const filledAttachmentSlots =
    fixedAttachmentKinds.filter((k) => attachments[k.kind]).length + otherFiles.length;

  return (
    <>
      {attachmentPreview ? (
        <AttachmentPreviewModal
          file={attachmentPreview.file}
          label={attachmentPreview.label}
          onClose={() => setAttachmentPreview(null)}
        />
      ) : null}
      <ModalShell title="New Opportunity" onClose={onClose}>
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-sm font-bold text-foreground">Basic Information</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Opportunity Date" required>
              <input type="date" value={form.opportunityDate} onChange={(e) => set("opportunityDate", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Opportunity Type" required>
              <select value={form.opportunityType} onChange={(e) => set("opportunityType", e.target.value)} className={selectCls}>
                <option value="">Select type</option>
                {OPPORTUNITY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-foreground">Client Information</p>
              <p className="text-xs text-muted-foreground">Select client or add a new client.</p>
            </div>
            <button type="button" onClick={() => setShowNewClient(true)} className="px-4 py-2 rounded-lg text-xs font-bold border border-border bg-background hover:bg-muted">
              New Client
            </button>
          </div>

          <Field label="Select Client" required>
            <div className="space-y-2">
              <input value={clientSearch} onChange={(e) => setClientSearch(e.target.value)} className={inputCls} placeholder="Search client..." />
              <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)} className={selectCls}>
                <option value="">Select client...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · {c.id_cr_number} · {c.client_type}
                  </option>
                ))}
              </select>
            </div>
          </Field>
        </section>

        <section className="space-y-4">
          <p className="text-sm font-bold text-foreground">Location Information</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Region">
              <select value={form.region} onChange={(e) => set("region", e.target.value)} className={selectCls}>
                <option value="">Select region</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="City">
              <select
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className={selectCls}
                disabled={!form.region}
              >
                <option value="">{form.region ? "Select city" : "Select region first"}</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="District">
              <input value={form.district} onChange={(e) => set("district", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Street">
              <input value={form.street} onChange={(e) => set("street", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Street Type">
              <select value={form.streetType} onChange={(e) => set("streetType", e.target.value)} className={selectCls}>
                <option value="">Select</option>
                {STREET_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Station Name if exists">
              <input value={form.stationNameIfExists} onChange={(e) => set("stationNameIfExists", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Location Status">
              <select value={form.locationStatus} onChange={(e) => set("locationStatus", e.target.value)} className={selectCls}>
                <option value="">Select</option>
                {LOCATION_STATUS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Area (m²)">
              <input value={form.areaM2} onChange={(e) => set("areaM2", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Frontage (m)">
              <input value={form.frontageM} onChange={(e) => set("frontageM", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Depth (m)">
              <input value={form.depthM} onChange={(e) => set("depthM", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Location URL">
              <input value={form.locationUrl} onChange={(e) => set("locationUrl", e.target.value)} className={inputCls} placeholder="https://maps.google.com/..." />
            </Field>
            <Field label="Issued Licenses">
              <input value={form.issuedLicenses} onChange={(e) => set("issuedLicenses", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Pending Licenses">
              <input value={form.pendingLicenses} onChange={(e) => set("pendingLicenses", e.target.value)} className={inputCls} />
            </Field>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold text-foreground">Attachments</p>
            {filledAttachmentSlots > 0 ? (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <FileCheck className="w-3.5 h-3.5" />
                {filledAttachmentSlots} file{filledAttachmentSlots === 1 ? "" : "s"} selected
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">No files selected yet</span>
            )}
          </div>
          <div className="rounded-xl border border-border bg-background overflow-hidden">
            <div className="divide-y divide-border">
              {fixedAttachmentKinds.map((k) => {
                const file = attachments[k.kind];
                const hasFile = Boolean(file);
                return (
                  <div
                    key={k.kind}
                    className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 ${hasFile ? "bg-emerald-500/[0.06]" : ""}`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${hasFile ? "bg-emerald-500/15" : "bg-muted"}`}
                      >
                        {hasFile ? <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Upload className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold ${hasFile ? "text-emerald-800 dark:text-emerald-300" : "text-foreground"}`}>{k.label}</p>
                        {hasFile && file ? (
                          <p className="text-xs text-muted-foreground truncate mt-0.5" title={file.name}>
                            {file.name}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-0.5">No file selected</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap sm:justify-end">
                      {hasFile && file ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setAttachmentPreview({ file, label: k.label })}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-primary/5 hover:border-primary/40 text-sm font-semibold"
                          >
                            <Eye className="w-4 h-4 text-primary" />
                            Review
                          </button>
                          <button
                            type="button"
                            onClick={() => setAttachments((p) => ({ ...p, [k.kind]: null }))}
                            className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 hover:border-destructive/30 text-destructive"
                            title="Remove file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : null}
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted cursor-pointer text-sm font-semibold">
                        <Upload className="w-4 h-4" />
                        {hasFile ? "Replace" : "Upload"}
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const next = e.target.files?.[0] || null;
                            setAttachments((p) => ({ ...p, [k.kind]: next }));
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
              <div className="px-4 py-3 space-y-3">
                <p className="text-sm font-semibold text-foreground">Other</p>
                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted cursor-pointer text-sm font-semibold w-fit">
                  <Upload className="w-4 h-4" /> Add Other File
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setOtherFiles((p) => [...p, file]);
                      e.target.value = "";
                    }}
                  />
                </label>
                {otherFiles.length > 0 ? (
                  <ul className="space-y-2">
                    {otherFiles.map((f, idx) => (
                      <li
                        key={`${f.name}-${idx}-${f.lastModified}`}
                        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-border bg-emerald-500/[0.06] px-3 py-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-sm font-medium truncate" title={f.name}>
                            {f.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setAttachmentPreview({ file: f, label: "Other" })}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-primary/5 text-sm font-semibold"
                          >
                            <Eye className="w-4 h-4 text-primary" />
                            Review
                          </button>
                          <button
                            type="button"
                            onClick={() => setOtherFiles((p) => p.filter((_, i) => i !== idx))}
                            className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-destructive"
                            title="Remove file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">Optional additional documents.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-sm font-bold text-foreground">Investment Specialist</p>
            <p className="text-xs text-muted-foreground mt-1">
              Person who brought this opportunity (shown in the table only; feasibility is completed by department managers).
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Select Department" required>
              <select
                value={specialistDepartment}
                onChange={(e) => {
                  setSpecialistDepartment(e.target.value as any);
                  setSpecialistQuery("");
                  setSelectedSpecialistId("");
                }}
                className={selectCls}
              >
                <option value="">Select department...</option>
                {departmentOptions.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Select User" required>
              <div className="space-y-2">
                <input
                  value={specialistQuery}
                  onChange={(e) => setSpecialistQuery(e.target.value)}
                  className={inputCls}
                  placeholder={specialistDepartment ? "Search user..." : "Select department first"}
                  disabled={!specialistDepartment}
                />
                <select
                  value={selectedSpecialistId}
                  onChange={(e) => setSelectedSpecialistId(e.target.value)}
                  className={selectCls}
                  disabled={!specialistDepartment}
                >
                  <option value="">{specialistDepartment ? "Select user..." : "Select department first"}</option>
                  {specialistOptions.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.username} · {u.role}
                    </option>
                  ))}
                </select>
              </div>
            </Field>
          </div>
        </section>

        <section className="space-y-2">
          <p className="text-sm font-bold text-foreground">Notes</p>
          <textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} className={`${inputCls} min-h-[90px]`} />
        </section>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-border bg-background hover:bg-muted text-sm font-semibold">
            Cancel
          </button>
          <button type="button" disabled={saving} onClick={() => void onSave()} className="btn-primary px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {showNewClient && (
        <NewClientModal
          onClose={() => setShowNewClient(false)}
          onCreated={async (clientId) => {
            setShowNewClient(false);
            await loadClients();
            setSelectedClientId(clientId);
          }}
        />
      )}
    </ModalShell>
    </>
  );
}

function NewClientModal({ onClose, onCreated }: { onClose: () => void; onCreated: (id: string) => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    idCrNumber: "",
    clientType: "individual",
    phone: "",
    contactPersonName: "",
    contactPersonMobile: "",
    email: "",
    address: "",
    note: "",
  });
  const set = (k: string, v: string) => setForm((p: any) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.name.trim() || !form.idCrNumber.trim() || !form.clientType) {
      alert("Client name, ID/CR number, and client type are required.");
      return;
    }
    setSaving(true);
    try {
      const created = await investmentWorkflowAPI.createClient(form);
      onCreated(created.id);
    } catch (e: any) {
      alert(String(e?.message || "Failed to create client"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell title="New Client" onClose={onClose}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Client Name" required>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
          </Field>
          <Field label="ID/CR Number" required>
            <input value={form.idCrNumber} onChange={(e) => set("idCrNumber", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Client Type" required>
            <select value={form.clientType} onChange={(e) => set("clientType", e.target.value)} className={selectCls}>
              <option value="individual">Individual</option>
              <option value="establishment">Establishment</option>
              <option value="company">Company</option>
            </select>
          </Field>
          <Field label="Phone Number">
            <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Contact Person Name">
            <input value={form.contactPersonName} onChange={(e) => set("contactPersonName", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Contact Person Mobile">
            <input value={form.contactPersonMobile} onChange={(e) => set("contactPersonMobile", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Email">
            <input value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Client Address">
            <input value={form.address} onChange={(e) => set("address", e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="Note">
          <textarea rows={3} value={form.note} onChange={(e) => set("note", e.target.value)} className={`${inputCls} min-h-[90px]`} />
        </Field>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-border bg-background hover:bg-muted text-sm font-semibold">
            Cancel
          </button>
          <button type="button" disabled={saving} onClick={() => void save()} className="btn-primary px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

