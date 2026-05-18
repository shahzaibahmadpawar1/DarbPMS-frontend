export const DASHBOARD_CHILD_IDS = [
    "dashboard",
    "analytics",
    "recentActivities",
    "underReview",
    "investmentOpportunities",
    "franchiseOpportunities",
    "quickActions",
    "alertsNotifications",
] as const;

export const WORKFLOW_CHILD_IDS = [
    "new-project",
    "opportunities",
    "investment-feasibility",
    "opinions",
    "reports",
] as const;

export const FEASIBILITY_STUDY_CHILD_IDS = ["overview", "committeeOpinions"] as const;

export const PROJECT_DEPT_CHILD_IDS = ["stations", "siteSurvey", "reports"] as const;

export const SYSTEM_SETTINGS_CHILD_IDS = [
    "users",
    "userSettings",
    "companyInfo",
    "notifications",
    "backup",
] as const;

function normalizeSystemSettingsChildren(children: string[]): SystemSettingsChildId[] {
    const allowed = [...SYSTEM_SETTINGS_CHILD_IDS];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const id of children) {
        if (!allowed.includes(id as SystemSettingsChildId) || seen.has(id)) continue;
        out.push(id);
        seen.add(id);
    }
    if (!seen.has("userSettings")) {
        const usersIdx = out.indexOf("users");
        if (usersIdx >= 0) out.splice(usersIdx + 1, 0, "userSettings");
        else out.unshift("userSettings");
        seen.add("userSettings");
    }
    for (const id of allowed) {
        if (!seen.has(id)) out.push(id);
    }
    return out as SystemSettingsChildId[];
}

export type DashboardChildId = (typeof DASHBOARD_CHILD_IDS)[number];
export type WorkflowChildId = (typeof WORKFLOW_CHILD_IDS)[number];
export type FeasibilityStudyChildId = (typeof FEASIBILITY_STUDY_CHILD_IDS)[number];
export type ProjectDeptChildId = (typeof PROJECT_DEPT_CHILD_IDS)[number];
export type SystemSettingsChildId = (typeof SYSTEM_SETTINGS_CHILD_IDS)[number];

export type SidebarNestedOrder = {
    dashboard: DashboardChildId[];
    projectDept: ProjectDeptChildId[];
    feasibilityStudy: FeasibilityStudyChildId[];
    preOpening: ["governmentLicenses", "otherLicenses"];
    orderRequest: ["newRequest", "submittedApprovedRequests"];
    openingSoonProjects: ["trackNearLaunchProject"];
    tasksMenu: ["tasks"];
    investment: WorkflowChildId[];
    franchiseDept: WorkflowChildId[];
    legalDept: ["contract", "document", "reports"];
    systemSettings: SystemSettingsChildId[];
};

export const DEFAULT_SIDEBAR_NESTED_ORDER: SidebarNestedOrder = {
    dashboard: [...DASHBOARD_CHILD_IDS],
    projectDept: [...PROJECT_DEPT_CHILD_IDS],
    feasibilityStudy: [...FEASIBILITY_STUDY_CHILD_IDS],
    preOpening: ["governmentLicenses", "otherLicenses"],
    orderRequest: ["newRequest", "submittedApprovedRequests"],
    openingSoonProjects: ["trackNearLaunchProject"],
    tasksMenu: ["tasks"],
    investment: [...WORKFLOW_CHILD_IDS],
    franchiseDept: [...WORKFLOW_CHILD_IDS],
    legalDept: ["contract", "document", "reports"],
    systemSettings: [...SYSTEM_SETTINGS_CHILD_IDS],
};

function isValidPermutation<T extends string>(value: unknown, allowed: readonly T[]): value is T[] {
    if (!Array.isArray(value) || value.length !== allowed.length) return false;
    const allowedSet = new Set<string>(allowed);
    const seen = new Set<string>();
    for (const id of value) {
        if (typeof id !== "string" || !allowedSet.has(id) || seen.has(id)) return false;
        seen.add(id);
    }
    return seen.size === allowed.length;
}

function mergeLegacyProjectDeptChildren(raw: unknown): ProjectDeptChildId[] {
    const allowed = new Set<string>(PROJECT_DEPT_CHILD_IDS);
    const out: string[] = [];
    if (Array.isArray(raw)) {
        for (const id of raw) {
            if (typeof id !== "string") continue;
            if (id === "feasibility" || id === "newProject") continue;
            if (allowed.has(id) && !out.includes(id)) out.push(id);
        }
    }
    for (const id of PROJECT_DEPT_CHILD_IDS) {
        if (!out.includes(id)) out.push(id);
    }
    return out as ProjectDeptChildId[];
}

