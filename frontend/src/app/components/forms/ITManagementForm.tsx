import { GenericDepartmentForm } from "./GenericDepartmentForm";

export function ITManagementForm() {
    return (
        <GenericDepartmentForm
            title="IT Management"
            description="Manage IT infrastructure and systems"
            fields={[
                { name: "ticketId", label: "Ticket ID", type: "text", required: true, demoValue: "IT-99201" },
                { name: "system", label: "System/Application", type: "text", demoValue: "ERP - Station Management Module" },
                { name: "issueType", label: "Issue Type", type: "text", demoValue: "Database Connection Latency" },
                { name: "reportedBy", label: "Reported By", type: "text", demoValue: "Faisal (Shift A)" },
                { name: "assignedTo", label: "Assigned To", type: "text", demoValue: "HQ IT Support Team" },
                { name: "priority", label: "Priority", type: "select", demoValue: "medium" },
                { name: "status", label: "Status", type: "select", demoValue: "resolved" },
                { name: "resolution", label: "Resolution", type: "textarea", demoValue: "Optimized SQL query parameters and increased connection pool size." },
            ]}
        />
    );
}
