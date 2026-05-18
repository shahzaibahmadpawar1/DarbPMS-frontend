/** Slot ids for All Stations sidebar (executive layout). Must match backend `EXECUTIVE_SIDEBAR_SLOT_IDS`. */

export const EXECUTIVE_SIDEBAR_SLOT_IDS = [
    "dashboard",
    "projectDept",
    "feasibilityStudy",
    "preOpening",
    "orderRequest",
    "openingSoonProjects",
    "tasksMenu",
    "recentActivities",
    "analytics",
    "stations",
    "departments",
    "requests",
    "underReview",
    "tasks",
    "reports",
    "contactCEO",
    "investment",
    "franchiseDept",
    "legalDept",
    "systemSettings",
] as const;

export type ExecutiveSidebarSlotId = (typeof EXECUTIVE_SIDEBAR_SLOT_IDS)[number];

const ALLOWED = new Set<string>(EXECUTIVE_SIDEBAR_SLOT_IDS);

/** Pre-feasibilityStudy sidebar (19 slots). */
const PRE_FEASIBILITY_SIDEBAR_SLOT_IDS = EXECUTIVE_SIDEBAR_SLOT_IDS.filter(
    (id) => id !== "feasibilityStudy",
) as readonly string[];

const LEGACY_EXECUTIVE_SIDEBAR_SLOT_IDS = PRE_FEASIBILITY_SIDEBAR_SLOT_IDS.filter(
    (id) =>
        id !== "franchiseDept" &&
        id !== "legalDept" &&
        id !== "projectDept" &&
        id !== "preOpening" &&
        id !== "orderRequest" &&
        id !== "openingSoonProjects" &&
        id !== "tasksMenu",
) as readonly string[];

const LEGACY_ALLOWED = new Set<string>(LEGACY_EXECUTIVE_SIDEBAR_SLOT_IDS);

export function isValidExecutiveSidebarOrder(order: unknown): order is ExecutiveSidebarSlotId[] {
    if (!Array.isArray(order) || order.length !== EXECUTIVE_SIDEBAR_SLOT_IDS.length) return false;
    const seen = new Set<string>();
    for (const id of order) {
        if (typeof id !== "string" || !ALLOWED.has(id) || seen.has(id)) return false;
        seen.add(id);
    }
    return seen.size === EXECUTIVE_SIDEBAR_SLOT_IDS.length;
}

function isValidPreFeasibilityOrder(order: unknown): order is string[] {
    if (!Array.isArray(order) || order.length !== PRE_FEASIBILITY_SIDEBAR_SLOT_IDS.length) return false;
    const allowed = new Set<string>(PRE_FEASIBILITY_SIDEBAR_SLOT_IDS);
    const seen = new Set<string>();
    for (const id of order) {
        if (typeof id !== "string" || !allowed.has(id) || seen.has(id)) return false;
        seen.add(id);
    }
    return seen.size === PRE_FEASIBILITY_SIDEBAR_SLOT_IDS.length;
}

export function isValidLegacyExecutiveSidebarOrder(order: unknown): order is string[] {
    if (!Array.isArray(order) || order.length !== LEGACY_EXECUTIVE_SIDEBAR_SLOT_IDS.length) return false;
    const seen = new Set<string>();
    for (const id of order) {
        if (typeof id !== "string" || !LEGACY_ALLOWED.has(id) || seen.has(id)) return false;
        seen.add(id);
    }
    return seen.size === LEGACY_EXECUTIVE_SIDEBAR_SLOT_IDS.length;
}

function insertFeasibilityStudyAfterProject(order: string[]): ExecutiveSidebarSlotId[] {
    const next = [...order];
    if (!next.includes("feasibilityStudy")) {
        const p = next.indexOf("projectDept");
        if (p >= 0) next.splice(p + 1, 0, "feasibilityStudy");
        else {
            const d = next.indexOf("dashboard");
            if (d >= 0) next.splice(d + 1, 0, "feasibilityStudy");
            else next.unshift("feasibilityStudy");
        }
    }
    for (const id of EXECUTIVE_SIDEBAR_SLOT_IDS) {
        if (!next.includes(id)) next.push(id);
    }
    return next.filter((id) => ALLOWED.has(id)) as ExecutiveSidebarSlotId[];
}

