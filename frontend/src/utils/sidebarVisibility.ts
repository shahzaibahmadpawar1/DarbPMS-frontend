import { isLegalDepartment } from "@/services/api";
import {
    canCreateInvestmentOpportunityOrProject,
    INVESTMENT_COMMITTEE_DEPARTMENTS,
    isCommitteeDepartmentManagerForWorkflow,
    type InvestmentPermissionUser,
} from "@/utils/investmentPermissions";
import type { SidebarNestedOrder } from "@/utils/sidebarNestedOrder";

/** Top-level slots that AllStationsSidebarSlot never renders (legacy flat links). */
const NEVER_RENDERED_TOP_LEVEL_SLOTS = new Set([
    "analytics",
    "recentActivities",
    "stations",
    "reports",
    "requests",
    "tasks",
    "underReview",
]);

export const FEASIBILITY_STUDY_SIDEBAR_DEPARTMENTS = [
    "project",
    "operation",
    "finance",
    "realestate",
] as const;

export type FeasibilityStudySidebarDepartment = (typeof FEASIBILITY_STUDY_SIDEBAR_DEPARTMENTS)[number];

function normalizeDept(department: unknown): string {
    return String(department ?? "").trim().toLowerCase();
}

function isExecutiveRole(role: unknown): boolean {
    const r = String(role ?? "").trim().toLowerCase();
    return r === "super_admin" || r === "ceo";
}

export function isFeasibilityStudySidebarDepartment(department: unknown): boolean {
    const d = normalizeDept(department);
    return (FEASIBILITY_STUDY_SIDEBAR_DEPARTMENTS as readonly string[]).includes(d);
}

export type SidebarVisibilityUser = InvestmentPermissionUser & {
    role: string;
    department: string | null;
};

export type SidebarVisibilityContext = {
    isDeptUser: boolean;
    isFranchiseUser: boolean;
    isExecutive: boolean;
    showInvestmentMenu: boolean;
    showFranchiseMenu: boolean;
    showLegalMenu: boolean;
    showProjectMenu: boolean;
    showStationsListNav: boolean;
    showPreOpeningMenu: boolean;
    showFeasibilityStudyMenu: boolean;
    showCommitteeOpinionsNav: boolean;
    showOrderRequestMenu: boolean;
    showOpeningSoonMenu: boolean;
    showTasksMenu: boolean;
    showSystemUsers: boolean;
    showCompanyInfo: boolean;
    showUserSettings: boolean;
    canCreateInvestmentNav: boolean;
};

export function buildSidebarVisibilityContext(
    user: SidebarVisibilityUser | null | undefined,
): SidebarVisibilityContext {
    const isDeptUser = !!user && !isExecutiveRole(user.role);
    const isExecutive = !!user && isExecutiveRole(user.role);
    const dept = normalizeDept(user?.department);
    const canCreateDepartmentProject =
        !!user && ["super_admin", "department_manager", "supervisor"].includes(user.role);
    const isFranchiseUser =
        isDeptUser && canCreateDepartmentProject && dept === "franchise";
    const canCreateInvestmentNav = canCreateInvestmentOpportunityOrProject(user);

    const showCommitteeOpinionsNav =
        !!user &&
        (isExecutive ||
            (user.role === "department_manager" &&
                dept !== "investment" &&
                isCommitteeDepartmentManagerForWorkflow(user)));

    return {
        isDeptUser,
        isFranchiseUser,
        isExecutive,
        showInvestmentMenu: !!user && (isExecutive || dept === "investment"),
        showFranchiseMenu: !!user && (isExecutive || dept === "franchise"),
        showLegalMenu:
            !!user &&
            (isExecutive || isLegalDepartment(user.department)),
        showProjectMenu: !!user && (isExecutive || dept === "project"),
        showPreOpeningMenu: !!user && (isExecutive || dept === "project"),
        showStationsListNav: !!user,
        showFeasibilityStudyMenu:
            !!user && (isExecutive || isFeasibilityStudySidebarDepartment(dept)),
        showCommitteeOpinionsNav,
        showOrderRequestMenu: !!user,
        showOpeningSoonMenu: !!user,
        showTasksMenu: !!user,
        showSystemUsers: user?.role === "super_admin" || user?.role === "ceo",
        showCompanyInfo: user?.role === "super_admin",
        showUserSettings: !!user,
        canCreateInvestmentNav,
    };
}

