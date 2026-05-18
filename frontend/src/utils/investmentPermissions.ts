/** Permissions for Investment department module (opportunities, projects, feasibility studies). */

/** Mirrors backend `COMMITTEE_DEPARTMENTS` (investmentWorkflow.controller / investmentOpportunities). */
export const INVESTMENT_COMMITTEE_DEPARTMENTS = [
  "project",
  "operation",
  "realestate",
  "investment",
  "finance",
] as const;

export type InvestmentCommitteeDepartment = (typeof INVESTMENT_COMMITTEE_DEPARTMENTS)[number];

const OPINION_ONLY_COMMITTEE_DEPARTMENTS = new Set<string>(["project", "operation", "realestate", "finance"]);

export type InvestmentPermissionUser = {
  id: string;
  role: string;
  department: string | null;
};

/** Department managers in any investment-committee department (sidebar: Investment + Franchise). */
export function isCommitteeDepartmentManagerForWorkflow(user: InvestmentPermissionUser | null): boolean {
  if (!user || user.role !== "department_manager") return false;
  const d = String(user.department || "").trim().toLowerCase();
  return INVESTMENT_COMMITTEE_DEPARTMENTS.includes(d as InvestmentCommitteeDepartment);
}

/** Project / Operation / Realestate / Finance DMs: opportunities + opinions only (no new project / feasibility tab). */
export function isCommitteeOpinionOnlyWorkflowUser(user: InvestmentPermissionUser | null): boolean {
  if (!user || user.role !== "department_manager") return false;
  const d = String(user.department || "").trim().toLowerCase();
  return OPINION_ONLY_COMMITTEE_DEPARTMENTS.has(d);
}

export function canCreateInvestmentOpportunityOrProject(user: InvestmentPermissionUser | null): boolean {
  if (!user) return false;
  if (user.role === "super_admin" || user.role === "ceo") return true;
  const dept = user.department;
  const roleOk = ["department_manager", "supervisor"].includes(user.role);
  return roleOk && (dept === "investment" || dept === "franchise");
}

export type WorkflowDepartmentType = "investment" | "franchise";

function isOwningDepartmentManager(
  user: InvestmentPermissionUser,
  departmentType: WorkflowDepartmentType,
): boolean {
  return (
    user.role === "department_manager"
    && String(user.department || "").trim().toLowerCase() === departmentType
  );
}

function resolveOpportunityWorkflowDepartment(
  opportunity: { workflow_department_type?: string | null } | null | undefined,
  fallback: WorkflowDepartmentType,
): WorkflowDepartmentType {
  const raw = String(opportunity?.workflow_department_type || "").trim().toLowerCase();
  return raw === "franchise" ? "franchise" : fallback;
}

/** Matches backend canManageOpportunityFeasibilityStudy: executives or owning dept manager. */
export function canWriteFeasibilityStudy(
  user: InvestmentPermissionUser | null,
  departmentType: WorkflowDepartmentType,
): boolean {
  if (!user) return false;
  if (user.role === "super_admin" || user.role === "ceo") return true;
  return isOwningDepartmentManager(user, departmentType);
}

export function eligibleOpportunitiesForNewStudy<
  T extends { workflow_department_type?: string | null; studies_count?: number | null },
>(
  user: InvestmentPermissionUser | null,
  opportunities: T[],
  departmentType: WorkflowDepartmentType,
): T[] {
  if (!canWriteFeasibilityStudy(user, departmentType)) return [];
  return opportunities.filter((o) => {
    const oppDept = resolveOpportunityWorkflowDepartment(o, departmentType);
    if (oppDept !== departmentType) return false;
    const count = Number(o.studies_count ?? 0);
    return count === 0;
  });
}

/** Matches backend submitStudyToCommittee: CEO/super_admin or owning department manager. */
export function canSubmitStudyToCommittee(
  user: InvestmentPermissionUser | null,
  opportunity: { workflow_department_type?: string | null } | null | undefined,
  departmentType: WorkflowDepartmentType,
): boolean {
  if (!user) return false;
  if (user.role === "super_admin" || user.role === "ceo") return true;
  const oppDept = resolveOpportunityWorkflowDepartment(opportunity, departmentType);
  return isOwningDepartmentManager(user, oppDept);
}
