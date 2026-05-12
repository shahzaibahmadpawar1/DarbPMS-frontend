/** Routes and query helpers for investment/franchise department workflows. */

export type WorkflowDepartmentType = "investment" | "franchise";

export const INVESTMENT_DEPT_PATH = "/station/new-station/form/investment-department";
export const FRANCHISE_DEPT_PATH = "/station/new-station/form/franchise-department";

export type WorkflowNavTab = "new-project" | "opportunities" | "investment-feasibility" | "opinions";
export type InvestmentDeptNavTab = WorkflowNavTab;

export function workflowDeptPath(dept: WorkflowDepartmentType): string {
    return dept === "franchise" ? FRANCHISE_DEPT_PATH : INVESTMENT_DEPT_PATH;
}

export function workflowDepartmentFromPath(pathname: string): WorkflowDepartmentType | null {
    if (pathname.endsWith("/franchise-department")) return "franchise";
    if (pathname.endsWith("/investment-department")) return "investment";
    return null;
}

export function isInvestmentDepartmentPath(pathname: string): boolean {
    return workflowDepartmentFromPath(pathname) === "investment";
}

export function isWorkflowDepartmentPath(pathname: string, dept: WorkflowDepartmentType): boolean {
    return workflowDepartmentFromPath(pathname) === dept;
}

export function resolveWorkflowDeptTabFromQuery(
    tabParam: string | null,
    canCreateProject: boolean,
    committeeOpinionOnly = false,
): WorkflowNavTab {
    if (committeeOpinionOnly) {
        const allowed: WorkflowNavTab[] = ["opportunities", "opinions"];
        if (tabParam && (allowed as string[]).includes(tabParam)) {
            return tabParam as WorkflowNavTab;
        }
        return "opinions";
    }
    const allowed: WorkflowNavTab[] = [
        ...(canCreateProject ? (["new-project"] as const) : []),
        "opportunities",
        "investment-feasibility",
        "opinions",
    ];
    if (tabParam && (allowed as string[]).includes(tabParam)) {
        return tabParam as WorkflowNavTab;
    }
    return canCreateProject ? "new-project" : "opportunities";
}

export function resolveInvestmentDeptTabFromQuery(
    tabParam: string | null,
    canCreateProject: boolean,
    committeeOpinionOnly = false,
): InvestmentDeptNavTab {
    return resolveWorkflowDeptTabFromQuery(tabParam, canCreateProject, committeeOpinionOnly);
}

export function workflowDeptHref(
    dept: WorkflowDepartmentType,
    tab: WorkflowNavTab,
    canCreateProject: boolean,
    committeeOpinionOnly = false,
): string {
    const defaultTab = resolveWorkflowDeptTabFromQuery(null, canCreateProject, committeeOpinionOnly);
    const qs = tab === defaultTab ? "" : `?tab=${encodeURIComponent(tab)}`;
    return `${workflowDeptPath(dept)}${qs}`;
}

export function investmentDeptHref(
    tab: InvestmentDeptNavTab,
    canCreateProject: boolean,
    committeeOpinionOnly = false,
): string {
    return workflowDeptHref("investment", tab, canCreateProject, committeeOpinionOnly);
}

export function workflowDeptChildIsActive(
    pathname: string,
    search: string,
    dept: WorkflowDepartmentType,
    tab: WorkflowNavTab,
    canCreateProject: boolean,
    committeeOpinionOnly = false,
): boolean {
    if (!isWorkflowDepartmentPath(pathname, dept)) return false;
    const effective = resolveWorkflowDeptTabFromQuery(
        new URLSearchParams(search).get("tab"),
        canCreateProject,
        committeeOpinionOnly,
    );
    return effective === tab;
}

export function investmentDeptChildIsActive(
    pathname: string,
    search: string,
    tab: InvestmentDeptNavTab,
    canCreateProject: boolean,
    committeeOpinionOnly = false,
): boolean {
    return workflowDeptChildIsActive(pathname, search, "investment", tab, canCreateProject, committeeOpinionOnly);
}
