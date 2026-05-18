import {
    buildSidebarVisibilityContext,
    FEASIBILITY_STUDY_SIDEBAR_DEPARTMENTS,
    type SidebarVisibilityUser,
} from "@/utils/sidebarVisibility";

function normalizeDept(department: unknown): string {
    return String(department ?? "").trim().toLowerCase();
}

function isExecutive(role: unknown): boolean {
    const r = String(role ?? "").trim().toLowerCase();
    return r === "super_admin" || r === "ceo";
}

function parseTab(search: string): string | null {
    if (!search) return null;
    return new URLSearchParams(search.startsWith("?") ? search.slice(1) : search).get("tab");
}

export function canAccessPath(
    user: SidebarVisibilityUser | null | undefined,
    pathname: string,
    search = "",
): boolean {
    if (!user) return false;

    const ctx = buildSidebarVisibilityContext(user);
    const dept = normalizeDept(user.department);
    const path = pathname.toLowerCase();
    const tab = parseTab(search);

    if (path === "/all-stations-pre-opening" || path.startsWith("/all-stations-pre-opening")) {
        return ctx.showPreOpeningMenu;
    }

    if (path === "/all-stations-project" || path.startsWith("/all-stations-project")) {
        if (tab === "feasibility") {
            return (
                ctx.showFeasibilityStudyMenu ||
                ctx.showProjectMenu ||
                ctx.showInvestmentMenu ||
                ctx.showFranchiseMenu
            );
        }
        if (!tab || tab === "feasibility") {
            return ctx.showProjectMenu || ctx.showFeasibilityStudyMenu;
        }
        return ctx.showProjectMenu;
    }

    if (path.includes("/form/investment-department")) {
        if (tab === "opinions") {
            return ctx.showCommitteeOpinionsNav || ctx.showInvestmentMenu;
        }
        if (tab === "investment-feasibility") {
            return ctx.showInvestmentMenu;
        }
        if (tab === "new-project" || tab === "opportunities") {
            return ctx.showInvestmentMenu;
        }
        return ctx.showInvestmentMenu || ctx.showCommitteeOpinionsNav;
    }

    if (path.includes("/form/franchise-department")) {
        return ctx.showFranchiseMenu;
    }

    if (path === "/all-stations-legal") {
        return ctx.showLegalMenu;
    }

    if (path === "/all-stations-list") {
        return true;
    }

    if (path.startsWith("/station/")) {
        return true;
    }

    return true;
}

export function getDefaultRedirectPath(user: SidebarVisibilityUser | null | undefined): string {
    const dept = normalizeDept(user?.department);
    if ((FEASIBILITY_STUDY_SIDEBAR_DEPARTMENTS as readonly string[]).includes(dept)) {
        return "/all-stations-project?tab=feasibility";
    }
    if (dept === "investment") {
        return "/station/new-station/form/investment-department?tab=opportunities";
    }
    if (dept === "franchise") {
        return "/station/new-station/form/franchise-department?tab=opportunities";
    }
    if (dept === "project") {
        return "/all-stations-list";
    }
    return "/all-stations-dashboard";
}
