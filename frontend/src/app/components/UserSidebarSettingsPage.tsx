import { useEffect, useMemo, useState } from "react";
import { GripVertical } from "lucide-react";
import { appSettingsAPI } from "@/services/api";
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
import {
    buildSidebarVisibilityContext,
    filterNestedChildren,
    getReorderableTopLevelSlots,
    getVisibleNestedGroups,
    mergeReorderIntoFullOrder,
} from "@/utils/sidebarVisibility";

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
        feasibilityStudy: "feasibilityStudy",
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
        overview: "projectFeasibilityStudy",
        committeeOpinions: "investmentOpinions",
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
        userSettings: "settings",
        companyInfo: "companyInfo",
        notifications: "notifications",
        backup: "backup",
    };
    const k = keys[slotId];
    return k ? t(k) : slotId;
}

const NESTED_GROUP_LABEL_KEYS: Record<keyof SidebarNestedOrder, string> = {
    dashboard: "dashboard",
    projectDept: "projectDept",
    feasibilityStudy: "feasibilityStudy",
    preOpening: "preOpening",
    orderRequest: "orderRequest",
    openingSoonProjects: "openingSoonProjects",
    tasksMenu: "tasksMenu",
    investment: "investmentDept",
    franchiseDept: "franchiseDept",
    legalDept: "legalDept",
    systemSettings: "systemSetting",
};

export function UserSidebarSettingsPage() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const visibilityCtx = useMemo(() => buildSidebarVisibilityContext(user), [user]);

    const [sidebarOrderDraft, setSidebarOrderDraft] = useState<string[]>(() => [...EXECUTIVE_SIDEBAR_SLOT_IDS]);
    const [sidebarNestedOrderDraft, setSidebarNestedOrderDraft] = useState<SidebarNestedOrder>(
        () => normalizeSidebarNestedOrder(DEFAULT_SIDEBAR_NESTED_ORDER),
    );
    const [sidebarOrderLoading, setSidebarOrderLoading] = useState(false);
    const [sidebarOrderSaving, setSidebarOrderSaving] = useState(false);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [nestedDrag, setNestedDrag] = useState<{ group: keyof SidebarNestedOrder; index: number } | null>(null);

    const visibleTopLevelOrder = useMemo(
        () => getReorderableTopLevelSlots(sidebarOrderDraft, visibilityCtx),
        [sidebarOrderDraft, visibilityCtx],
    );

    const visibleNestedGroups = useMemo(() => getVisibleNestedGroups(visibilityCtx), [visibilityCtx]);

    useEffect(() => {
        let cancelled = false;
        setSidebarOrderLoading(true);
        appSettingsAPI
            .getMySidebarNavConfig()
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
    }, []);

    return (
        <div className="p-8 space-y-6">
            <div>
                <h2 className="text-2xl font-black text-foreground">{t("settings")}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t("sidebarNavOrderDescription")}</p>
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
                                    await appSettingsAPI.putMySidebarNavConfig(sidebarOrderDraft, sidebarNestedOrderDraft);
                                    const saved = await appSettingsAPI.getMySidebarNavConfig();
                                    setSidebarOrderDraft(normalizeExecutiveSidebarOrder(saved.order));
                                    setSidebarNestedOrderDraft(normalizeSidebarNestedOrder(saved.nestedOrder));
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
                                const nextVisible = [...visibleTopLevelOrder];
                                const [removed] = nextVisible.splice(dragIndex, 1);
                                nextVisible.splice(index, 0, removed);
                                setSidebarOrderDraft((prev) =>
                                    mergeReorderIntoFullOrder(nextVisible, prev, visibilityCtx),
                                );
                                setDragIndex(null);
                            }}
                            className={`px-5 py-3 flex items-center gap-3 cursor-grab active:cursor-grabbing select-none hover:bg-muted/20 ${dragIndex === index ? "bg-primary/10" : ""}`}
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
                    {visibleNestedGroups.map((groupKey) => {
                        const visibleChildren = filterNestedChildren(
                            groupKey,
                            sidebarNestedOrderDraft[groupKey],
                            visibilityCtx,
                        );
                        if (visibleChildren.length === 0) return null;
                        const labelKey = NESTED_GROUP_LABEL_KEYS[groupKey];
                        return (
                            <div key={groupKey} className="rounded-lg border border-border overflow-hidden">
                                <div className="px-4 py-2.5 bg-muted/30 text-sm font-semibold">
                                    {(t as (k: string) => string)(labelKey)}
                                </div>
                                <ul className="divide-y divide-border">
                                    {visibleChildren.map((childId, childIndex) => (
                                        <li
                                            key={`${groupKey}-${childId}`}
                                            draggable
                                            onDragStart={() => setNestedDrag({ group: groupKey, index: childIndex })}
                                            onDragEnd={() => setNestedDrag(null)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={() => {
                                                if (
                                                    !nestedDrag ||
                                                    nestedDrag.group !== groupKey ||
                                                    nestedDrag.index === childIndex
                                                ) {
                                                    return;
                                                }
                                                setSidebarNestedOrderDraft((prev) => {
                                                    const allInGroup = [...prev[groupKey]];
                                                    const visibleInGroup = filterNestedChildren(
                                                        groupKey,
                                                        allInGroup,
                                                        visibilityCtx,
                                                    );
                                                    const nextVisible = [...visibleInGroup];
                                                    const [removed] = nextVisible.splice(nestedDrag.index, 1);
                                                    nextVisible.splice(childIndex, 0, removed);
                                                    const hiddenInGroup = allInGroup.filter(
                                                        (id) => !visibleInGroup.includes(id),
                                                    );
                                                    const nextGroup = [...nextVisible, ...hiddenInGroup];
                                                    return { ...prev, [groupKey]: nextGroup } as SidebarNestedOrder;
                                                });
                                                setNestedDrag(null);
                                            }}
                                            className={`px-4 py-2.5 flex items-center gap-3 cursor-grab active:cursor-grabbing select-none hover:bg-muted/20 ${nestedDrag?.group === groupKey && nestedDrag.index === childIndex ? "bg-primary/10" : ""}`}
                                        >
                                            <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                                            <span className="text-sm font-medium text-foreground">
                                                {nestedSidebarSlotLabel(t as (key: string) => string, childId)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
