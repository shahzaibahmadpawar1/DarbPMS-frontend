import { GenericDepartmentForm } from "./GenericDepartmentForm";

export function SafetyForm() {
    return (
        <GenericDepartmentForm
            title="Safety"
            description="Manage safety protocols and incidents"
            fields={[
                { name: "incidentId", label: "Incident ID", type: "text", required: true, demoValue: "SAF-2024-002" },
                { name: "incidentType", label: "Incident Type", type: "text", demoValue: "Fire Drill Practice" },
                { name: "location", label: "Location", type: "text", demoValue: "Pump Island Region" },
                { name: "date", label: "Incident Date", type: "date", demoValue: "2024-05-18" },
                { name: "reportedBy", label: "Reported By", type: "text", demoValue: "Safety Officer Khaled" },
                { name: "severity", label: "Severity", type: "select", demoValue: "low" },
                { name: "status", label: "Status", type: "select", demoValue: "completed" },
                { name: "notes", label: "Notes/Actions Taken", type: "textarea", demoValue: "Planned drill performed successfully. Response time: 45 seconds. All fire extinguishers checked." },
            ]}
        />
    );
}