function insertFranchiseAfterInvestment(order: string[]): ExecutiveSidebarSlotId[] {
    const next = insertFeasibilityStudyAfterProject([...order]);
    if (!next.includes("projectDept")) {
        const d = next.indexOf("dashboard");
        if (d >= 0) next.splice(d + 1, 0, "projectDept");
        else next.unshift("projectDept");
    }
    if (!next.includes("preOpening")) {
        const fs = next.indexOf("feasibilityStudy");
        const p = fs >= 0 ? fs : next.indexOf("projectDept");
        if (p >= 0) next.splice(p + 1, 0, "preOpening");
        else next.unshift("preOpening");
    }
    if (!next.includes("orderRequest")) {
        const p = next.indexOf("preOpening");
        if (p >= 0) next.splice(p + 1, 0, "orderRequest");
        else next.unshift("orderRequest");
    }
    if (!next.includes("openingSoonProjects")) {
        const p = next.indexOf("orderRequest");
        if (p >= 0) next.splice(p + 1, 0, "openingSoonProjects");
        else next.unshift("openingSoonProjects");
    }
    if (!next.includes("tasksMenu")) {
        const p = next.indexOf("openingSoonProjects");
        if (p >= 0) next.splice(p + 1, 0, "tasksMenu");
        else next.unshift("tasksMenu");
    }
    const i = next.indexOf("investment");
    if (i >= 0 && !next.includes("franchiseDept")) next.splice(i + 1, 0, "franchiseDept");
    else if (!next.includes("franchiseDept")) next.push("franchiseDept");
    const j = next.indexOf("franchiseDept");
    if (j >= 0 && !next.includes("legalDept")) next.splice(j + 1, 0, "legalDept");
    else if (!next.includes("legalDept")) next.push("legalDept");
    return next.filter((id) => ALLOWED.has(id)) as ExecutiveSidebarSlotId[];
}

/** Supports current, pre-feasibility (19), and legacy backend sidebar order schemas. */
export function normalizeExecutiveSidebarOrder(serverOrder: string[] | null): ExecutiveSidebarSlotId[] {
    if (serverOrder && isValidExecutiveSidebarOrder(serverOrder)) {
        return [...serverOrder];
    }
    if (serverOrder && isValidPreFeasibilityOrder(serverOrder)) {
        return insertFeasibilityStudyAfterProject(serverOrder);
    }
    if (serverOrder && isValidLegacyExecutiveSidebarOrder(serverOrder)) {
        return insertFranchiseAfterInvestment(serverOrder);
    }
    return [...EXECUTIVE_SIDEBAR_SLOT_IDS];
}

const DEPT_DEFAULT_SLOTS = [
    "dashboard",
    "projectDept",
    "feasibilityStudy",
    "preOpening",
    "orderRequest",
    "openingSoonProjects",
    "tasksMenu",
    "recentActivities",
    "franchiseDept",
    "legalDept",
    "underReview",
    "stations",
    "requests",
    "tasks",
    "reports",
    "contactCEO",
    "investment",
    "systemSettings",
] as const;

/** Apply saved executive order for department-scoped users (drops slots they do not have). */
export function resolveDeptSidebarSlotOrder(
    serverOrder: string[] | null,
    _isFranchiseUser: boolean,
    isSlotVisible?: (slotId: string) => boolean,
): string[] {
    const src = normalizeExecutiveSidebarOrder(serverOrder);
    const out: string[] = [];
    const seen = new Set<string>();
    for (const id of src) {
        if (isSlotVisible && !isSlotVisible(id)) continue;
        if (seen.has(id)) continue;
        out.push(id);
        seen.add(id);
    }
    for (const id of DEPT_DEFAULT_SLOTS) {
        if (isSlotVisible && !isSlotVisible(id)) continue;
        if (!seen.has(id)) out.push(id);
    }
    return out;
}

/** Executive layout: optionally hide slots the user cannot see in the sidebar. */
export function resolveExecutiveSidebarSlotOrderFiltered(
    serverOrder: string[] | null,
    isSlotVisible?: (slotId: string) => boolean,
): ExecutiveSidebarSlotId[] {
    const src = normalizeExecutiveSidebarOrder(serverOrder);
    if (!isSlotVisible) return src;
    return src.filter((id) => isSlotVisible(id));
}

export function resolveExecutiveSidebarSlotOrder(serverOrder: string[] | null): ExecutiveSidebarSlotId[] {
    return normalizeExecutiveSidebarOrder(serverOrder);
}
