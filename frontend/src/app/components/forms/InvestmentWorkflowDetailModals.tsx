import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { X, Printer, FileText, Eye, ClipboardList, ExternalLink, Upload, Trash2 } from "lucide-react";
import { investmentWorkflowAPI, usersAPI } from "@/services/api";
import { CEO_CONTRACT_DEPARTMENT_OPTIONS } from "@/app/constants/contractDepartments";
import { useAuth } from "@/context/AuthContext";
import { canSubmitStudyToCommittee, type WorkflowDepartmentType } from "@/utils/investmentPermissions";
import { computeStudyFinancials, computeProductProfitTotals, fmtStudyNumber, parseNum } from "@/utils/investmentStudyMetrics";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

function printSectionById(sectionId: string, title: string) {
  const source = document.getElementById(sectionId);
  if (!source) {
    window.print();
    return;
  }

  const printWindow = window.open("", "_blank", "width=1200,height=900,noopener,noreferrer");
  if (!printWindow) {
    window.print();
    return;
  }

  const styleTags = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((node) => node.outerHTML)
    .join("\n");

  printWindow.document.open();
  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        ${styleTags}
        <style>
          @page { margin: 10mm; }
          html, body { background: #fff !important; }
          body { margin: 0; }
          .print-root { width: 100%; }
          .print-root .overflow-auto { overflow: visible !important; }
          .print-root table { width: 100% !important; table-layout: fixed !important; }
          .print-root th, .print-root td { font-size: 11px !important; padding: 6px 4px !important; word-break: break-word; }
        </style>
      </head>
      <body>
        <div class="print-root">${source.innerHTML}</div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 200);
}

export function toInvestmentFileHref(url: unknown): string | null {
  const u = String(url || "").trim();
  if (!u) return null;
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("/")) return `${API_URL}${u}`;
  return `${API_URL}/${u}`;
}

const ATT_KIND_LABELS: Record<string, string> = {
  id_photo: "ID Photo",
  commercial_register: "Commercial Register",
  tax_number: "Tax Number",
  national_address: "National Address",
  deed: "Deed",
  licenses: "Licenses",
  certificates: "Certificates",
  contracts: "Contracts",
  other: "Other",
};

const PRODUCT_SALES_BLOCKS: [string, "product91" | "product95" | "diesel1" | "diesel2"][] = [
  ["Product 91", "product91"],
  ["Product 95", "product95"],
  ["Diesel Product", "diesel1"],
  ["Diesel Product", "diesel2"],
];

function labelOpportunityType(v: string) {
  const m: Record<string, string> = {
    rent: "Rent",
    operation: "Operation",
    investment: "Investment",
    ownership: "Ownership",
  };
  return m[String(v || "").toLowerCase()] || v || "—";
}

function labelStreetType(v: string) {
  const m: Record<string, string> = { main: "Main", secondary: "Secondary", neighbourhood: "Neighbourhood" };
  return m[String(v || "").toLowerCase()] || v || "—";
}

function labelLocationStatus(v: string) {
  const m: Record<string, string> = {
    ready: "Ready",
    underconstruction: "Under construction",
    renovation: "Renovation",
    land: "Land",
  };
  return m[String(v || "").toLowerCase()] || v || "—";
}

function labelClientType(v: string) {
  const m: Record<string, string> = { individual: "Individual", establishment: "Establishment", company: "Company" };
  return m[String(v || "").toLowerCase()] || v || "—";
}

function humanizeWorkflowKey(v: string) {
  const s = String(v || "").trim();
  if (!s) return "—";
  const m: Record<string, string> = {
    draft: "Draft",
    forwarded_to_specialist: "Forwarded to specialist",
    under_review: "Under review",
    submitted_to_committee: "Submitted to committee",
    approved: "Approved",
    rejected: "Rejected",
  };
  return m[s.toLowerCase()] || s.replace(/_/g, " ");
}

/** Workflow line: forwarded_to_specialist shows assignee from opportunity (study or opp status). */
function formatWorkflowStatusWithAssignee(workflowStatus: string, opportunity: Record<string, unknown> | null | undefined): string {
  const raw = String(workflowStatus || "").trim().toLowerCase();
  const opp = opportunity || {};
  const name =
    String(opp.specialist_display_name || "").trim() ||
    String(opp.specialist_username || "").trim() ||
    "";
  if (raw === "forwarded_to_specialist") {
    if (name) return `Forwarded to specialist (${name})`;
    return "Forwarded to specialist";
  }
  return humanizeWorkflowKey(String(workflowStatus || ""));
}

function formatShortDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = String(iso).slice(0, 10);
  if (d.length === 10) return d;
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return String(iso);
  }
}

function departmentCardClass(dept: string) {
  const u = String(dept || "").toLowerCase();
  if (u.includes("finance")) return "bg-cyan-500/10 border-cyan-500/25";
  if (u.includes("property")) return "bg-amber-500/12 border-amber-500/25";
  if (u.includes("project")) return "bg-fuchsia-500/10 border-fuchsia-500/25";
  if (u.includes("invest")) return "bg-emerald-500/12 border-emerald-500/25";
  return "bg-muted/40 border-border";
}

