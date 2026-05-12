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

export function canWriteFeasibilityStudy(
  user: InvestmentPermissionUser | null,
  opportunities: Array<{ investment_specialist_user_id?: string | null }>,
): boolean {
  if (!user) return false;
  if (user.role === "super_admin" || user.role === "ceo") return true;
  return opportunities.some((o) => String(o.investment_specialist_user_id || "") === user.id);
}

export function eligibleOpportunitiesForNewStudy<T extends { investment_specialist_user_id?: string | null }>(
  user: InvestmentPermissionUser | null,
  opportunities: T[],
): T[] {
  if (!user) return [];
  if (user.role === "super_admin" || user.role === "ceo") return opportunities;
  return opportunities.filter((o) => String(o.investment_specialist_user_id || "") === user.id);
}

/** Matches backend submitStudyToCommittee: CEO/super_admin or assigned investment specialist. */
export function canSubmitStudyToCommittee(
  user: InvestmentPermissionUser | null,
  opportunity: { investment_specialist_user_id?: string | null } | null | undefined,
): boolean {
  if (!user) return false;
  if (user.role === "super_admin" || user.role === "ceo") return true;
  return String(opportunity?.investment_specialist_user_id || "") === user.id;
}
