import { GenericDepartmentForm } from "./GenericDepartmentForm";

export function LegalDepartmentForm() {
    return (
        <GenericDepartmentForm
            title="Legal Department"
            description="Manage legal matters and compliance"
            fields={[
                { name: "caseId", label: "Case ID", type: "text", required: true, demoValue: "LGL-2024-041" },
                { name: "caseType", label: "Case Type", type: "text", demoValue: "Contractual Compliance" },
                { name: "party", label: "Party/Opponent", type: "text", demoValue: "Supreme Tech Solutions" },
                { name: "filingDate", label: "Filing Date", type: "date", demoValue: "2024-05-12" },
                { name: "lawyer", label: "Lawyer/Attorney", type: "text", demoValue: "Khalid Al-Dosari" },
                { name: "status", label: "Status", type: "select", demoValue: "in-review" },
                { name: "court", label: "Court/Jurisdiction", type: "text", demoValue: "Riyadh Commercial Court" },
                { name: "notes", label: "Notes", type: "textarea", demoValue: "Case related to delay in equipment delivery. Mediation in progress." },
            ]}
        />
    );
}
