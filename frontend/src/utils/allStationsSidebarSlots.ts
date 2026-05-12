/** Slot ids for All Stations sidebar (executive layout). Must match backend `EXECUTIVE_SIDEBAR_SLOT_IDS`. */

export const EXECUTIVE_SIDEBAR_SLOT_IDS = [
    "dashboard",
    "projectDept",
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
const LEGACY_EXECUTIVE_SIDEBAR_SLOT_IDS = EXECUTIVE_SIDEBAR_SLOT_IDS.filter(
    (id) => id !== "franchiseDept" && id !== "legalDept" && id !== "projectDept" && id !== "preOpening" && id !== "orderRequest" && id !== "openingSoonProjects" && id !== "tasksMenu",
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

export function isValidLegacyExecutiveSidebarOrder(order: unknown): order is string[] {
    if (!Array.isArray(order) || order.length !== LEGACY_EXECUTIVE_SIDEBAR_SLOT_IDS.length) return false;
    const seen = new Set<string>();
    for (const id of order) {
        if (typeof id !== "string" || !LEGACY_ALLOWED.has(id) || seen.has(id)) return false;
        seen.add(id);
    }
    return seen.size === LEGACY_EXECUTIVE_SIDEBAR_SLOT_IDS.length;
}

function insertFranchiseAfterInvestment(order: string[]): ExecutiveSidebarSlotId[] {
    const next = [...order];
    if (!next.includes("projectDept")) {
        const d = next.indexOf("dashboard");
        if (d >= 0) next.splice(d + 1, 0, "projectDept");
        else next.unshift("projectDept");
    }
    if (!next.includes("preOpening")) {
        const p = next.indexOf("projectDept");
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
    if (i >= 0) next.splice(i + 1, 0, "franchiseDept");
    else next.push("franchiseDept");
    const j = next.indexOf("franchiseDept");
    if (j >= 0) next.splice(j + 1, 0, "legalDept");
    else next.push("legalDept");
    return next as ExecutiveSidebarSlotId[];
}

/** Supports both new and legacy backend sidebar order schemas. */
export function normalizeExecutiveSidebarOrder(serverOrder: string[] | null): ExecutiveSidebarSlotId[] {
    if (serverOrder && isValidExecutiveSidebarOrder(serverOrder)) {
        return [...serverOrder];
    }
    if (serverOrder && isValidLegacyExecutiveSidebarOrder(serverOrder)) {
        return insertFranchiseAfterInvestment(serverOrder);
    }
    return [...EXECUTIVE_SIDEBAR_SLOT_IDS];
}

const DEPT_DEFAULT_SLOTS = [
    "dashboard",
    "projectDept",
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
] as const;

function deptMayShow(slotId: string, isFranchiseUser: boolean): boolean {
    if (slotId === "analytics" || slotId === "departments" || slotId === "systemSettings") return false;
    if (slotId === "projectDept") return true;
    if (slotId === "preOpening") return true;
    if (slotId === "orderRequest") return true;
    if (slotId === "openingSoonProjects") return true;
    if (slotId === "tasksMenu") return true;
    if (slotId === "franchiseDept") return true;
    if (slotId === "legalDept") return true;
    if (slotId === "investment") return !isFranchiseUser;
    return true;
}

/** Apply saved executive order for department-scoped users (drops slots they do not have). */
export function resolveDeptSidebarSlotOrder(
    serverOrder: string[] | null,
    isFranchiseUser: boolean,
): string[] {
    const deptAllowed = DEPT_DEFAULT_SLOTS.filter((id) => deptMayShow(id, isFranchiseUser));
    const src = normalizeExecutiveSidebarOrder(serverOrder);
    const out: string[] = [];
    const seen = new Set<string>();
    const allowedSet = new Set<string>(deptAllowed as unknown as string[]);
    for (const id of src) {
        if (!allowedSet.has(id)) continue;
        if (seen.has(id)) continue;
        out.push(id);
        seen.add(id);
    }
    for (const id of deptAllowed) {
        if (!seen.has(id)) out.push(id);
    }
    return out;
}

export function resolveExecutiveSidebarSlotOrder(serverOrder: string[] | null): ExecutiveSidebarSlotId[] {
    return normalizeExecutiveSidebarOrder(serverOrder);
}
