import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, PlusCircle, FileText, Filter } from "lucide-react";
import { investmentWorkflowAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/utils/translations";

type ProjectTab = "newProject" | "feasibility" | "stations" | "siteSurvey" | "reports";
type FeasibilityFilter = "all" | "investment" | "franchise";

function normalizeProjectTab(raw: string | null): ProjectTab {
    if (raw === "feasibility" || raw === "stations" || raw === "siteSurvey" || raw === "reports") return raw;
    return "newProject";
}

export function ProjectWorkflowPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { token } = useAuth();
    const { t } = useTranslation();
    const activeTab = normalizeProjectTab(searchParams.get("tab"));
    const [filter, setFilter] = useState<FeasibilityFilter>("all");
    const [loading, setLoading] = useState(false);
    const [studies, setStudies] = useState<any[]>([]);

    useEffect(() => {
        if (activeTab !== "feasibility" || !token) return;
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                const list = await investmentWorkflowAPI.listStudies();
                if (!mounted) return;
                setStudies(Array.isArray(list) ? list : []);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        void load();
        return () => {
            mounted = false;
        };
    }, [activeTab, token]);

    const filteredStudies = useMemo(() => {
        if (filter === "all") return studies;
        return studies.filter((s) => String(s.department_type || s.departmentType || "").toLowerCase() === filter);
    }, [studies, filter]);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">{t("projectDept")}</h1>
                <p className="text-muted-foreground mt-1">Project actions and cross-department feasibility overview.</p>
            </div>

            <div className="flex flex-wrap gap-2">
                {(["newProject", "feasibility", "stations", "siteSurvey", "reports"] as const).map((id) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setSearchParams(id === "newProject" ? {} : { tab: id }, { replace: true })}
                        className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                    >
                        {id === "newProject" ? t("projectNewProject") : id === "feasibility" ? t("projectFeasibilityStudy") : id === "stations" ? t("stations") : id === "siteSurvey" ? t("siteSurvey") : t("reports")}
                    </button>
                ))}
            </div>

            {activeTab === "newProject" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/station/new-station/form/investment-department?tab=new-project" className="rounded-xl border border-border bg-card p-5 hover:bg-muted/20">
                        <p className="font-semibold flex items-center gap-2"><PlusCircle className="w-4 h-4" /> {t("investmentDept")} - {t("projectNewProject")}</p>
                    </Link>
                    <Link to="/station/new-station/form/franchise-department?tab=new-project" className="rounded-xl border border-border bg-card p-5 hover:bg-muted/20">
                        <p className="font-semibold flex items-center gap-2"><PlusCircle className="w-4 h-4" /> {t("franchiseDept")} - {t("projectNewProject")}</p>
                    </Link>
                </div>
            )}

            {activeTab === "feasibility" && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        {(["all", "investment", "franchise"] as const).map((f) => (
                            <button key={f} type="button" onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}>
                                {f === "all" ? t("allFeasibility") : f === "investment" ? t("investmentDept") : t("franchiseDept")}
                            </button>
                        ))}
                    </div>
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                        <div className="p-4 border-b border-border font-semibold">{t("projectFeasibilityStudy")}</div>
                        {loading ? (
                            <div className="p-8 text-center text-muted-foreground">Loading...</div>
                        ) : filteredStudies.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">No feasibility studies found.</div>
                        ) : (
                            <div className="divide-y divide-border">
                                {filteredStudies.map((s) => (
                                    <div key={s.id} className="px-4 py-3 flex items-center justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-foreground">{s.client_name || "Study"}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{String(s.department_type || s.departmentType || "—")} · {s.city || "—"}</p>
                                        </div>
                                        <span className="text-xs px-2 py-1 rounded-full bg-muted">{String(s.status || "draft")}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === "stations" && (
                <div className="rounded-xl border border-border bg-card p-6">
                    <p className="text-sm text-muted-foreground mb-3">Open stations list.</p>
                    <Link to="/all-stations-list" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                        <BookOpen className="w-4 h-4" /> {t("stations")}
                    </Link>
                </div>
            )}

            {activeTab === "siteSurvey" && (
                <div className="rounded-xl border border-border bg-card p-6">
                    <p className="text-sm text-muted-foreground mb-3">Open site survey from station forms.</p>
                    <Link to="/all-stations-list" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                        <BookOpen className="w-4 h-4" /> {t("siteSurvey")}
                    </Link>
                </div>
            )}

            {activeTab === "reports" && (
                <div className="rounded-xl border border-border bg-card p-6">
                    <Link to="/all-stations-reports" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                        <FileText className="w-4 h-4" /> {t("reports")}
                    </Link>
                </div>
            )}
        </div>
    );
}

