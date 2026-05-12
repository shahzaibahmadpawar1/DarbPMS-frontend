import { useEffect, useState } from "react";
import { PlusCircle, Trash2, MapPin, GripVertical } from "lucide-react";
import { investmentWorkflowAPI, appSettingsAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "../../utils/translations";
import {
    EXECUTIVE_SIDEBAR_SLOT_IDS,
    isValidExecutiveSidebarOrder,
    normalizeExecutiveSidebarOrder,
} from "@/utils/allStationsSidebarSlots";
import {
    DEFAULT_SIDEBAR_NESTED_ORDER,
    normalizeSidebarNestedOrder,
    type SidebarNestedOrder,
} from "@/utils/sidebarNestedOrder";

function sidebarSlotLabel(t: (key: string) => string, slotId: string): string {
    const keys: Record<string, string> = {
        dashboard: "dashboard",
        recentActivities: "recentActivities",
        analytics: "analytics",
        stations: "stations",
        departments: "departments",
        requests: "requests",
        underReview: "underReview",
        tasks: "tasks",
        reports: "reports",
        contactCEO: "contactCEO",
        investment: "investmentDept",
        franchiseDept: "franchiseDept",
        legalDept: "legalDept",
        projectDept: "projectDept",
        preOpening: "preOpening",
        orderRequest: "orderRequest",
        openingSoonProjects: "openingSoonProjects",
        tasksMenu: "tasksMenu",
        systemSettings: "systemSetting",
    };
    const k = keys[slotId];
    return k ? t(k) : slotId;
}

function nestedSidebarSlotLabel(t: (key: string) => string, slotId: string): string {
    const keys: Record<string, string> = {
        dashboard: "dashboard",
        analytics: "analytics",
        recentActivities: "recentActivities",
        investmentOpportunities: "investmentOpportunities",
        franchiseOpportunities: "franchiseOpportunities",
        quickActions: "quickActions",
        alertsNotifications: "alertsNotifications",
        newProject: "projectNewProject",
        feasibility: "projectFeasibilityStudy",
        governmentLicenses: "governmentLicenses",
        otherLicenses: "otherLicenses",
        newRequest: "newRequest",
        submittedApprovedRequests: "submittedApprovedRequests",
        trackNearLaunchProject: "trackNearLaunchProject",
        "new-project": "investmentNewProject",
        opportunities: "investmentOpportunities",
        "investment-feasibility": "investmentFeasibilityStudy",
        opinions: "investmentOpinions",
        reports: "reports",
        contract: "contract",
        document: "document",
        siteSurvey: "siteSurvey",
        users: "users",
        companyInfo: "companyInfo",
        notifications: "notifications",
        backup: "backup",
    };
    const k = keys[slotId];
    return k ? t(k) : slotId;
}

export function AdminSettingsPage() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const canManage = user?.role === "super_admin";

    const [regions, setRegions] = useState<Array<{ id: string; name: string }>>([]);
    const [selectedRegionId, setSelectedRegionId] = useState<string>("");
    const [cities, setCities] = useState<Array<{ id: string; name: string; region_id: string }>>([]);
    const [loading, setLoading] = useState(false);

    const [newRegionName, setNewRegionName] = useState("");
    const [newCityName, setNewCityName] = useState("");
    const [sidebarOrderDraft, setSidebarOrderDraft] = useState<string[]>(() => [...EXECUTIVE_SIDEBAR_SLOT_IDS]);
    const [sidebarNestedOrderDraft, setSidebarNestedOrderDraft] = useState<SidebarNestedOrder>(
        () => normalizeSidebarNestedOrder(DEFAULT_SIDEBAR_NESTED_ORDER),
    );
    const [sidebarOrderLoading, setSidebarOrderLoading] = useState(false);
    const [sidebarOrderSaving, setSidebarOrderSaving] = useState(false);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [nestedDrag, setNestedDrag] = useState<{ group: keyof SidebarNestedOrder; index: number } | null>(null);
    const hiddenTopLevelSlotIds = new Set(["analytics", "recentActivities", "reports", "stations", "requests", "tasks", "underReview"]);
    const visibleTopLevelOrder = sidebarOrderDraft.filter((id) => !hiddenTopLevelSlotIds.has(id));

    const [surveyStatusDraft, setSurveyStatusDraft] = useState<Array<{ value: string; label: string }>>([]);
    const [surveyStageDraft, setSurveyStageDraft] = useState<Array<{ value: string; label: string }>>([]);
    const [surveyDropdownsLoading, setSurveyDropdownsLoading] = useState(false);
    const [surveyDropdownsSaving, setSurveyDropdownsSaving] = useState(false);

    const loadRegions = async () => {
        setLoading(true);
        try {
            const list = await investmentWorkflowAPI.listRegions();
            setRegions(list);
            if (list.length && !selectedRegionId) {
                setSelectedRegionId(list[0].id);
            }
        } finally {
            setLoading(false);
        }
    };

    const loadCities = async (regionId: string) => {
        if (!regionId) {
            setCities([]);
            return;
        }
        setLoading(true);
        try {
            const list = await investmentWorkflowAPI.listCities(regionId);
            setCities(list);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadRegions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!canManage) return;
        let cancelled = false;
        setSurveyDropdownsLoading(true);
        appSettingsAPI
            .getSurveyDropdowns()
            .then((data) => {
                if (cancelled) return;
                setSurveyStatusDraft(data.stationStatusOptions.length ? data.stationStatusOptions : [{ value: "", label: "" }]);
                setSurveyStageDraft(data.stageOptions.length ? data.stageOptions : [{ value: "", label: "" }]);
            })
            .catch(() => {
                if (!cancelled) {
                    setSurveyStatusDraft([{ value: "", label: "" }]);
                    setSurveyStageDraft([{ value: "", label: "" }]);
                }
            })
            .finally(() => {
                if (!cancelled) setSurveyDropdownsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [canManage]);

    useEffect(() => {
        if (!canManage) return;
        let cancelled = false;
        setSidebarOrderLoading(true);
        appSettingsAPI
            .getSidebarNavConfig()
            .then(({ order, nestedOrder }) => {
                if (cancelled) return;
                setSidebarOrderDraft(normalizeExecutiveSidebarOrder(order));
                setSidebarNestedOrderDraft(normalizeSidebarNestedOrder(nestedOrder));
            })
            .catch(() => {
                if (!cancelled) {
                    setSidebarOrderDraft([...EXECUTIVE_SIDEBAR_SLOT_IDS]);
                    setSidebarNestedOrderDraft(normalizeSidebarNestedOrder(DEFAULT_SIDEBAR_NESTED_ORDER));
                }
            })
            .finally(() => {
                if (!cancelled) setSidebarOrderLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [canManage]);

    useEffect(() => {
        void loadCities(selectedRegionId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRegionId]);

    if (!canManage) {
        return (
            <div className="p-8">
                <div className="bg-card rounded-xl border border-border p-8 text-center">
                    <p className="text-lg font-bold text-foreground">Settings</p>
                    <p className="text-sm text-muted-foreground mt-2">Only Super Admin can access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-black text-foreground">Settings</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage Regions and Cities for Investment Opportunities.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-border">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            <p className="font-bold text-foreground">Regions</p>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <input
                                value={newRegionName}
                                onChange={(e) => setNewRegionName(e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                                placeholder="Add new region..."
                            />
                            <button
                                type="button"
                                onClick={async () => {
                                    const name = newRegionName.trim();
                                    if (!name) return;
                                    await investmentWorkflowAPI.createRegion(name);
                                    setNewRegionName("");
                                    await loadRegions();
                                }}
                                className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2"
                            >
                                <PlusCircle className="w-4 h-4" /> Add
                            </button>
                        </div>
                    </div>

                    <div className="divide-y divide-border">
                        {regions.map((r) => (
                            <div
                                key={r.id}
                                className={`px-5 py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-muted/20 ${selectedRegionId === r.id ? "bg-muted/20" : ""}`}
                                onClick={() => setSelectedRegionId(r.id)}
                            >
                                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                                <button
                                    type="button"
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        if (!confirm(`Delete region \"${r.name}\"? This will delete its cities too.`)) return;
                                        await investmentWorkflowAPI.deleteRegion(r.id);
                                        setSelectedRegionId("");
                                        await loadRegions();
                                    }}
                                    className="p-2 rounded-lg hover:bg-destructive/10"
                                    title="Delete region"
                                >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </button>
                            </div>
                        ))}
                        {regions.length === 0 && !loading && (
                            <div className="p-8 text-center text-muted-foreground">No regions yet.</div>
                        )}
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-border">
                        <p className="font-bold text-foreground">Cities</p>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <label className="space-y-1.5 block">
                                <span className="text-xs font-bold text-muted-foreground">Region <span className="text-destructive">*</span></span>
                                <select
                                    value={selectedRegionId}
                                    onChange={(e) => setSelectedRegionId(e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                                >
                                    <option value="">Select region</option>
                                    {regions.map((r) => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </label>

                            <label className="space-y-1.5 block">
                                <span className="text-xs font-bold text-muted-foreground">City</span>
                                <div className="flex gap-2">
                            <input
                                value={newCityName}
                                onChange={(e) => setNewCityName(e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                                placeholder={selectedRegionId ? "Add new city..." : "Select a region first"}
                                disabled={!selectedRegionId}
                            />
                            <button
                                type="button"
                                disabled={!selectedRegionId}
                                onClick={async () => {
                                    const name = newCityName.trim();
                                    if (!name || !selectedRegionId) return;
                                    await investmentWorkflowAPI.createCity(selectedRegionId, name);
                                    setNewCityName("");
                                    await loadCities(selectedRegionId);
                                }}
                                className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-60"
                            >
                                <PlusCircle className="w-4 h-4" /> Add
                            </button>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="divide-y divide-border">
                        {cities.map((c) => (
                            <div key={c.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-muted/20">
                                <p className="text-sm font-semibold text-foreground">{c.name}</p>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (!confirm(`Delete city \"${c.name}\"?`)) return;
                                        await investmentWorkflowAPI.deleteCity(c.id);
                                        await loadCities(selectedRegionId);
                                    }}
                                    className="p-2 rounded-lg hover:bg-destructive/10"
                                    title="Delete city"
                                >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </button>
                            </div>
                        ))}
                        {selectedRegionId && cities.length === 0 && !loading && (
                            <div className="p-8 text-center text-muted-foreground">No cities for this region.</div>
                        )}
                        {!selectedRegionId && (
                            <div className="p-8 text-center text-muted-foreground">Select a region to manage its cities.</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border">
                    <div className="flex items-center gap-2">
                        <GripVertical className="w-5 h-5 text-primary" />
                        <p className="font-bold text-foreground">{t("sidebarNavOrderTitle")}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{t("sidebarNavOrderDescription")}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            type="button"
                            disabled={sidebarOrderSaving || sidebarOrderLoading}
                            onClick={async () => {
                                if (!isValidExecutiveSidebarOrder(sidebarOrderDraft)) return;
                                setSidebarOrderSaving(true);
                                try {
                                    await appSettingsAPI.putSidebarNavConfig(sidebarOrderDraft, sidebarNestedOrderDraft);
                                    window.dispatchEvent(new Event("darb-sidebar-slots-saved"));
                                    alert(t("sidebarNavOrderSaved"));
                                } catch (e: unknown) {
                                    alert(e instanceof Error ? e.message : "Save failed");
                                } finally {
                                    setSidebarOrderSaving(false);
                                }
                            }}
                            className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
                        >
                            {sidebarOrderSaving ? "…" : t("sidebarNavOrderSave")}
                        </button>
                        <button
                            type="button"
                            disabled={sidebarOrderSaving || sidebarOrderLoading}
                            onClick={() => {
                                setSidebarOrderDraft([...EXECUTIVE_SIDEBAR_SLOT_IDS]);
                                setSidebarNestedOrderDraft(normalizeSidebarNestedOrder(DEFAULT_SIDEBAR_NESTED_ORDER));
                            }}
                            className="px-4 py-2 rounded-lg text-sm font-semibold border border-border hover:bg-muted/40 disabled:opacity-60"
                        >
                            {t("sidebarNavOrderReset")}
                        </button>
                    </div>
                </div>
                <ul className="divide-y divide-border">
                    {visibleTopLevelOrder.map((slotId, index) => (
                        <li
                            key={slotId}
                            draggable
                            onDragStart={() => setDragIndex(index)}
                            onDragEnd={() => setDragIndex(null)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => {
                                if (dragIndex === null || dragIndex === index) return;
                                setSidebarOrderDraft((prev) => {
                                    const hidden = prev.filter((id) => hiddenTopLevelSlotIds.has(id));
                                    const visible = prev.filter((id) => !hiddenTopLevelSlotIds.has(id));
                                    const nextVisible = [...visible];
                                    const [removed] = nextVisible.splice(dragIndex, 1);
                                    nextVisible.splice(index, 0, removed);
                                    return [...nextVisible, ...hidden];
                                });
                                setDragIndex(null);
                            }}
                            className={`px-5 py-3 flex items-center gap-3 cursor-grab active:cursor-grabbing select-none hover:bg-muted/20 ${dragIndex === index ? "bg-primary/10" : ""
                                }`}
                        >
                            <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span className="text-sm font-semibold text-foreground">
                                {sidebarSlotLabel(t as (key: string) => string, slotId)}
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="p-5 border-t border-border space-y-4">
                    <p className="text-sm font-bold text-foreground">Dropdown options order</p>
                    {(
                        [
                            ["dashboard", t("dashboard")],
                            ["projectDept", t("projectDept")],
                            ["preOpening", t("preOpening")],
                            ["orderRequest", t("orderRequest")],
                            ["openingSoonProjects", t("openingSoonProjects")],
                            ["tasksMenu", t("tasksMenu")],
                            ["investment", t("investmentDept")],
                            ["franchiseDept", t("franchiseDept")],
                            ["legalDept", t("legalDept")],
                            ["systemSettings", t("systemSetting")],
                        ] as Array<[keyof SidebarNestedOrder, string]>
                    ).map(([groupKey, label]) => (
                        <div key={groupKey} className="rounded-lg border border-border overflow-hidden">
                            <div className="px-4 py-2.5 bg-muted/30 text-sm font-semibold">{label}</div>
                            <ul className="divide-y divide-border">
                                {sidebarNestedOrderDraft[groupKey].map((childId, index) => (
                                    <li
                                        key={`${groupKey}-${childId}`}
                                        draggable
                                        onDragStart={() => setNestedDrag({ group: groupKey, index })}
                                        onDragEnd={() => setNestedDrag(null)}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={() => {
                                            if (!nestedDrag || nestedDrag.group !== groupKey || nestedDrag.index === index) return;
                                            setSidebarNestedOrderDraft((prev) => {
                                                const nextGroup = [...prev[groupKey]];
                                                const [removed] = nextGroup.splice(nestedDrag.index, 1);
                                                nextGroup.splice(index, 0, removed);
                                                return { ...prev, [groupKey]: nextGroup } as SidebarNestedOrder;
                                            });
                                            setNestedDrag(null);
                                        }}
                                        className={`px-4 py-2.5 flex items-center gap-3 cursor-grab active:cursor-grabbing select-none hover:bg-muted/20 ${nestedDrag?.group === groupKey && nestedDrag.index === index ? "bg-primary/10" : ""}`}
                                    >
                                        <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                                        <span className="text-sm font-medium text-foreground">
                                            {nestedSidebarSlotLabel(t as (key: string) => string, childId)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border">
                    <p className="font-bold text-foreground">Survey report dropdowns</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Configure Station Status codes and Stage options used in the Project Survey Report form (completion stages and station status section).
                    </p>
                    <div className="mt-4">
                        <button
                            type="button"
                            disabled={surveyDropdownsSaving || surveyDropdownsLoading}
                            onClick={async () => {
                                const statusOpts = surveyStatusDraft
                                    .map((r) => ({ value: r.value.trim(), label: r.label.trim() || r.value.trim() }))
                                    .filter((r) => r.value.length > 0);
                                const stageOpts = surveyStageDraft
                                    .map((r) => ({ value: r.value.trim(), label: r.label.trim() || r.value.trim() }))
                                    .filter((r) => r.value.length > 0);
                                if (!statusOpts.length || !stageOpts.length) {
                                    alert("Add at least one status option and one stage option (non-empty value).");
                                    return;
                                }
                                setSurveyDropdownsSaving(true);
                                try {
                                    await appSettingsAPI.putSurveyDropdowns({
                                        stationStatusOptions: statusOpts,
                                        stageOptions: stageOpts,
                                    });
                                    alert("Survey dropdowns saved.");
                                } catch (e: unknown) {
                                    alert(e instanceof Error ? e.message : "Save failed");
                                } finally {
                                    setSurveyDropdownsSaving(false);
                                }
                            }}
                            className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
                        >
                            {surveyDropdownsSaving ? "Saving…" : "Save survey dropdowns"}
                        </button>
                    </div>
                </div>
                <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <p className="text-sm font-bold text-foreground mb-3">Station status (value / label)</p>
                        {surveyDropdownsLoading ? (
                            <p className="text-sm text-muted-foreground">Loading…</p>
                        ) : (
                            <div className="space-y-2">
                                {surveyStatusDraft.map((row, idx) => (
                                    <div key={`st-${idx}`} className="flex gap-2 items-center">
                                        <input
                                            value={row.value}
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                setSurveyStatusDraft((prev) => {
                                                    const next = [...prev];
                                                    next[idx] = { ...next[idx], value: v };
                                                    return next;
                                                });
                                            }}
                                            className="flex-1 min-w-0 px-2 py-1.5 border border-border rounded-lg bg-background text-sm"
                                            placeholder="value (e.g. 1)"
                                        />
                                        <input
                                            value={row.label}
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                setSurveyStatusDraft((prev) => {
                                                    const next = [...prev];
                                                    next[idx] = { ...next[idx], label: v };
                                                    return next;
                                                });
                                            }}
                                            className="flex-1 min-w-0 px-2 py-1.5 border border-border rounded-lg bg-background text-sm"
                                            placeholder="label"
                                        />
                                        <button
                                            type="button"
                                            className="p-2 rounded-lg hover:bg-destructive/10"
                                            title="Remove"
                                            onClick={() =>
                                                setSurveyStatusDraft((prev) => prev.filter((_, i) => i !== idx))
                                            }
                                        >
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setSurveyStatusDraft((prev) => [...prev, { value: "", label: "" }])}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                                >
                                    <PlusCircle className="w-4 h-4" /> Add status option
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-foreground mb-3">Stages (value / label)</p>
                        {surveyDropdownsLoading ? (
                            <p className="text-sm text-muted-foreground">Loading…</p>
                        ) : (
                            <div className="space-y-2">
                                {surveyStageDraft.map((row, idx) => (
                                    <div key={`sg-${idx}`} className="flex gap-2 items-center">
                                        <input
                                            value={row.value}
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                setSurveyStageDraft((prev) => {
                                                    const next = [...prev];
                                                    next[idx] = { ...next[idx], value: v };
                                                    return next;
                                                });
                                            }}
                                            className="flex-1 min-w-0 px-2 py-1.5 border border-border rounded-lg bg-background text-sm"
                                            placeholder="value (e.g. operating license)"
                                        />
                                        <input
                                            value={row.label}
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                setSurveyStageDraft((prev) => {
                                                    const next = [...prev];
                                                    next[idx] = { ...next[idx], label: v };
                                                    return next;
                                                });
                                            }}
                                            className="flex-1 min-w-0 px-2 py-1.5 border border-border rounded-lg bg-background text-sm"
                                            placeholder="label"
                                        />
                                        <button
                                            type="button"
                                            className="p-2 rounded-lg hover:bg-destructive/10"
                                            title="Remove"
                                            onClick={() =>
                                                setSurveyStageDraft((prev) => prev.filter((_, i) => i !== idx))
                                            }
                                        >
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setSurveyStageDraft((prev) => [...prev, { value: "", label: "" }])}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                                >
                                    <PlusCircle className="w-4 h-4" /> Add stage option
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

