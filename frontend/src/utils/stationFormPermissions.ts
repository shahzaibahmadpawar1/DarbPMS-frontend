import { Department, isLegalDepartment, normalizeUserRole, UserRole } from "@/services/api";

export type StationFormUser = {
    role?: string | null;
    department?: string | null;
} | null | undefined;

/** Station essentials + licenses — project department and super-admin only. */
export const PROJECT_ONLY_FORM_KEYS = new Set([
    "station-information",
    "cameras",
    "dispensers",
    "nozzles",
    "tanks",
    "areas",
    "owner-information",
    "deed-information",
    "building-permit",
    "commercial-license",
    "salamah-license",
    "taqyees-license",
    "environmental-license",
    "government-license-attachments",
    "survey-report",
    "fixed-assets",
    "energy-license",
    "certificates",
    "complaint-contact",
]);

/** Form paths owned by a specific department (workflow or single-form exception). */
export const DEPARTMENT_OWNED_FORM_KEYS: Record<string, Department> = {
    "investment-department": "investment",
    investment: "investment",
    "franchise-department": "franchise",
};

export const CONTRACT_FORM_KEY = "contract";

function normalizeDepartment(value: unknown): Department | null {
    const raw = String(value ?? "").trim().toLowerCase();
    if (raw === "frenchise") return "franchise";
    const allowed: Department[] = [
        "investment", "franchise", "it", "project", "finance", "operation",
        "maintanance", "hr", "realestate", "procurement", "quality", "marketing",
        "property_management", "legal", "government_relations", "safety",
    ];
    return (allowed as string[]).includes(raw) ? (raw as Department) : null;
}

export function isProjectDepartment(department: unknown): boolean {
    return normalizeDepartment(department) === "project";
}

export function isSuperAdmin(role: unknown): boolean {
    return normalizeUserRole(role) === "super_admin";
}

export function canManageAllStationForms(user: StationFormUser): boolean {
    if (!user) return false;
    return isSuperAdmin(user.role) || isProjectDepartment(user.department);
}

/** Any authenticated user may open the stations list and per-station form hub (read-only unless canManage). */
export function canViewStationPages(user: StationFormUser): boolean {
    return Boolean(user);
}

export function canDeleteStation(user: StationFormUser): boolean {
    return canManageAllStationForms(user);
}

export function canCreateStationRecord(user: StationFormUser): boolean {
    return canManageAllStationForms(user);
}

export function extractFormPathFromPathname(pathname: string): string | null {
    const match = pathname.match(/\/station\/[^/]+\/form\/([^/?#]+)/i);
    return match?.[1] ?? null;
}

export function canEditStationForm(
    user: StationFormUser,
    formPath: string | null | undefined,
    _options?: { stationId?: string | null },
): boolean {
    if (!user || !formPath) return false;

    const path = formPath.trim().toLowerCase();
    const role = normalizeUserRole(user.role);
    const dept = normalizeDepartment(user.department);

    if (isSuperAdmin(role)) return true;
    if (isProjectDepartment(dept)) return true;

    if (path === CONTRACT_FORM_KEY) {
        return isLegalDepartment(dept);
    }

    const ownedDept = DEPARTMENT_OWNED_FORM_KEYS[path];
    if (ownedDept) {
        return dept === ownedDept;
    }

    if (PROJECT_ONLY_FORM_KEYS.has(path)) {
        return false;
    }

    // Other department pages (it-department, legal-department, etc.) — project/super_admin only (handled above).
    return false;
}

export function resolveStationAccessMode(
    user: StationFormUser,
    pathname: string,
): "admin" | "view-only" | null {
    if (!/^\/station\/[^/]+/i.test(pathname)) return null;

    const formPath = extractFormPathFromPathname(pathname);
    if (!formPath) {
        return canManageAllStationForms(user) ? "admin" : "view-only";
    }
    return canEditStationForm(user, formPath) ? "admin" : "view-only";
}

/** Backend form keys for mutation middleware (subset aligned with API resources). */
export type StationFormMutationKey =
    | "station-information"
    | "contract"
    | "investment-workflow"
    | "franchise-workflow"
    | "default";

export function formPathToMutationKey(formPath: string | null | undefined): StationFormMutationKey {
    if (!formPath) return "default";
    const path = formPath.trim().toLowerCase();
    if (path === CONTRACT_FORM_KEY) return "contract";
    if (path === "investment-department" || path === "investment") return "investment-workflow";
    if (path === "franchise-department") return "franchise-workflow";
    if (path === "station-information") return "station-information";
    return "default";
}