function opinionStatusPresentation(status: string | undefined) {
  const s = String(status || "").toLowerCase();
  if (s.includes("approv")) return { label: status || "Approved", cls: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100" };
  if (s.includes("reject") || s.includes("declin")) return { label: status || "Rejected", cls: "bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-100" };
  if (s.includes("pend") || s.includes("review")) return { label: status || "Pending", cls: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100" };
  return { label: status || "Recorded", cls: "bg-muted text-foreground" };
}

function parseOpinionPayload(payload: unknown): {
  status?: string;
  comment: string;
  manager?: string;
  extra: [string, string][];
} {
  if (payload == null) return { comment: "", extra: [] };
  if (typeof payload === "string") return { comment: payload, extra: [] };
  if (typeof payload !== "object") return { comment: String(payload), extra: [] };
  const p = payload as Record<string, unknown>;
  const status = [p.status, p.decision, p.approval].find((x) => x != null && String(x).trim() !== "") as string | undefined;
  const comment = [p.comment, p.notes, p.text, p.message, p.opinion, p.remarks]
    .find((x) => x != null && String(x).trim() !== "");
  const manager = [p.managerUsername, p.manager, p.manager_name, p.managerName].find((x) => x != null && String(x).trim() !== "") as string | undefined;
  const used = new Set([
    "status",
    "decision",
    "approval",
    "comment",
    "notes",
    "text",
    "message",
    "opinion",
    "remarks",
    "managerUsername",
    "manager",
    "manager_name",
    "managerName",
  ]);
  const extra: [string, string][] = [];
  for (const [k, v] of Object.entries(p)) {
    if (used.has(k)) continue;
    if (v === null || v === undefined || v === "") continue;
    if (typeof v === "object") continue;
    extra.push([k.replace(/_/g, " "), String(v)]);
  }
  return {
    status: status ? String(status) : undefined,
    comment: comment != null ? String(comment) : "",
    manager: manager ? String(manager) : undefined,
    extra,
  };
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 py-2 border-b border-border/60 text-sm">
      <span className="text-muted-foreground font-semibold shrink-0">{label}</span>
      <span className="text-foreground text-right sm:max-w-[65%] break-words">{value ?? "—"}</span>
    </div>
  );
}

function SectionCard({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-muted/10 p-4 space-y-2 ${className}`}>
      <p className="text-sm font-bold text-foreground">{title}</p>
      {children}
    </div>
  );
}

function ThreeColGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-1">{children}</div>;
}

function ReadonlyField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-1">{label}</p>
      <div className="w-full px-2 py-1.5 border border-border rounded-md bg-background text-sm text-foreground min-h-[2.25rem] flex items-center">{value ?? "—"}</div>
    </div>
  );
}

function ProductSalesReadonly({ product_sales }: { product_sales: Record<string, any> | null | undefined }) {
  const ps = product_sales || {};
  const totals = computeProductProfitTotals(ps);
  return (
    <section className="space-y-3">
      <p className="text-sm font-bold text-foreground">2. Product Sales</p>
      <div className="space-y-3">
        {PRODUCT_SALES_BLOCKS.map(([label, key]) => {
          const row = ps[key] || {};
          return (
            <div key={key} className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
              <p className="font-semibold text-foreground mb-3 bg-emerald-500/10 -mx-4 -mt-4 px-4 py-2 rounded-t-xl border-b border-emerald-500/15">{label}</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <ReadonlyField label="Sales Min (L)" value={row.salesMinL ?? "—"} />
                <ReadonlyField label="Avg Sales (L)" value={row.avgSalesL ?? "—"} />
                <ReadonlyField label="Sales Max (L)" value={row.salesMaxL ?? "—"} />
                <ReadonlyField label="Margin (Halalah/L)" value={row.margin ?? "—"} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="rounded-xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800 p-5">
        <p className="text-sm font-bold text-foreground">Total Annual Product Profit (SAR)</p>
        <div className="grid grid-cols-3 gap-3 mt-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground font-semibold">Minimum</p>
            <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">{fmtStudyNumber(totals.min)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">Average</p>
            <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">{fmtStudyNumber(totals.avg)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">Maximum</p>
            <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">{fmtStudyNumber(totals.max)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpensesReadonly({ expenses }: { expenses: Record<string, unknown> | null | undefined }) {
  const exp = expenses || {};
  const total = parseNum(exp.workers) + parseNum(exp.utilities) + parseNum(exp.transport) + parseNum(exp.other);
  return (
    <section className="space-y-3">
      <p className="text-sm font-bold text-rose-900 dark:text-rose-200">3. Expenses</p>
      <div className="rounded-xl border border-rose-200/80 bg-rose-50/80 dark:bg-rose-950/20 dark:border-rose-900/50 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ReadonlyField label="Workers" value={String(exp.workers ?? "") || "—"} />
          <ReadonlyField label="Transport" value={String(exp.transport ?? "") || "—"} />
          <ReadonlyField label="Utilities" value={String(exp.utilities ?? "") || "—"} />
          <ReadonlyField label="Other Expenses" value={String(exp.other ?? "") || "—"} />
        </div>
        <div className="mt-4 rounded-lg border border-border bg-background px-4 py-3 flex items-center justify-between">
          <p className="text-sm font-bold text-foreground">Total Expenses:</p>
          <p className="text-lg font-black text-red-600 dark:text-red-400">{fmtStudyNumber(total)}</p>
        </div>
      </div>
    </section>
  );
}

function FinalResultReadonly({ study }: { study: any }) {
  const fin = computeStudyFinancials(study);
  const annual = String(study?.final_result?.annualRentAmount ?? "").trim() || "—";
  return (
    <section className="space-y-3">
      <p className="text-sm font-bold text-violet-900 dark:text-violet-200">4. Final Result</p>
      <div className="rounded-xl border border-violet-200/80 bg-violet-50/70 dark:bg-violet-950/25 dark:border-violet-900/50 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ReadonlyField label="Annual Rent Amount" value={annual} />
        </div>
        <div className="mt-4 rounded-lg border border-border bg-background px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm text-foreground">Result = Property (Min) + Products (Min) - Expenses</p>
          <p className="text-lg font-black text-foreground shrink-0">{fmtStudyNumber(fin.result)}</p>
        </div>
        <div className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm font-bold text-foreground">Expected Net Income (Min) = Result - Annual Rent</p>
          <p className="text-lg font-black text-emerald-700 dark:text-emerald-400 shrink-0">{fmtStudyNumber(fin.expectedNetIncomeMin)}</p>
        </div>
      </div>
    </section>
  );
}

function DepartmentOpinionsGrid({ opinions }: { opinions: any[] }) {
  if (!opinions.length) return null;
  return (
    <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-3">
      <p className="text-sm font-bold text-foreground">Department Opinions</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {opinions.map((op: any) => {
          const parsed = parseOpinionPayload(op.opinion_payload);
          const badge = opinionStatusPresentation(parsed.status);
          const mgr = parsed.manager || op.submitted_by_username || "—";
          return (
            <div key={op.id || `${op.department}-${op.submitted_at}`} className={`rounded-xl border p-4 flex flex-col gap-2 ${departmentCardClass(String(op.department))}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-foreground capitalize">{String(op.department || "department").replace(/_/g, " ")}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${badge.cls}`}>{badge.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Manager:</span> {mgr}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Date:</span> {formatShortDate(op.submitted_at)}
              </p>
              <div className="rounded-lg border border-border bg-background p-3 text-sm text-foreground whitespace-pre-wrap break-words min-h-[3rem]">
                {parsed.comment || (parsed.extra.length ? null : "—")}
                {parsed.extra.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {parsed.extra.map(([k, v]) => (
                      <li key={k}>
                        <span className="font-semibold text-foreground">{k}:</span> {v}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AttachmentViewTile({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-primary/25 bg-primary/5 text-primary hover:bg-primary/10 text-sm font-semibold"
    >
      <Eye className="w-4 h-4 shrink-0" />
      <span className="truncate">{label}</span>
    </a>
  );
}

async function uploadContractAttachmentFile(file: File): Promise<{ url: string; fileName: string }> {
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("Please sign in again.");
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_URL}/files/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result?.data?.url) {
    throw new Error(result?.details || result?.error || "Failed to upload attachment");
  }
  return { url: String(result.data.url), fileName: String(result.data.fileName || file.name) };
}

function ContractSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-xl font-bold text-primary inline-flex items-center gap-2">
        <FileText className="w-5 h-5" /> {title}
      </h3>
      {children}
    </section>
  );
}

function SubmittedContractView({
  form,
  department,
  submittedAt,
}: {
  form: Record<string, any>;
  department: string;
  submittedAt?: string | null;
}) {
  return (
    <div className="no-print rounded-xl border border-border p-4 bg-muted/10 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-foreground">Submitted Contract Form</p>
        <p className="text-xs text-muted-foreground capitalize">
          Department: {department || "—"} {submittedAt ? `· Submitted: ${formatShortDate(submittedAt)}` : ""}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-8">
        <ContractSection title="Basic Info">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReadonlyField label="Contract No" value={form.contractNo || "—"} />
            <ReadonlyField label="Contract Type" value={form.contractType || "—"} />
            <ReadonlyField label="Station Code" value={form.stationCode || "—"} />
            <ReadonlyField label="Signature Date" value={form.contractSignatureDate || "—"} />
            <div className="md:col-span-2">
              <ReadonlyField label="Signature Location" value={form.contractSignatureLocation || "—"} />
            </div>
          </div>
        </ContractSection>

        <ContractSection title="Dates & Duration">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ReadonlyField label="Start Date" value={form.tenancyStartDate || "—"} />
            <ReadonlyField label="End Date" value={form.tenancyEndDate || "—"} />
            <ReadonlyField label="Duration" value={form.duration || "—"} />
            <ReadonlyField label="Days" value={form.days || "—"} />
          </div>
        </ContractSection>

        <ContractSection title="Lessor Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReadonlyField label="Lessor Name" value={form.lessorName || "—"} />
            <ReadonlyField label="Nationality" value={form.nationality || "—"} />
            <ReadonlyField label="ID Type" value={form.idType || "—"} />
            <ReadonlyField label="ID No" value={form.idNo || "—"} />
            <ReadonlyField label="Mobile No" value={form.mobileNo || "—"} />
            <ReadonlyField label="Email" value={form.email || "—"} />
          </div>
        </ContractSection>

        <ContractSection title="Tenant Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReadonlyField label="Tenant Name" value={form.tenantName || "—"} />
            <ReadonlyField label="Nationality" value={form.tenantNationality || "—"} />
            <ReadonlyField label="ID Type" value={form.tenantIdType || "—"} />
            <ReadonlyField label="ID No" value={form.tenantIdNo || "—"} />
            <ReadonlyField label="Mobile No" value={form.tenantMobileNo || "—"} />
            <ReadonlyField label="Email" value={form.tenantEmail || "—"} />
          </div>
        </ContractSection>

        <ContractSection title="Financial Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReadonlyField label="Property Value" value={form.propertyValue || "—"} />
            <ReadonlyField label="Installments" value={form.installments || "—"} />
            <ReadonlyField label="Due Date" value={form.dueDate || "—"} />
            <ReadonlyField label="Due Amount" value={form.dueAmount || "—"} />
            <ReadonlyField label="Paid Amount" value={form.paidAmount || "—"} />
            <ReadonlyField label="Not Paid Amount" value={form.notPaidAmount || "—"} />
            <div className="md:col-span-3">
              <ReadonlyField label="Due Period" value={form.duePeriod || "—"} />
            </div>
          </div>
        </ContractSection>

        <ContractSection title="Attachment">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReadonlyField label="Contract Attachment" value={form.contractAttachmentName || "—"} />
            <ReadonlyField
              label="Attachment URL"
              value={
                form.contractAttachmentUrl ? (
                  <a href={toInvestmentFileHref(form.contractAttachmentUrl) || String(form.contractAttachmentUrl)} target="_blank" rel="noreferrer" className="text-primary underline break-all">
                    View attachment
                  </a>
                ) : "—"
              }
            />
          </div>
        </ContractSection>
      </div>
    </div>
  );
}

export function StudyDetailBody({ data }: { data: any }) {
  const study = data?.study || {};
  const opportunity = data?.opportunity || {};
  const client = data?.client || {};
  const fin = computeStudyFinancials(study);
  const rows = Array.isArray(study.expected_property_income?.rows) ? study.expected_property_income.rows : [];
  const opinions = Array.isArray(data?.opinions) ? data.opinions : [];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2">
        <p className="text-sm font-bold text-foreground">Study overview</p>
        <DetailRow label="Workflow status" value={formatWorkflowStatusWithAssignee(String(study.status || ""), opportunity)} />
        <DetailRow label="Last updated" value={study.updated_at ? formatShortDate(study.updated_at) : "—"} />
      </div>

      <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-3">
        <p className="text-sm font-bold text-foreground">Location & site (from opportunity)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <DetailRow label="Workflow status" value={formatWorkflowStatusWithAssignee(String(opportunity.status || ""), opportunity)} />
          <DetailRow label="Opportunity type" value={labelOpportunityType(opportunity.opportunity_type)} />
          <DetailRow label="Opportunity date" value={opportunity.opportunity_date ? String(opportunity.opportunity_date).slice(0, 10) : "—"} />
          <DetailRow label="Region" value={opportunity.region || "—"} />
          <DetailRow label="City" value={opportunity.city || "—"} />
          <DetailRow label="District" value={opportunity.district || "—"} />
          <DetailRow label="Street" value={opportunity.street || "—"} />
          <DetailRow label="Street type" value={labelStreetType(opportunity.street_type)} />
          <DetailRow label="Station name (if exists)" value={opportunity.station_name_if_exists || "—"} />
          <DetailRow label="Location status" value={labelLocationStatus(opportunity.location_status)} />
          <DetailRow label="Area (m²)" value={opportunity.area_m2 ?? "—"} />
          <DetailRow label="Frontage (m)" value={opportunity.frontage_m ?? "—"} />
          <DetailRow label="Depth (m)" value={opportunity.depth_m ?? "—"} />
          <DetailRow
            label="Location URL"
            value={
              opportunity.location_url ? (
                <a className="text-primary underline inline-flex items-center gap-1 break-all" href={opportunity.location_url} target="_blank" rel="noreferrer">
                  View Location on Map <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              ) : (
                "—"
              )
            }
          />
          <DetailRow label="Issued licenses" value={opportunity.issued_licenses || "—"} />
          <DetailRow label="Pending licenses" value={opportunity.pending_licenses || "—"} />
          <DetailRow label="Assigned specialist" value={opportunity.specialist_display_name || opportunity.specialist_username || "—"} />
          <DetailRow label="Notes" value={<span className="whitespace-pre-wrap">{opportunity.notes || "—"}</span>} />
        </div>
      </div>

      <SectionCard title="Client">
        <ThreeColGrid>
          <DetailRow label="Name" value={client.name} />
          <DetailRow label="ID / CR" value={client.id_cr_number ?? "—"} />
          <DetailRow label="Client type" value={labelClientType(client.client_type)} />
          <DetailRow label="Phone" value={client.phone ?? "—"} />
          <DetailRow label="Email" value={client.email ?? "—"} />
          <DetailRow label="Contact person" value={client.contact_person_name ?? "—"} />
          <DetailRow label="Contact mobile" value={client.contact_person_mobile ?? "—"} />
          <DetailRow label="Address" value={<span className="whitespace-pre-wrap">{client.address ?? "—"}</span>} />
          <DetailRow label="Note" value={<span className="whitespace-pre-wrap">{client.note ?? "—"}</span>} />
        </ThreeColGrid>
      </SectionCard>

      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Expected net income (min)</p>
          <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{fmtStudyNumber(fin.expectedNetIncomeMin)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Annual rent amount</p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">{fmtStudyNumber(fin.annualRent)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Property rent (min)</p>
          <p className="font-semibold text-foreground">{fmtStudyNumber(fin.propertyMin)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Product profit (min)</p>
          <p className="font-semibold text-foreground">{fmtStudyNumber(fin.productsMin)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Total expenses</p>
          <p className="font-semibold text-foreground">{fmtStudyNumber(fin.expensesTotal)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Result (before rent)</p>
          <p className="font-semibold text-foreground">{fmtStudyNumber(fin.result)}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-bold text-foreground">1. Expected property income</p>
        <div className="overflow-auto rounded-xl border border-border">
          <table className="min-w-[720px] w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left px-3 py-2">Unit type</th>
                <th className="text-left px-3 py-2">Area m²</th>
                <th className="text-left px-3 py-2">Units</th>
                <th className="text-left px-3 py-2">Total area</th>
                <th className="text-left px-3 py-2">Price/m² min</th>
                <th className="text-left px-3 py-2">Price/m² max</th>
                <th className="text-left px-3 py-2">Rent min</th>
                <th className="text-left px-3 py-2">Rent max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-4 text-muted-foreground text-center">
                    No rows stored.
                  </td>
                </tr>
              ) : (
                rows.map((r: any, idx: number) => (
                  <tr key={idx} className={idx % 2 === 1 ? "bg-muted/20" : ""}>
                    <td className="px-3 py-2">{r.unitType ?? "—"}</td>
                    <td className="px-3 py-2">{r.expectedUnitAreaM2 ?? "—"}</td>
                    <td className="px-3 py-2">{r.numberOfUnits ?? "—"}</td>
                    <td className="px-3 py-2">{r.totalAreaM2 ?? "—"}</td>
                    <td className="px-3 py-2">{r.pricePerM2Min ?? "—"}</td>
                    <td className="px-3 py-2">{r.pricePerM2Max ?? "—"}</td>
                    <td className="px-3 py-2">{r.totalRentMin ?? "—"}</td>
                    <td className="px-3 py-2">{r.totalRentMax ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductSalesReadonly product_sales={study.product_sales} />
      <ExpensesReadonly expenses={study.expenses} />
      <FinalResultReadonly study={study} />

      <div className="space-y-2">
        <p className="text-sm font-bold text-foreground">Initial agreement notes</p>
        <div className="rounded-xl border border-border bg-background p-4 text-sm whitespace-pre-wrap break-words">{study.initial_agreement_notes || "—"}</div>
      </div>

      {Array.isArray(data?.studyAttachments) && data.studyAttachments.length > 0 && (
        <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase inline-flex items-center gap-2">
            <FileText className="w-4 h-4" /> Study file
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.studyAttachments.map((a: any) => {
              const href = toInvestmentFileHref(a.file_url);
              if (!href) return null;
              return <AttachmentViewTile key={a.id} href={href} label={a.file_name || ATT_KIND_LABELS[a.kind || ""] || "View file"} />;
            })}
          </div>
        </div>
      )}

      {Array.isArray(data?.opportunityAttachments) && data.opportunityAttachments.length > 0 && (
        <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase">Opportunity attachments (linked)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.opportunityAttachments.map((a: any) => {
              const href = toInvestmentFileHref(a.file_url);
              if (!href) return null;
              return <AttachmentViewTile key={a.id} href={href} label={ATT_KIND_LABELS[a.kind] || a.kind || "File"} />;
            })}
          </div>
        </div>
      )}

      <DepartmentOpinionsGrid opinions={opinions} />
    </div>
  );
}

function FeasibilityStrip({
  details,
  onViewFull,
}: {
  details: any;
  onViewFull: () => void;
}) {
  const study = details?.study || {};
  const opportunity = details?.opportunity || {};
  const fin = computeStudyFinancials(study);
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-foreground inline-flex items-center gap-2">
          <ClipboardList className="w-4 h-4" /> Feasibility study
        </p>
        <button
          type="button"
          onClick={onViewFull}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-sm font-semibold hover:bg-muted"
        >
          <Eye className="w-4 h-4" /> View full study
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Expected income</p>
          <p className="text-lg font-bold text-foreground">{fmtStudyNumber(fin.result)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Annual rent</p>
          <p className="text-lg font-bold text-foreground">{fmtStudyNumber(fin.annualRent)}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{formatWorkflowStatusWithAssignee(String(study.status || ""), opportunity)}</p>
    </div>
  );
}

export function InvestmentOpportunityDetailModal({
  opportunityId,
  onClose,
  autoPrintRequest,
  onAutoPrintDone,
  initialOpenStudyId,
}: {
  opportunityId: string | null;
  onClose: () => void;
  autoPrintRequest?: number;
  onAutoPrintDone?: () => void;
  initialOpenStudyId?: string | null;
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [base, setBase] = useState<any | null>(null);
  const [enrichedStudies, setEnrichedStudies] = useState<any[]>([]);
  const [nestedStudyId, setNestedStudyId] = useState<string | null>(null);
  const lastAutoPrintRef = useRef<number>(0);
  const [busyAction, setBusyAction] = useState(false);
  const [uploadingContractAttachment, setUploadingContractAttachment] = useState(false);
  const [contractDepartment, setContractDepartment] = useState("project");
  const [contractManagerUserId, setContractManagerUserId] = useState("");
  const [departmentManagers, setDepartmentManagers] = useState<any[]>([]);
  const [contractForm, setContractForm] = useState({
    contractNo: "",
    contractType: "",
    stationCode: "",
    contractSignatureDate: "",
    contractSignatureLocation: "",
    tenancyStartDate: "",
    tenancyEndDate: "",
    lessorName: "",
    nationality: "",
    idType: "",
    idNo: "",
    mobileNo: "",
    email: "",
    tenantName: "",
    tenantNationality: "",
    tenantIdType: "",
    tenantIdNo: "",
    tenantMobileNo: "",
    tenantEmail: "",
    duration: "",
    days: "",
    propertyValue: "",
    installments: "",
    dueDate: "",
    dueAmount: "",
    paidAmount: "",
    notPaidAmount: "",
    duePeriod: "",
    contractAttachmentUrl: "",
    contractAttachmentName: "",
  });
  const [publishStationCode, setPublishStationCode] = useState("");
  const [publishStationName, setPublishStationName] = useState("");

  useEffect(() => {
    setPublishStationCode("");
    setPublishStationName("");
  }, [opportunityId]);

  useEffect(() => {
    if (!base?.opportunity) return;
    const o = base.opportunity as Record<string, unknown>;
    if (String(o.workflow_status || "").toLowerCase() !== "approved_pending_station_assignment") return;
    const cf =
      typeof o.contract_form_data === "object" && o.contract_form_data
        ? (o.contract_form_data as Record<string, unknown>)
        : {};
    const code = String(cf.stationCode || "").trim();
    const name = String(cf.stationName || o.client_name || "").trim();
    setPublishStationCode((p) => (p ? p : code));
    setPublishStationName((p) => (p ? p : name));
  }, [base]);

  const loadAll = useCallback(async () => {
    if (!opportunityId) {
      setBase(null);
      setEnrichedStudies([]);
      return;
    }
    setLoading(true);
    try {
      const data = await investmentWorkflowAPI.getOpportunity(opportunityId);
      setBase(data);
      const studies = Array.isArray(data?.studies) ? data.studies : [];
      const enriched = await Promise.all(
        studies.map(async (s: any) => {
          try {
            const details = await investmentWorkflowAPI.getStudyDetails(String(s.id));
            return { raw: s, details };
          } catch {
            return { raw: s, details: null };
          }
        }),
      );
      setEnrichedStudies(enriched);
    } catch {
      setBase(null);
      setEnrichedStudies([]);
    } finally {
      setLoading(false);
    }
  }, [opportunityId]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (!initialOpenStudyId || loading || !base) return;
    setNestedStudyId(String(initialOpenStudyId));
  }, [initialOpenStudyId, loading, base]);

  useEffect(() => {
    const req = Number(autoPrintRequest || 0);
    if (!req) return;
    if (req === lastAutoPrintRef.current) return;
    if (loading || !base) return;
    lastAutoPrintRef.current = req;
    window.setTimeout(() => {
      printSectionById("investment-opportunity-print-root", "Opportunity Details");
      onAutoPrintDone?.();
    }, 120);
  }, [autoPrintRequest, loading, base, onAutoPrintDone]);

  const opp = base?.opportunity || {};
  const wf = String(opp.workflow_status || "").toLowerCase();
  const bucket =
    wf === "approved" || wf === "station_published"
      ? "Approved"
      : wf === "rejected"
        ? "Rejected"
        : wf === "approved_pending_station_assignment"
          ? "Pending station"
          : wf === "new" || String(opp.status || "") === "draft"
            ? "New"
            : "Under Study";

  const newest = enrichedStudies[0];
  const latestWithDetails = newest?.details ? newest : enrichedStudies.find((e) => e.details) || enrichedStudies[0];
  const latestDetails = latestWithDetails?.details;
  const latestOpinions = Array.isArray(latestDetails?.opinions) ? latestDetails.opinions : [];

  const mapHref = opp.location_url ? String(opp.location_url) : null;
  const workflowStatus = String(opp.workflow_status || "").toLowerCase();
  const isExecutiveUser = Boolean(user?.role === "ceo" || user?.role === "super_admin");
  const isOpportunityCreator = Boolean(
    user && String(opp.created_by || "") === String(user.id || ""),
  );
  const isInvestmentFranchiseSupervisor = Boolean(
    user?.role === "supervisor" &&
      (user.department === "investment" || user.department === "franchise"),
  );
  const canPublishStationAssignment = Boolean(
    user &&
      workflowStatus === "approved_pending_station_assignment" &&
      (user.role === "super_admin" ||
        user.role === "ceo" ||
        isOpportunityCreator ||
        isInvestmentFranchiseSupervisor),
  );
  const isAssignedContractManager = Boolean(
    user && String(opp.contract_manager_user_id || "") === String(user.id || ""),
  );
  const canSubmitContractForm = Boolean(
    workflowStatus === "contract_in_progress" &&
    user &&
    isAssignedContractManager,
  );
  const canSeeContractSubmittedNotice = Boolean(
    workflowStatus === "awaiting_ceo_final_approval" &&
    (isExecutiveUser || isAssignedContractManager),
  );
  const canViewSubmittedContractForm = Boolean(
    (isExecutiveUser || isAssignedContractManager) &&
    opp.contract_submitted_at &&
    opp.contract_form_data &&
    typeof opp.contract_form_data === "object",
  );

  useEffect(() => {
    if (!base) return;
    setContractDepartment(String(opp.contract_department || "project"));
    setContractManagerUserId(String(opp.contract_manager_user_id || ""));
    const existing = opp.contract_form_data || {};
    const fallbackStationCode = String(
      (opp as any).station_code || (opp as any).station_name_if_exists || "",
    ).trim();
    setContractForm((prev) => ({
      ...prev,
      stationCode: prev.stationCode || fallbackStationCode,
      ...existing,
    }));
  }, [base, opp.contract_department, opp.contract_form_data, opp.contract_manager_user_id]);

  useEffect(() => {
    if (!isExecutiveUser) return;
    let cancelled = false;
    (async () => {
      try {
        const users = await usersAPI.getAll();
        if (cancelled) return;
        const filtered = users.filter((u: any) => String(u.role || "") === "department_manager");
        setDepartmentManagers(filtered);
      } catch {
        if (!cancelled) setDepartmentManagers([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isExecutiveUser]);

  const managerChoices = departmentManagers.filter((u: any) => String(u.department || "") === contractDepartment);

  const onSendForContract = async () => {
    if (!opportunityId || !contractDepartment || !contractManagerUserId) return;
    setBusyAction(true);
    try {
      await investmentWorkflowAPI.ceoSendOpportunityToContract(opportunityId, {
        contractDepartment,
        contractManagerUserId,
      });
      await loadAll();
    } catch (e: any) {
      alert(String(e?.message || "Failed to send opportunity for contract"));
    } finally {
      setBusyAction(false);
    }
  };

  const onCeoApprove = async () => {
    if (!opportunityId) return;
    setBusyAction(true);
    try {
      await investmentWorkflowAPI.ceoApproveOpportunity(opportunityId);
      await loadAll();
    } catch (e: any) {
      alert(String(e?.message || "Failed to approve opportunity"));
    } finally {
      setBusyAction(false);
    }
  };

  const onCeoReject = async () => {
    if (!opportunityId) return;
    setBusyAction(true);
    try {
      await investmentWorkflowAPI.ceoRejectOpportunity(opportunityId);
      await loadAll();
    } catch (e: any) {
      alert(String(e?.message || "Failed to reject opportunity"));
    } finally {
      setBusyAction(false);
    }
  };

  const onPublishStation = async () => {
    if (!opportunityId) return;
    const code = publishStationCode.trim();
    const name = publishStationName.trim();
    if (!code || !name) {
      alert("Station code and station name are required.");
      return;
    }
    setBusyAction(true);
    try {
      await investmentWorkflowAPI.publishOpportunityStation(opportunityId, {
        stationCode: code,
        stationName: name,
      });
      await loadAll();
    } catch (e: any) {
      alert(String(e?.message || "Failed to publish station"));
    } finally {
      setBusyAction(false);
    }
  };

  const onSubmitContract = async () => {
    if (!opportunityId) return;
    setBusyAction(true);
    try {
      await investmentWorkflowAPI.submitOpportunityContract(opportunityId, { contractFormData: contractForm });
      await loadAll();
    } catch (e: any) {
      alert(String(e?.message || "Failed to submit contract form"));
    } finally {
      setBusyAction(false);
    }
  };

  const onUploadContractAttachment = async (file: File | null) => {
    if (!file) return;
    setUploadingContractAttachment(true);
    try {
      const uploaded = await uploadContractAttachmentFile(file);
      setContractForm((p: any) => ({
        ...p,
        contractAttachmentUrl: uploaded.url,
        contractAttachmentName: uploaded.fileName,
      }));
    } catch (e: any) {
      alert(String(e?.message || "Failed to upload attachment"));
    } finally {
      setUploadingContractAttachment(false);
    }
  };

  if (!opportunityId) return null;

  return (
    <>
      <div
        role="presentation"
        className="investment-print-overlay fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50"
        style={{ paddingLeft: "var(--sidebar-offset, 0rem)" }}
        onClick={onClose}
      >
        <div className="investment-print-shell bg-card rounded-2xl border border-border shadow-xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="no-print px-5 py-4 border-b border-border flex items-start justify-between gap-3 shrink-0">
            <div className="min-w-0">
              <p className="text-lg font-bold text-foreground truncate">{opp.client_name || "Opportunity"}</p>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="inline-flex items-center rounded-full px-2 py-0.5 bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100 font-semibold">{bucket}</span>
                <span className="mx-2 text-muted-foreground/50">·</span>
                <span>{humanizeWorkflowKey(String(opp.status || ""))}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted"
                onClick={() => printSectionById("investment-opportunity-print-root", "Opportunity Details")}
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div id="investment-opportunity-print-root" className="investment-print-body p-5 overflow-auto flex-1 min-h-0 space-y-6">
            {loading ? (
              <p className="text-muted-foreground text-center py-12">Loading full details…</p>
            ) : !base ? (
              <p className="text-destructive text-center py-12">Could not load opportunity.</p>
            ) : (
              <>
                <SectionCard title="Basic information">
                  <ThreeColGrid>
                    <DetailRow label="Type" value={labelOpportunityType(opp.opportunity_type)} />
                    <DetailRow label="Date" value={opp.opportunity_date ? String(opp.opportunity_date).slice(0, 10) : "—"} />
                    <DetailRow
                      label="Status"
                      value={<span className="inline-flex items-center rounded-full px-2 py-0.5 bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100 text-xs font-bold">{bucket}</span>}
                    />
                  </ThreeColGrid>
                </SectionCard>

                <SectionCard title="Client information">
                  <ThreeColGrid>
                    <div className="md:col-span-3">
                      <DetailRow label="Name" value={opp.client_name} />
                    </div>
                    <DetailRow label="ID / CR" value={opp.client_id_cr_number ?? "—"} />
                    <DetailRow label="Type" value={labelClientType(opp.client_type)} />
                    <DetailRow label="Phone" value={opp.client_phone || "—"} />
                    <DetailRow label="Email" value={opp.client_email || "—"} />
                    <DetailRow label="Address" value={<span className="whitespace-pre-wrap">{opp.client_address || "—"}</span>} />
                    <DetailRow label="Contact person" value={opp.client_contact_person_name || "—"} />
                    <DetailRow label="Contact mobile" value={opp.client_contact_person_mobile || "—"} />
                  </ThreeColGrid>
                </SectionCard>

                <SectionCard title="Location information">
                  <ThreeColGrid>
                    <DetailRow label="Region" value={opp.region || "—"} />
                    <DetailRow label="City" value={opp.city || "—"} />
                    <DetailRow label="District" value={opp.district || "—"} />
                    <DetailRow label="Street" value={opp.street || "—"} />
                    <DetailRow label="Street type" value={labelStreetType(opp.street_type)} />
                    <DetailRow label="Station" value={opp.station_name_if_exists || "—"} />
                    <DetailRow label="Location status" value={labelLocationStatus(opp.location_status)} />
                    <DetailRow label="Area (m²)" value={opp.area_m2 ?? "—"} />
                    <DetailRow label="Frontage (m)" value={opp.frontage_m ?? "—"} />
                    <DetailRow label="Depth (m)" value={opp.depth_m ?? "—"} />
                  </ThreeColGrid>
                  {mapHref ? (
                    <p className="pt-3">
                      <a className="text-primary font-semibold text-sm inline-flex items-center gap-1 hover:underline" href={mapHref} target="_blank" rel="noreferrer">
                        View Location on Map <ExternalLink className="w-4 h-4" />
                      </a>
                    </p>
                  ) : null}
                </SectionCard>

                {Array.isArray(base.attachments) && base.attachments.length > 0 && (
                  <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-3">
                    <p className="text-sm font-bold text-foreground">Attachments</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {base.attachments.map((a: any) => {
                        const href = toInvestmentFileHref(a.file_url);
                        if (!href) return null;
                        return <AttachmentViewTile key={a.id} href={href} label={ATT_KIND_LABELS[a.kind] || a.kind || "File"} />;
                      })}
                    </div>
                  </div>
                )}

                <SectionCard title="Additional information">
                  <ThreeColGrid>
                    <DetailRow label="Specialist" value={opp.specialist_display_name || opp.specialist_username || "—"} />
                    <DetailRow label="Issued licenses" value={opp.issued_licenses || "—"} />
                    <DetailRow label="Pending licenses" value={opp.pending_licenses || "—"} />
                  </ThreeColGrid>
                </SectionCard>

                {opp.notes ? (
                  <SectionCard title="Notes">
                    <p className="text-sm whitespace-pre-wrap break-words">{opp.notes}</p>
                  </SectionCard>
                ) : null}

                {latestDetails ? (
                  <FeasibilityStrip
                    details={latestDetails}
                    onViewFull={() => {
                      const id = String(latestDetails?.study?.id || latestWithDetails?.raw?.id || "");
                      if (id) setNestedStudyId(id);
                    }}
                  />
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No feasibility study yet. This section will update when a study is saved.</div>
                )}

                {latestOpinions.length > 0 ? (
                  <DepartmentOpinionsGrid opinions={latestOpinions} />
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    No department opinions yet. This section will update when committee members submit opinions.
                  </div>
                )}

                {isExecutiveUser && workflowStatus === "awaiting_ceo_decision" ? (
                  <div className="no-print rounded-xl border border-border p-4 bg-muted/10 space-y-3">
                    <p className="text-sm font-bold text-foreground">CEO Decision</p>
                    <p className="text-xs text-muted-foreground">
                      Final Approve sends the opportunity back to the user who created it to enter the official station code and name; after they publish, it appears on the Stations list.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <select
                        className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                        value={contractDepartment}
                        onChange={(e) => {
                          setContractDepartment(e.target.value);
                          setContractManagerUserId("");
                        }}
                      >
                        {CEO_CONTRACT_DEPARTMENT_OPTIONS.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                      <select
                        className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                        value={contractManagerUserId}
                        onChange={(e) => setContractManagerUserId(e.target.value)}
                      >
                        <option value="">Select department manager</option>
                        {managerChoices.map((m: any) => (
                          <option key={m.id} value={m.id}>{m.username}</option>
                        ))}
                      </select>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          disabled={busyAction}
                          onClick={() => void onCeoReject()}
                          className="px-4 py-2 rounded-lg border border-red-300 text-red-700 dark:text-red-300 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-60"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          disabled={busyAction || !contractManagerUserId}
                          onClick={() => void onSendForContract()}
                          className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted disabled:opacity-60"
                        >
                          Send for Contract
                        </button>
                        <button
                          type="button"
                          disabled={busyAction}
                          onClick={() => void onCeoApprove()}
                          className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
                        >
                          Final Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}

                {canSubmitContractForm ? (
                  <div className="no-print rounded-xl border border-border p-4 bg-muted/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-foreground">Contract Form</p>
                      <p className="text-xs text-muted-foreground capitalize">Department: {opp.contract_department || "—"}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-5 space-y-8">
                      <ContractSection title="Basic Info">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Contract No *</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.contractNo}
                              onChange={(e) => setContractForm((p) => ({ ...p, contractNo: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Contract Type</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.contractType}
                              onChange={(e) => setContractForm((p) => ({ ...p, contractType: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Station Code *</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.stationCode}
                              onChange={(e) => setContractForm((p) => ({ ...p, stationCode: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Signature Date</span>
                            <input
                              type="date"
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.contractSignatureDate}
                              onChange={(e) => setContractForm((p) => ({ ...p, contractSignatureDate: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-foreground">Signature Location</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.contractSignatureLocation}
                              onChange={(e) => setContractForm((p) => ({ ...p, contractSignatureLocation: e.target.value }))}
                            />
                          </label>
                        </div>
                      </ContractSection>

                      <ContractSection title="Dates & Duration">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Start Date</span>
                            <input
                              type="date"
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.tenancyStartDate}
                              onChange={(e) => setContractForm((p) => ({ ...p, tenancyStartDate: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">End Date</span>
                            <input
                              type="date"
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.tenancyEndDate}
                              onChange={(e) => setContractForm((p) => ({ ...p, tenancyEndDate: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Duration</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.duration}
                              onChange={(e) => setContractForm((p) => ({ ...p, duration: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Days</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.days}
                              onChange={(e) => setContractForm((p) => ({ ...p, days: e.target.value }))}
                            />
                          </label>
                        </div>
                      </ContractSection>

                      <ContractSection title="Lessor Information">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Lessor Name</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.lessorName}
                              onChange={(e) => setContractForm((p) => ({ ...p, lessorName: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Nationality</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.nationality}
                              onChange={(e) => setContractForm((p) => ({ ...p, nationality: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">ID Type</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.idType}
                              onChange={(e) => setContractForm((p) => ({ ...p, idType: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">ID No</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.idNo}
                              onChange={(e) => setContractForm((p) => ({ ...p, idNo: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Mobile No</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.mobileNo}
                              onChange={(e) => setContractForm((p) => ({ ...p, mobileNo: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Email</span>
                            <input
                              type="email"
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.email}
                              onChange={(e) => setContractForm((p) => ({ ...p, email: e.target.value }))}
                            />
                          </label>
                        </div>
                      </ContractSection>

                      <ContractSection title="Tenant Information">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Tenant Name</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.tenantName}
                              onChange={(e) => setContractForm((p) => ({ ...p, tenantName: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Nationality</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.tenantNationality}
                              onChange={(e) => setContractForm((p) => ({ ...p, tenantNationality: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">ID Type</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.tenantIdType}
                              onChange={(e) => setContractForm((p) => ({ ...p, tenantIdType: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">ID No</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.tenantIdNo}
                              onChange={(e) => setContractForm((p) => ({ ...p, tenantIdNo: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Mobile No</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.tenantMobileNo}
                              onChange={(e) => setContractForm((p) => ({ ...p, tenantMobileNo: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Email</span>
                            <input
                              type="email"
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.tenantEmail}
                              onChange={(e) => setContractForm((p) => ({ ...p, tenantEmail: e.target.value }))}
                            />
                          </label>
                        </div>
                      </ContractSection>

                      <ContractSection title="Financial Information">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Property Value</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.propertyValue}
                              onChange={(e) => setContractForm((p) => ({ ...p, propertyValue: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Installments</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.installments}
                              onChange={(e) => setContractForm((p) => ({ ...p, installments: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Due Date</span>
                            <input
                              type="date"
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.dueDate}
                              onChange={(e) => setContractForm((p) => ({ ...p, dueDate: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Due Amount</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.dueAmount}
                              onChange={(e) => setContractForm((p) => ({ ...p, dueAmount: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Paid Amount</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.paidAmount}
                              onChange={(e) => setContractForm((p) => ({ ...p, paidAmount: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1">
                            <span className="text-sm font-semibold text-foreground">Not Paid Amount</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.notPaidAmount}
                              onChange={(e) => setContractForm((p) => ({ ...p, notPaidAmount: e.target.value }))}
                            />
                          </label>
                          <label className="space-y-1 md:col-span-3">
                            <span className="text-sm font-semibold text-foreground">Due Period</span>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                              value={contractForm.duePeriod}
                              onChange={(e) => setContractForm((p) => ({ ...p, duePeriod: e.target.value }))}
                            />
                          </label>
                        </div>
                      </ContractSection>

                      <ContractSection title="Attachment">
                        <div className="rounded-xl border border-border bg-background p-4 space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="inline-flex">
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => void onUploadContractAttachment(e.target.files?.[0] || null)}
                              />
                              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted cursor-pointer">
                                <Upload className="w-4 h-4" />
                                {uploadingContractAttachment ? "Uploading..." : "Upload Attachment"}
                              </span>
                            </label>
                            {contractForm.contractAttachmentUrl ? (
                              <>
                                <a
                                  href={toInvestmentFileHref(contractForm.contractAttachmentUrl) || contractForm.contractAttachmentUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/25 bg-primary/5 text-primary text-sm font-semibold hover:bg-primary/10"
                                >
                                  <Eye className="w-4 h-4" /> View
                                </a>
                                <button
                                  type="button"
                                  onClick={() => setContractForm((p) => ({ ...p, contractAttachmentUrl: "", contractAttachmentName: "" }))}
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-300 text-red-700 dark:text-red-300 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-950/30"
                                >
                                  <Trash2 className="w-4 h-4" /> Delete
                                </button>
                              </>
                            ) : null}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {contractForm.contractAttachmentName
                              ? `Attached file: ${contractForm.contractAttachmentName}`
                              : "No attachment uploaded yet."}
                          </p>
                        </div>
                      </ContractSection>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        disabled={busyAction}
                        onClick={() => void onSubmitContract()}
                        className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
                      >
                        Submit Contract Form
                      </button>
                    </div>
                  </div>
                ) : null}

                {canSeeContractSubmittedNotice ? (
                  <div className="no-print rounded-xl border border-emerald-300 bg-emerald-50/60 p-4 flex items-center justify-between">
                    <p className="text-sm text-foreground">
                      Contract form is submitted and pending CEO final review. After Final Approve, Investment assigns the official station code and name before it appears on the Stations list.
                    </p>
                    {isExecutiveUser ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={busyAction}
                          onClick={() => void onCeoReject()}
                          className="px-4 py-2 rounded-lg border border-red-300 text-red-700 dark:text-red-300 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-60"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          disabled={busyAction}
                          onClick={() => void onCeoApprove()}
                          className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
                        >
                          Final Approve
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                        Waiting for CEO approval
                      </span>
                    )}
                  </div>
                ) : null}

                {canViewSubmittedContractForm ? (
                  <SubmittedContractView
                    form={opp.contract_form_data || {}}
                    department={String(opp.contract_department || "")}
                    submittedAt={String(opp.contract_submitted_at || "") || null}
                  />
                ) : null}

                {workflowStatus === "approved_pending_station_assignment" ? (
                  <div className="no-print rounded-xl border border-border p-4 bg-muted/10 space-y-3">
                    <p className="text-sm font-bold text-foreground">Official station assignment</p>
                    <p className="text-xs text-muted-foreground">
                      After CEO approval, the opportunity creator or an Investment/Franchise supervisor assigns the official station code and name. Publishing creates the investment project, station record, and initial workflow so the station appears on Project and All Stations dashboards.
                    </p>
                    {canPublishStationAssignment ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label className="space-y-1">
                          <span className="text-sm font-semibold text-foreground">Station code *</span>
                          <input
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                            value={publishStationCode}
                            onChange={(e) => setPublishStationCode(e.target.value)}
                          />
                        </label>
                        <label className="space-y-1">
                          <span className="text-sm font-semibold text-foreground">Station name *</span>
                          <input
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                            value={publishStationName}
                            onChange={(e) => setPublishStationName(e.target.value)}
                          />
                        </label>
                        <div className="md:col-span-2 flex justify-end">
                          <button
                            type="button"
                            disabled={
                              busyAction ||
                              !publishStationCode.trim() ||
                              !publishStationName.trim()
                            }
                            onClick={() => void onPublishStation()}
                            className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
                          >
                            Publish station
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Waiting for the opportunity creator, an Investment/Franchise supervisor, or an executive to publish the station.
                      </p>
                    )}
                  </div>
                ) : null}

                {workflowStatus === "station_published" ? (
                  <div className="no-print rounded-xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 space-y-2">
                    <p className="text-sm font-bold text-foreground">Station published</p>
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{String(opp.published_station_code || "")}</span>
                      {" — "}
                      <span>{String(opp.published_station_name || "")}</span>
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <Link
                        to="/all-stations-list"
                        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                      >
                        Stations list <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to="/all-stations-under-review"
                        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                      >
                        Under review projects <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>

      {nestedStudyId ? (
        <InvestmentStudyDetailModal
          studyId={nestedStudyId}
          departmentType={
            String(base?.opportunity?.workflow_department_type || "").toLowerCase() === "franchise"
              ? "franchise"
              : "investment"
          }
          onClose={() => setNestedStudyId(null)}
          stackZClass="z-[95]"
          onSubmitted={() => void loadAll()}
        />
      ) : null}
    </>
  );
}

export function InvestmentStudyDetailModal({
  studyId,
  onClose,
  stackZClass = "z-[80]",
  onSubmitted,
  departmentType = "investment",
}: {
  studyId: string | null;
  onClose: () => void;
  stackZClass?: string;
  /** Called after a successful submit-to-committee so parent lists can refresh. */
  onSubmitted?: () => void;
  departmentType?: WorkflowDepartmentType;
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadStudy = useCallback(async () => {
    if (!studyId) {
      setData(null);
      return;
    }
    setLoading(true);
    try {
      const d = await investmentWorkflowAPI.getStudyDetails(studyId, departmentType);
      setData(d);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [studyId, departmentType]);

  useEffect(() => {
    void loadStudy();
  }, [loadStudy]);

  if (!studyId) return null;

  const title = data?.client?.name || "Feasibility study";
  const study = data?.study;
  const opportunity = data?.opportunity;
  const submitted = String(study?.status || "") === "submitted_to_committee";
  const canSubmit = Boolean(
    data && study && !submitted && canSubmitStudyToCommittee(user, opportunity, departmentType),
  );

  const onSendToCommittee = async () => {
    if (!studyId || submitting) return;
    setSubmitting(true);
    try {
      await investmentWorkflowAPI.submitStudy(studyId, departmentType);
      await loadStudy();
      onSubmitted?.();
    } catch (e: any) {
      alert(String(e?.message || "Failed to submit study"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="presentation"
      className={`investment-print-overlay fixed inset-0 ${stackZClass} flex items-center justify-center p-4 bg-black/50`}
      style={{ paddingLeft: "var(--sidebar-offset, 0rem)" }}
      onClick={onClose}
    >
      <div className="investment-print-shell bg-card rounded-2xl border border-border shadow-xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="no-print px-5 py-4 border-b border-border flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <p className="text-lg font-bold text-foreground truncate">{title}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {study && data ? formatWorkflowStatusWithAssignee(String(study.status || ""), opportunity) : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted"
              onClick={() => printSectionById("investment-study-print-root", "Feasibility Study")}
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div id="investment-study-print-root" className="investment-print-body p-5 overflow-auto flex-1 min-h-0">
          {loading ? (
            <p className="text-muted-foreground text-center py-12">Loading…</p>
          ) : !data ? (
            <p className="text-destructive text-center py-12">Could not load study.</p>
          ) : (
            <StudyDetailBody data={data} />
          )}
        </div>
        {canSubmit ? (
          <div className="no-print px-5 py-4 border-t border-border bg-muted/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <p className="text-sm text-muted-foreground">This study is saved but not yet sent to the investment committee.</p>
            <button
              type="button"
              disabled={submitting}
              onClick={() => void onSendToCommittee()}
              className="btn-primary px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send to Committee"}
            </button>
          </div>
        ) : data && study && submitted ? (
          <div className="px-5 py-3 border-t border-border bg-emerald-500/5 shrink-0">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Feasibility study is submitted to committee.
            </p>
          </div>
        ) : data && study && !submitted && user ? (
          <div className="px-5 py-3 border-t border-border bg-muted/10 shrink-0">
            <p className="text-xs text-muted-foreground">
              This study has not been submitted to the committee yet. Only the assigned investment specialist or an executive can submit it.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