export function isTopLevelSlotVisible(slotId: string, ctx: SidebarVisibilityContext): boolean {
    if (NEVER_RENDERED_TOP_LEVEL_SLOTS.has(slotId)) return false;
    if (slotId === "departments") return !ctx.isDeptUser;
    if (slotId === "investment") return ctx.showInvestmentMenu;
    if (slotId === "franchiseDept") return ctx.showFranchiseMenu;
    if (slotId === "legalDept") return ctx.showLegalMenu;
    if (slotId === "stations") return ctx.showStationsListNav;
    if (slotId === "projectDept") return ctx.showProjectMenu;
    if (slotId === "preOpening") return ctx.showPreOpeningMenu;
    if (slotId === "feasibilityStudy") return ctx.showFeasibilityStudyMenu;
    return true;
}

export function getReorderableTopLevelSlots(fullOrder: string[], ctx: SidebarVisibilityContext): string[] {
    return fullOrder.filter((id) => isTopLevelSlotVisible(id, ctx));
}

export function mergeReorderIntoFullOrder(
    reorderedVisible: string[],
    fullOrder: string[],
    ctx: SidebarVisibilityContext,
): string[] {
    const invisible = fullOrder.filter((id) => !isTopLevelSlotVisible(id, ctx));
    return [...reorderedVisible, ...invisible];
}

const NESTED_GROUP_PARENT_SLOT: Record<keyof SidebarNestedOrder, string> = {
    dashboard: "dashboard",
    projectDept: "projectDept",
    feasibilityStudy: "feasibilityStudy",
    preOpening: "preOpening",
    orderRequest: "orderRequest",
    openingSoonProjects: "openingSoonProjects",
    tasksMenu: "tasksMenu",
    investment: "investment",
    franchiseDept: "franchiseDept",
    legalDept: "legalDept",
    systemSettings: "systemSettings",
};

export function isNestedGroupVisible(
    groupKey: keyof SidebarNestedOrder,
    ctx: SidebarVisibilityContext,
): boolean {
    const parentSlot = NESTED_GROUP_PARENT_SLOT[groupKey];
    return isTopLevelSlotVisible(parentSlot, ctx);
}

export function filterNestedChildren(
    groupKey: keyof SidebarNestedOrder,
    children: string[],
    ctx: SidebarVisibilityContext,
): string[] {
    if (groupKey === "dashboard") {
        return children.filter((childId) => {
            if (ctx.isDeptUser && (childId === "analytics" || childId === "recentActivities" || childId === "underReview")) {
                return false;
            }
            if (childId === "investmentOpportunities") return ctx.showInvestmentMenu;
            if (childId === "franchiseOpportunities") return ctx.showFranchiseMenu;
            if (childId === "quickActions" || childId === "alertsNotifications") return ctx.isExecutive;
            return true;
        });
    }

    if (groupKey === "projectDept") {
        return children.filter((childId) => {
            if (childId === "feasibility" || childId === "newProject") return false;
            return childId === "stations" || childId === "siteSurvey" || childId === "reports";
        });
    }

    if (groupKey === "feasibilityStudy") {
        return children.filter((childId) => {
            if (childId === "overview") return ctx.showFeasibilityStudyMenu;
            if (childId === "committeeOpinions") return ctx.showCommitteeOpinionsNav;
            return false;
        });
    }

    if (groupKey === "investment" || groupKey === "franchiseDept") {
        return children.filter((childId) => {
            if (childId === "new-project") return ctx.canCreateInvestmentNav;
            return true;
        });
    }

    if (groupKey === "systemSettings") {
        return children.filter((childId) => {
            if (childId === "users") return ctx.showSystemUsers;
            if (childId === "userSettings") return ctx.showUserSettings;
            if (childId === "companyInfo") return ctx.showCompanyInfo;
            return true;
        });
    }

    return children;
}

export function getVisibleNestedGroups(ctx: SidebarVisibilityContext): Array<keyof SidebarNestedOrder> {
    return (Object.keys(NESTED_GROUP_PARENT_SLOT) as Array<keyof SidebarNestedOrder>).filter((key) =>
        isNestedGroupVisible(key, ctx),
    );
}

/** Committee departments that may use the shared opinions route (excludes investment — uses workflow menu). */
export function isCommitteeOpinionDepartment(department: unknown): boolean {
    const d = normalizeDept(department);
    return (
        d !== "investment" &&
        (INVESTMENT_COMMITTEE_DEPARTMENTS as readonly string[]).includes(d)
    );
}
