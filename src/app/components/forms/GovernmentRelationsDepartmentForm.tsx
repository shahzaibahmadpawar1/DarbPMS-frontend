import { GenericDepartmentForm } from "./GenericDepartmentForm";

export function GovernmentRelationsDepartmentForm() {
    return (
        <GenericDepartmentForm
            title="Government Relations Department"
            description="Manage government relations and compliance"
            fields={[
                { name: "requestId", label: "Request ID", type: "text", required: true, demoValue: "GOV-7721" },
                { name: "requestType", label: "Request Type", type: "text", demoValue: "Zakat & Tax Clearance Certificate" },
                { name: "agency", label: "Government Agency", type: "text", demoValue: "ZATCA" },
                { name: "submissionDate", label: "Submission Date", type: "date", demoValue: "2024-03-15" },
                { name: "status", label: "Status", type: "select", demoValue: "approved" },
                { name: "officer", label: "Assigned Officer", type: "text", demoValue: "Abdulaziz Al-Faisal" },
                { name: "deadline", label: "Deadline", type: "date", demoValue: "2024-03-30" },
                { name: "notes", label: "Notes", type: "textarea", demoValue: "Clearance received. Filed in digital archive." },
            ]}
        />
    );
}
