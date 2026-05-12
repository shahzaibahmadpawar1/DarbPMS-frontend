import { useEffect, useMemo, useState } from "react";
import { investmentWorkflowAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle, Search, Eye } from "lucide-react";

type OpinionPayload = {
  suggestions: string;
  budget: string;
  timeDuration: string;
  percentage: string;
  requirements: string;
};

const inputCls = "w-full px-3 py-2 border border-border rounded-lg bg-background";

export function InvestmentOpinionsTab({
  onOpenOpportunity,
  departmentType = "investment",
}: {
  onOpenOpportunity?: (opportunityId: string) => void;
  departmentType?: "investment" | "franchise";
}) {
  const { token, user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStudyId, setSelectedStudyId] = useState<string | null>(null);
  const [detailsById, setDetailsById] = useState<Record<string, any>>({});
  const [formByStudy, setFormByStudy] = useState<Record<string, OpinionPayload>>({});
  const [saving, setSaving] = useState(false);

  const myDept = (user?.role === "department_manager" ? (user.department || "") : "") as string;

  const loadInbox = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const list = await investmentWorkflowAPI.committeeInbox(departmentType);
      setItems(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadInbox();
  }, [token, departmentType]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((s) => {
      const hay = `${s.client_name || ""} ${s.city || ""} ${s.region || ""} ${s.opportunity_type || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, search]);

  const loadDetails = async (id: string) => {
    setSelectedStudyId(id);
    if (detailsById[id]) return;
    const details = await investmentWorkflowAPI.getStudyDetails(id, departmentType);
    setDetailsById((p) => ({ ...p, [id]: details }));
  };

  const myOpinion = (studyId: string) => {
    const details = detailsById[studyId];
    const existing = Array.isArray(details?.opinions)
      ? details.opinions.find((o: any) => String(o.department) === String(myDept))
      : null;
    return existing;
  };

  const getForm = (studyId: string): OpinionPayload => {
    const existing = myOpinion(studyId);
    const seed: OpinionPayload = {
      suggestions: String(existing?.opinion_payload?.suggestions || ""),
      budget: existing?.opinion_payload?.budget != null ? String(existing.opinion_payload.budget) : "",
      timeDuration: String(existing?.opinion_payload?.timeDuration || ""),
      percentage: existing?.opinion_payload?.percentage != null ? String(existing.opinion_payload.percentage) : "",
      requirements: String(existing?.opinion_payload?.requirements || ""),
    };
    return formByStudy[studyId] || seed;
  };

  const setField = (studyId: string, key: keyof OpinionPayload, value: string) => {
    setFormByStudy((prev) => ({
      ...prev,
      [studyId]: { ...(prev[studyId] || getForm(studyId)), [key]: value },
    }));
  };

  const submit = async (studyId: string) => {
    if (!myDept) {
      alert("Only department managers can submit opinions.");
      return;
    }
    setSaving(true);
    try {
      const payload = getForm(studyId);
      const normalizedPercentage = payload.percentage.trim()
        ? String(Math.max(0, Math.min(100, Number.parseInt(payload.percentage, 10) || 0)))
        : "";
      const toSend = { ...payload, percentage: normalizedPercentage };
      await investmentWorkflowAPI.submitOpinion(studyId, myDept, toSend, departmentType);
      setDetailsById((p) => {
        const next = { ...p };
        delete next[studyId];
        return next;
      });
      await loadDetails(studyId);
      await loadInbox();
      alert("Opinion submitted.");
    } catch (e: any) {
      alert(String(e?.message || "Failed to submit opinion"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputCls} pl-9`} placeholder="Search opportunity..." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground">Committee Inbox</h3>
              <p className="text-xs text-muted-foreground mt-1">Submitted studies awaiting department opinions</p>
            </div>
            <span className="text-xs text-muted-foreground font-semibold">{filtered.length}</span>
          </div>
          <div className="divide-y divide-border">
            {loading ? (
              <div className="p-10 text-center text-muted-foreground">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">No records found.</div>
            ) : (
              filtered.map((s) => (
                <div
                  key={s.id}
                  className={`w-full text-left px-5 py-4 hover:bg-muted/20 transition-colors ${
                    selectedStudyId === s.id ? "bg-muted/20" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => void loadDetails(s.id)}
                    className="w-full text-left"
                  >
                    <p className="text-sm font-semibold text-foreground">{s.client_name || "Study"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {s.opportunity_type?.toUpperCase?.() || "-"} · {s.region || "-"} · {s.city || "-"}
                    </p>
                    {myDept && (
                      <p className="text-[11px] mt-1 text-muted-foreground">
                        {s.my_department_submitted_at ? "Your opinion: submitted" : "Your opinion: pending"}
                      </p>
                    )}
                  </button>
                  {onOpenOpportunity && s.opportunity_id ? (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => onOpenOpportunity(String(s.opportunity_id))}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted/60"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
          {!selectedStudyId ? (
            <div className="text-center text-muted-foreground py-20">Select a study to view details and submit your opinion.</div>
          ) : !detailsById[selectedStudyId] ? (
            <div className="text-center text-muted-foreground py-20">Loading details...</div>
          ) : (
            (() => {
              const details = detailsById[selectedStudyId];
              const existing = myOpinion(selectedStudyId);
              const editable = user?.role === "super_admin" || (user?.role === "department_manager" && !!myDept);
              const form = getForm(selectedStudyId);

              return (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-background p-4">
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Opportunity & Study</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <p className="text-muted-foreground"><span className="font-semibold text-foreground">Client:</span> {details.client?.name || "-"}</p>
                      <p className="text-muted-foreground"><span className="font-semibold text-foreground">Opportunity Type:</span> {details.opportunity?.opportunity_type || "-"}</p>
                      <p className="text-muted-foreground"><span className="font-semibold text-foreground">Region:</span> {details.opportunity?.region || "-"}</p>
                      <p className="text-muted-foreground"><span className="font-semibold text-foreground">City:</span> {details.opportunity?.city || "-"}</p>
                      <p className="text-muted-foreground md:col-span-2"><span className="font-semibold text-foreground">Initial Agreement Notes:</span> {details.study?.initial_agreement_notes || "-"}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-background p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-foreground">Opinion Form</p>
                      <p className="text-xs text-muted-foreground">{existing?.submitted_at ? "Previously submitted" : "Pending"}</p>
                    </div>

                    {existing ? (
                      <div className="mt-3 space-y-3">
                        <textarea
                          rows={2}
                          value={form.suggestions}
                          readOnly
                          className={`${inputCls} min-h-[70px] bg-muted`}
                          placeholder="Suggestions"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="number"
                            value={form.budget}
                            readOnly
                            className={`${inputCls} bg-muted`}
                            placeholder="Budget"
                          />
                          <input
                            value={form.timeDuration}
                            readOnly
                            className={`${inputCls} bg-muted`}
                            placeholder="Time duration"
                          />
                          <div className="relative">
                            <input
                              type="number"
                              value={form.percentage}
                              readOnly
                              className={`${inputCls} pr-8 bg-muted`}
                              placeholder="Percentage"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold pointer-events-none">
                              %
                            </span>
                          </div>
                          <input
                            value={form.requirements}
                            readOnly
                            className={`${inputCls} md:col-span-2 bg-muted`}
                            placeholder="Requirements"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          This opinion has already been submitted and is view-only.
                        </p>
                      </div>
                    ) : !editable ? (
                      <div className="text-sm text-muted-foreground mt-3">You don’t have permission to submit an opinion.</div>
                    ) : (
                      <div className="mt-3 space-y-3">
                        <textarea
                          rows={2}
                          value={form.suggestions}
                          onChange={(e) => setField(selectedStudyId, "suggestions", e.target.value)}
                          className={`${inputCls} min-h-[70px]`}
                          placeholder="Suggestions"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="number"
                            value={form.budget}
                            onChange={(e) => setField(selectedStudyId, "budget", e.target.value)}
                            className={inputCls}
                            placeholder="Budget"
                          />
                          <input
                            value={form.timeDuration}
                            onChange={(e) => setField(selectedStudyId, "timeDuration", e.target.value)}
                            className={inputCls}
                            placeholder="Time duration"
                          />
                          <div className="relative">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={form.percentage}
                              onChange={(e) => {
                                const raw = e.target.value;
                                if (!raw.trim()) {
                                  setField(selectedStudyId, "percentage", "");
                                  return;
                                }
                                const parsed = Number.parseInt(raw, 10);
                                if (!Number.isFinite(parsed)) return;
                                const clamped = Math.max(0, Math.min(100, parsed));
                                setField(selectedStudyId, "percentage", String(clamped));
                              }}
                              className={`${inputCls} pr-8`}
                              placeholder="Percentage"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold pointer-events-none">
                              %
                            </span>
                          </div>
                          <input
                            value={form.requirements}
                            onChange={(e) => setField(selectedStudyId, "requirements", e.target.value)}
                            className={`${inputCls} md:col-span-2`}
                            placeholder="Requirements"
                          />
                        </div>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => void submit(selectedStudyId)}
                          className="px-4 py-2 bg-success text-white rounded-lg text-sm font-semibold w-full disabled:opacity-60"
                        >
                          <CheckCircle className="w-4 h-4 inline mr-1" /> Submit Opinion
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
}

