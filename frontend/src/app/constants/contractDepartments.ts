/** Departments available when CEO sends an opportunity for contract. */
export const CEO_CONTRACT_DEPARTMENT_OPTIONS = [
    { value: "project", label: "Project" },
    { value: "operation", label: "Operation" },
    { value: "realestate", label: "Realestate" },
    { value: "investment", label: "Investment" },
    { value: "finance", label: "Finance" },
    { value: "legal", label: "Legal" },
] as const;

export type CeoContractDepartment = (typeof CEO_CONTRACT_DEPARTMENT_OPTIONS)[number]["value"];
