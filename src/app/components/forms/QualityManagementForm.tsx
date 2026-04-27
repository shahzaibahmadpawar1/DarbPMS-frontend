import { GenericDepartmentForm } from "./GenericDepartmentForm";

export function QualityManagementForm() {
    return (
        <GenericDepartmentForm
            title="Quality Management"
            description="Manage quality standards and audits"
            fields={[
                { name: "auditId", label: "Audit ID", type: "text", required: true, demoValue: "QA-N101-008" },
                { name: "auditType", label: "Audit Type", type: "text", demoValue: "Safety & Hygiene Inspection" },
                { name: "auditor", label: "Auditor", type: "text", demoValue: "Saleh bin Bakr" },
                { name: "date", label: "Audit Date", type: "date", demoValue: "2024-06-20" },
                { name: "score", label: "Quality Score", type: "number", demoValue: "94" },
                { name: "status", label: "Status", type: "select", demoValue: "completed" },
                { name: "findings", label: "Findings", type: "textarea", demoValue: "All safety protocols observed. Minor improvement needed in signage visibility at night." },
                { name: "notes", label: "Notes", type: "textarea", demoValue: "Re-inspection scheduled for next quarter." },
            ]}
        />
    );
}
