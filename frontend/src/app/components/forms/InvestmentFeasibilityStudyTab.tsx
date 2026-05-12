import { useEffect, useMemo, useState } from "react";
import { PlusCircle, X, Upload, Download, Eye, FileCheck, Trash2, ExternalLink, FileText, Calculator, CheckCircle2, ClipboardPenLine } from "lucide-react";
import { investmentWorkflowAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { canWriteFeasibilityStudy, eligibleOpportunitiesForNewStudy } from "@/utils/investmentPermissions";
import { computeStudyFinancials, fmtStudyNumber } from "@/utils/investmentStudyMetrics";
import { InvestmentStudyDetailModal, toInvestmentFileHref } from "@/app/components/forms/InvestmentWorkflowDetailModals";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

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

const DEFAULT_STUDY_STATUS = "Initial";

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

function isPdfFile(file: File) {
  return file.type === "application/pdf";
}

function StudyAttachmentPreviewModal({ file, label, onClose }: { file: File; label: string; onClose: () => void }) {
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
              <a href={objectUrl} download={file.name} className="btn-primary px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold">
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
      <div className="w-full max-w-6xl bg-card rounded-2xl border border-border shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
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

const PROPERTY_UNITS = [
  "Supermarket",
  "Brand Restaurant",
  "Commercial Shop",
  "DriveThru",
  "Kiosk",
  "Car Services Internal",
  "Car Wash",
  "ATM",
  "Other",
];

type StudyFilterTab = "all" | "draft" | "submitted";

export function InvestmentFeasibilityStudyTab({
  departmentType = "investment",
}: {
  departmentType?: "investment" | "franchise";
}) {
  const { token, user } = useAuth();
  const [studies, setStudies] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [studyTab, setStudyTab] = useState<StudyFilterTab>("all");
  const [detailStudyId, setDetailStudyId] = useState<string | null>(null);

  const canCreate = canWriteFeasibilityStudy(user, opportunities);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [studyList, oppList] = await Promise.all([
        investmentWorkflowAPI.listStudies(departmentType),
        investmentWorkflowAPI.listOpportunities(departmentType),
      ]);
      setStudies(studyList);
      setOpportunities(oppList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [token, departmentType]);

  const tabCounts = useMemo(() => {
    return {
      all: studies.length,
      draft: studies.filter((s) => String(s.status) === "draft").length,
      submitted: studies.filter((s) => String(s.status) === "submitted_to_committee").length,
    };
  }, [studies]);

  const displayedStudies = useMemo(() => {
    if (studyTab === "all") return studies;
    if (studyTab === "draft") return studies.filter((s) => String(s.status) === "draft");
    return studies.filter((s) => String(s.status) === "submitted_to_committee");
  }, [studies, studyTab]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {departmentType === "franchise" ? "Franchise Feasibility Studies" : "Feasibility Studies"}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">{studies.length} studies</p>
        </div>
        {canCreate && (
          <button type="button" onClick={() => setShowNew(true)} className="btn-primary px-5 py-2.5 rounded-lg text-sm font-semibold inline-flex items-center gap-2 shadow-md">
            <PlusCircle className="w-4 h-4" /> New Study
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: "all" as const, label: "All" },
            { key: "draft" as const, label: "Initial" },
            { key: "submitted" as const, label: "Submitted" },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setStudyTab(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              studyTab === t.key ? "btn-primary border-primary shadow-sm" : "border-border bg-background hover:bg-muted/60"
            }`}
          >
            {t.label} ({tabCounts[t.key]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground rounded-xl border border-border bg-card">Loading...</div>
      ) : displayedStudies.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground rounded-xl border border-border bg-card">No studies match this filter.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayedStudies.map((s) => {
            const fin = computeStudyFinancials(s);
            const submitted = String(s.status) === "submitted_to_committee";
            const fileHref = toInvestmentFileHref(s.first_attachment_url);
            return (
              <div
                key={s.id}
                role="button"
                tabIndex={0}
                onClick={() => setDetailStudyId(String(s.id))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setDetailStudyId(String(s.id));
                  }
                }}
                className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer text-left flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="p-4 border-b border-border/80 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Calculator className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-foreground leading-snug line-clamp-2">{s.client_name || "Study"}</h3>
                    <div className="mt-2">
                      {submitted ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Submitted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 text-sky-800 dark:text-sky-300 px-2 py-0.5 text-[11px] font-bold">
                          <ClipboardPenLine className="w-3 h-3" /> Initial
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3 flex-1 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground font-medium">Expected intervention</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{fmtStudyNumber(fin.expectedNetIncomeMin)}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground font-medium">Annual rent</span>
                    <span className="font-bold text-red-600 dark:text-red-400">{fmtStudyNumber(fin.annualRent)}</span>
                  </div>
                </div>
                <div className="px-4 pb-4 border-t border-border pt-3">
                  {fileHref ? (
                    <a
                      href={fileHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye className="w-4 h-4" /> View file
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">No attachment</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <InvestmentStudyDetailModal
        studyId={detailStudyId}
        onClose={() => setDetailStudyId(null)}
        onSubmitted={() => void load()}
      />

      {showNew && token && (
        <NewStudyModal
          token={token}
          departmentType={departmentType}
          selectableOpportunities={eligibleOpportunitiesForNewStudy(user, opportunities)}
          onClose={() => setShowNew(false)}
          onSaved={async () => {
            setShowNew(false);
            await load();
          }}
        />
      )}
    </div>
  );
}

function NewStudyModal({
  token,
  departmentType,
  selectableOpportunities,
  onClose,
  onSaved,
}: {
  token: string;
  departmentType: "investment" | "franchise";
  selectableOpportunities: any[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [opportunityId, setOpportunityId] = useState("");
  const [initialAgreementNotes, setInitialAgreementNotes] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<File | null>(null);

  const [propertyRows, setPropertyRows] = useState(() =>
    PROPERTY_UNITS.map((name) => ({
      unitType: name,
      expectedUnitAreaM2: "",
      numberOfUnits: "",
      pricePerM2Min: "",
      pricePerM2Max: "",
    }))
  );

  const [productSales, setProductSales] = useState({
    product91: { salesMinL: "", avgSalesL: "", salesMaxL: "", margin: "0.06" },
    product95: { salesMinL: "", avgSalesL: "", salesMaxL: "", margin: "0.06" },
    diesel1: { salesMinL: "", avgSalesL: "", salesMaxL: "", margin: "0.06" },
    diesel2: { salesMinL: "", avgSalesL: "", salesMaxL: "", margin: "0.06" },
  });

  const [expenses, setExpenses] = useState({ workers: "", utilities: "", transport: "", other: "" });
  const [finalResult, setFinalResult] = useState({ annualRentAmount: "" });

  const parseNum = (v: any) => {
    const n = Number(String(v ?? "").trim());
    return Number.isFinite(n) ? n : 0;
  };

  const productProfitTotals = useMemo(() => {
    const keys = ["product91", "product95", "diesel1", "diesel2"] as const;
    let min = 0;
    let avg = 0;
    let max = 0;
    for (const key of keys) {
      const row = (productSales as any)[key] || {};
      const margin = parseNum(row.margin);
      min += parseNum(row.salesMinL) * margin;
      avg += parseNum(row.avgSalesL) * margin;
      max += parseNum(row.salesMaxL) * margin;
    }
    return { min, avg, max };
  }, [productSales]);

  const expensesTotal = useMemo(() => {
    return (
      parseNum(expenses.workers)
      + parseNum(expenses.utilities)
      + parseNum(expenses.transport)
      + parseNum(expenses.other)
    );
  }, [expenses]);

  const annualRent = useMemo(() => parseNum(finalResult.annualRentAmount), [finalResult.annualRentAmount]);

  const computedRows = useMemo(() => {
    return propertyRows.map((r) => {
      const expectedUnitArea = parseNum(r.expectedUnitAreaM2);
      const units = parseNum(r.numberOfUnits);
      const totalArea = expectedUnitArea * units;
      const priceMin = parseNum(r.pricePerM2Min);
      const priceMax = parseNum(r.pricePerM2Max);
      const totalRentMin = totalArea * priceMin;
      const totalRentMax = totalArea * priceMax;
      return {
        ...r,
        totalAreaM2: totalArea,
        totalRentMin,
        totalRentMax,
      };
    });
  }, [propertyRows]);

  const totals = useMemo(() => {
    return computedRows.reduce(
      (acc, r) => {
        acc.totalAreaM2 += Number(r.totalAreaM2 || 0);
        acc.totalRentMin += Number(r.totalRentMin || 0);
        acc.totalRentMax += Number(r.totalRentMax || 0);
        return acc;
      },
      { totalAreaM2: 0, totalRentMin: 0, totalRentMax: 0 },
    );
  }, [computedRows]);

  const expectedPropertyIncome = useMemo(() => ({ rows: computedRows }), [computedRows]);

  const finalResultComputed = useMemo(() => {
    const propertyMin = totals.totalRentMin;
    const productsMin = productProfitTotals.min;
    const result = propertyMin + productsMin - expensesTotal;
    const expectedNetIncomeMin = result - annualRent;
    return { propertyMin, productsMin, result, expectedNetIncomeMin };
  }, [totals.totalRentMin, productProfitTotals.min, expensesTotal, annualRent]);

  const fmt = (n: any) => {
    const num = Number(n);
    if (!Number.isFinite(num)) return "0";
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const onSaveDraft = async () => {
    if (!opportunityId) {
      alert("Select Investment Opportunity.");
      return;
    }
    setSaving(true);
    try {
      const uploaded: any[] = [];
      if (attachment) {
        const url = await uploadFile(token, attachment);
        uploaded.push({ fileName: attachment.name, fileUrl: url });
      }
      await investmentWorkflowAPI.saveStudy({
        opportunityId,
        studyStatus: DEFAULT_STUDY_STATUS,
        expectedPropertyIncome,
        productSales,
        expenses,
        finalResult,
        initialAgreementNotes,
        attachments: uploaded,
      }, departmentType);
      await onSaved();
    } catch (e: any) {
      alert(String(e?.message || "Failed to save"));
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = async () => {
    if (!opportunityId) {
      alert("Select Investment Opportunity.");
      return;
    }
    setSubmitting(true);
    try {
      const uploaded: any[] = [];
      if (attachment) {
        const url = await uploadFile(token, attachment);
        uploaded.push({ fileName: attachment.name, fileUrl: url });
      }
      const saved = await investmentWorkflowAPI.saveStudy({
        opportunityId,
        studyStatus: DEFAULT_STUDY_STATUS,
        expectedPropertyIncome,
        productSales,
        expenses,
        finalResult,
        initialAgreementNotes,
        attachments: uploaded,
      }, departmentType);
      await investmentWorkflowAPI.submitStudy(saved.id, departmentType);
      await onSaved();
    } catch (e: any) {
      alert(String(e?.message || "Failed to submit"));
    } finally {
      setSubmitting(false);
    }
  };

  const updateRow = (idx: number, key: string, value: string) => {
    setPropertyRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [key]: value } : r)));
  };

  return (
    <>
      {attachmentPreview ? (
        <StudyAttachmentPreviewModal file={attachmentPreview} label="Attachment" onClose={() => setAttachmentPreview(null)} />
      ) : null}
      <ModalShell title="New Study" onClose={onClose}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-4">
          <Field label="Investment Opportunity (search here)" required>
            <select
              value={opportunityId}
              onChange={(e) => setOpportunityId(e.target.value)}
              className={selectCls}
              disabled={selectableOpportunities.length === 0}
            >
              <option value="">Search and select...</option>
              {selectableOpportunities.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.client_name} · {String(o.opportunity_type || "").toUpperCase()} · {o.city || "-"}
                </option>
              ))}
            </select>
            {selectableOpportunities.length === 0 ? (
              <p className="text-xs text-muted-foreground mt-2">
                You do not have any opportunities assigned to you as investment specialist. Only assigned specialists can add a study.
              </p>
            ) : null}
          </Field>
        </div>

        <section className="space-y-3">
          <p className="text-sm font-bold text-foreground">1. Expected Property Income</p>
          <div className="rounded-xl border border-border overflow-auto">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left px-3 py-2 font-bold">Unit Type</th>
                  <th className="text-left px-3 py-2 font-bold">Expected Unit Area (m²)</th>
                  <th className="text-left px-3 py-2 font-bold">Number of Units</th>
                  <th className="text-left px-3 py-2 font-bold">Total Area (m²)</th>
                  <th className="text-left px-3 py-2 font-bold">Price/m² Min</th>
                  <th className="text-left px-3 py-2 font-bold">Price/m² Max</th>
                  <th className="text-left px-3 py-2 font-bold">Total Rent Min</th>
                  <th className="text-left px-3 py-2 font-bold">Total Rent Max</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {computedRows.map((r, idx) => (
                  <tr key={r.unitType}>
                    <td className="px-3 py-2">{r.unitType}</td>
                    <td className="px-3 py-2">
                      <input
                        value={propertyRows[idx]?.expectedUnitAreaM2 ?? ""}
                        onChange={(e) => updateRow(idx, "expectedUnitAreaM2", e.target.value)}
                        className="w-full px-2 py-1.5 border border-border rounded-md bg-background"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={propertyRows[idx]?.numberOfUnits ?? ""}
                        onChange={(e) => updateRow(idx, "numberOfUnits", e.target.value)}
                        className="w-full px-2 py-1.5 border border-border rounded-md bg-background"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={String(r.totalAreaM2 ?? 0)}
                        readOnly
                        className="w-full px-2 py-1.5 border border-border rounded-md bg-muted text-foreground"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={propertyRows[idx]?.pricePerM2Min ?? ""}
                        onChange={(e) => updateRow(idx, "pricePerM2Min", e.target.value)}
                        className="w-full px-2 py-1.5 border border-border rounded-md bg-background"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={propertyRows[idx]?.pricePerM2Max ?? ""}
                        onChange={(e) => updateRow(idx, "pricePerM2Max", e.target.value)}
                        className="w-full px-2 py-1.5 border border-border rounded-md bg-background"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={String(r.totalRentMin ?? 0)}
                        readOnly
                        className="w-full px-2 py-1.5 border border-border rounded-md bg-muted text-foreground"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={String(r.totalRentMax ?? 0)}
                        readOnly
                        className="w-full px-2 py-1.5 border border-border rounded-md bg-muted text-foreground"
                      />
                    </td>
                  </tr>
                ))}

                <tr className="bg-yellow-50">
                  <td colSpan={3} className="px-3 py-3 text-center font-bold text-foreground">
                    Totals
                  </td>
                  <td className="px-3 py-3 font-bold text-foreground text-center">{totals.totalAreaM2}</td>
                  <td colSpan={2} className="px-3 py-3" />
                  <td className="px-3 py-3 font-bold text-foreground text-center">{totals.totalRentMin}</td>
                  <td className="px-3 py-3 font-bold text-foreground text-center">{totals.totalRentMax}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-bold text-foreground">2. Product Sales</p>
          <div className="space-y-3">
            {[
              ["Product 91", "product91"],
              ["Product 95", "product95"],
              ["Diesel Product", "diesel1"],
              ["Diesel Product", "diesel2"],
            ].map(([label, key]) => (
              <div key={key} className="rounded-xl border border-border bg-muted/10 p-4">
                <p className="font-semibold text-foreground mb-3">{label}</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Field label="Sales Min (L)">
                    <input value={(productSales as any)[key].salesMinL} onChange={(e) => setProductSales((p) => ({ ...p, [key]: { ...(p as any)[key], salesMinL: e.target.value } }))} className={inputCls} />
                  </Field>
                  <Field label="Avg Sales (L)">
                    <input value={(productSales as any)[key].avgSalesL} onChange={(e) => setProductSales((p) => ({ ...p, [key]: { ...(p as any)[key], avgSalesL: e.target.value } }))} className={inputCls} />
                  </Field>
                  <Field label="Sales Max (L)">
                    <input value={(productSales as any)[key].salesMaxL} onChange={(e) => setProductSales((p) => ({ ...p, [key]: { ...(p as any)[key], salesMaxL: e.target.value } }))} className={inputCls} />
                  </Field>
                  <Field label="Margin (Halalah/L)">
                    <input value={(productSales as any)[key].margin} onChange={(e) => setProductSales((p) => ({ ...p, [key]: { ...(p as any)[key], margin: e.target.value } }))} className={inputCls} />
                  </Field>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 mt-4">
            <p className="text-sm font-bold text-foreground">Total Annual Product Profit (SAR)</p>
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground font-semibold">Minimum</p>
                <p className="text-lg font-black text-emerald-700">{productProfitTotals.min}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">Average</p>
                <p className="text-lg font-black text-emerald-700">{productProfitTotals.avg}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">Maximum</p>
                <p className="text-lg font-black text-emerald-700">{productProfitTotals.max}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-bold text-foreground">3. Expenses</p>
          <div className="rounded-xl border border-border bg-muted/10 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Workers"><input value={expenses.workers} onChange={(e) => setExpenses((p) => ({ ...p, workers: e.target.value }))} className={inputCls} /></Field>
              <Field label="Transport"><input value={expenses.transport} onChange={(e) => setExpenses((p) => ({ ...p, transport: e.target.value }))} className={inputCls} /></Field>
              <Field label="Utilities"><input value={expenses.utilities} onChange={(e) => setExpenses((p) => ({ ...p, utilities: e.target.value }))} className={inputCls} /></Field>
              <Field label="Other Expenses"><input value={expenses.other} onChange={(e) => setExpenses((p) => ({ ...p, other: e.target.value }))} className={inputCls} /></Field>
            </div>

            <div className="mt-4 rounded-lg border border-border bg-background px-4 py-3 flex items-center justify-between">
              <p className="text-sm font-bold text-foreground">Total Expenses:</p>
              <p className="text-lg font-black text-red-600">{fmt(expensesTotal)}</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-bold text-foreground">4. Final Result</p>
          <div className="rounded-xl border border-border bg-muted/10 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Annual Rent Amount">
                <input value={finalResult.annualRentAmount} onChange={(e) => setFinalResult((p) => ({ ...p, annualRentAmount: e.target.value }))} className={inputCls} />
              </Field>
              <div className="text-xs text-muted-foreground flex items-end">
                Result calculations can be added later; values are saved as entered.
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-border bg-background px-4 py-3 flex items-center justify-between">
              <p className="text-sm text-foreground">
                Result = Property (Min) + Products (Min) - Expenses
              </p>
              <p className="text-lg font-black text-foreground">{fmt(finalResultComputed.result)}</p>
            </div>

            <div className="mt-3 rounded-lg border border-emerald-500 bg-emerald-50 px-4 py-3 flex items-center justify-between">
              <p className="text-sm font-bold text-foreground">
                Expected Net Income (Min) = Result - Annual Rent
              </p>
              <p className="text-lg font-black text-emerald-700">{fmt(finalResultComputed.expectedNetIncomeMin)}</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-bold text-foreground">Attachment</p>
          <div className="rounded-xl border border-border bg-background p-4">
            {attachment ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-sm font-medium text-foreground truncate" title={attachment.name}>
                    {attachment.name}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setAttachmentPreview(attachment)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-primary/5 hover:border-primary/40 text-sm font-semibold"
                  >
                    <Eye className="w-4 h-4 text-primary" />
                    Review
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachmentPreview(null);
                      setAttachment(null);
                    }}
                    className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 hover:border-destructive/30 text-destructive"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted cursor-pointer text-sm font-semibold">
                    <Upload className="w-4 h-4" />
                    Replace
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setAttachment(f);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted cursor-pointer text-sm">
                <Upload className="w-4 h-4" /> Upload File (optional)
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    setAttachment(e.target.files?.[0] || null);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          </div>
        </section>

        <section className="space-y-2">
          <p className="text-sm font-bold text-foreground">Initial Agreement Notes</p>
          <textarea rows={3} value={initialAgreementNotes} onChange={(e) => setInitialAgreementNotes(e.target.value)} className={`${inputCls} min-h-[90px]`} />
        </section>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-border bg-background hover:bg-muted text-sm font-semibold">
            Cancel
          </button>
          <button
            type="button"
            disabled={saving || selectableOpportunities.length === 0 || !opportunityId}
            onClick={() => void onSaveDraft()}
            className="px-6 py-2.5 rounded-lg border border-border bg-background hover:bg-muted text-sm font-semibold disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            disabled={submitting || selectableOpportunities.length === 0 || !opportunityId}
            onClick={() => void onSubmit()}
            className="btn-primary px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send to Committee"}
          </button>
        </div>
      </div>
    </ModalShell>
    </>
  );
}