export function isValidSidebarNestedOrder(value: unknown): value is SidebarNestedOrder {
    if (!value || typeof value !== "object") return false;
    const src = value as Partial<Record<keyof SidebarNestedOrder, unknown>>;
    return (
        isValidPermutation(src.dashboard, DASHBOARD_CHILD_IDS) &&
        isValidPermutation(src.projectDept, PROJECT_DEPT_CHILD_IDS) &&
        isValidPermutation(src.feasibilityStudy, FEASIBILITY_STUDY_CHILD_IDS) &&
        isValidPermutation(src.preOpening, ["governmentLicenses", "otherLicenses"] as const) &&
        isValidPermutation(src.orderRequest, ["newRequest", "submittedApprovedRequests"] as const) &&
        isValidPermutation(src.openingSoonProjects, ["trackNearLaunchProject"] as const) &&
        isValidPermutation(src.tasksMenu, ["tasks"] as const) &&
        isValidPermutation(src.investment, WORKFLOW_CHILD_IDS) &&
        isValidPermutation(src.franchiseDept, WORKFLOW_CHILD_IDS) &&
        isValidPermutation(src.legalDept, ["contract", "document", "reports"] as const) &&
        isValidPermutation(src.systemSettings, SYSTEM_SETTINGS_CHILD_IDS)
    );
}

export function normalizeSidebarNestedOrder(value: unknown): SidebarNestedOrder {
    if (isValidSidebarNestedOrder(value)) {
        return {
            dashboard: [...value.dashboard],
            projectDept: [...value.projectDept],
            feasibilityStudy: [...value.feasibilityStudy],
            preOpening: [...value.preOpening],
            orderRequest: [...value.orderRequest],
            openingSoonProjects: [...value.openingSoonProjects],
            tasksMenu: [...value.tasksMenu],
            investment: [...value.investment],
            franchiseDept: [...value.franchiseDept],
            legalDept: [...value.legalDept],
            systemSettings: [...value.systemSettings],
        };
    }
    const src = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
    const dashboard = isValidPermutation(src.dashboard, DASHBOARD_CHILD_IDS)
        ? [...src.dashboard]
        : [...DEFAULT_SIDEBAR_NESTED_ORDER.dashboard];
    const investment = isValidPermutation(src.investment, WORKFLOW_CHILD_IDS)
        ? [...src.investment]
        : [...DEFAULT_SIDEBAR_NESTED_ORDER.investment];
    const projectDept = isValidPermutation(src.projectDept, PROJECT_DEPT_CHILD_IDS)
        ? [...src.projectDept]
        : mergeLegacyProjectDeptChildren(src.projectDept);
    const feasibilityStudy = isValidPermutation(src.feasibilityStudy, FEASIBILITY_STUDY_CHILD_IDS)
        ? [...src.feasibilityStudy]
        : [...DEFAULT_SIDEBAR_NESTED_ORDER.feasibilityStudy];
    const preOpening = isValidPermutation(src.preOpening, ["governmentLicenses", "otherLicenses"] as const)
        ? [...src.preOpening]
        : [...DEFAULT_SIDEBAR_NESTED_ORDER.preOpening];
    const orderRequest = isValidPermutation(src.orderRequest, ["newRequest", "submittedApprovedRequests"] as const)
        ? [...src.orderRequest]
        : [...DEFAULT_SIDEBAR_NESTED_ORDER.orderRequest];
    const openingSoonProjects = isValidPermutation(src.openingSoonProjects, ["trackNearLaunchProject"] as const)
        ? [...src.openingSoonProjects]
        : [...DEFAULT_SIDEBAR_NESTED_ORDER.openingSoonProjects];
    const tasksMenu = isValidPermutation(src.tasksMenu, ["tasks"] as const)
        ? [...src.tasksMenu]
        : [...DEFAULT_SIDEBAR_NESTED_ORDER.tasksMenu];
    const franchiseDept = isValidPermutation(src.franchiseDept, WORKFLOW_CHILD_IDS)
        ? [...src.franchiseDept]
        : [...DEFAULT_SIDEBAR_NESTED_ORDER.franchiseDept];
    const legalDept = isValidPermutation(src.legalDept, ["contract", "document", "reports"] as const)
        ? [...src.legalDept]
        : [...DEFAULT_SIDEBAR_NESTED_ORDER.legalDept];
    const systemRaw = Array.isArray(src.systemSettings)
        ? src.systemSettings.filter((v): v is string => typeof v === "string")
        : [];
    const systemSettings = normalizeSystemSettingsChildren(systemRaw);
    return {
        dashboard,
        projectDept,
        feasibilityStudy,
        preOpening,
        orderRequest,
        openingSoonProjects,
        tasksMenu,
        investment,
        franchiseDept,
        legalDept,
        systemSettings,
    };
}
