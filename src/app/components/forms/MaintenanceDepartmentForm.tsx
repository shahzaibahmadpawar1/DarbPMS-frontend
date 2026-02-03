import { GenericDepartmentForm } from "./GenericDepartmentForm";

export function MaintenanceDepartmentForm() {
    return (
        <GenericDepartmentForm
            title="Maintenance Department"
            description="Manage maintenance schedules and repairs"
            fields={[
                { name: "ticketId", label: "Ticket ID", type: "text", required: true, demoValue: "MNT-7721-A" },
                { name: "equipment", label: "Equipment/Asset", type: "text", demoValue: "Dispenser Pump #3" },
                { name: "issueType", label: "Issue Type", type: "text", demoValue: "Electronic Sensor Failure" },
                { name: "reportedDate", label: "Reported Date", type: "date", demoValue: "2024-07-02" },
                { name: "assignedTo", label: "Assigned To", type: "text", demoValue: "Technical Team B" },
                { name: "priority", label: "Priority", type: "select", demoValue: "high" },
                { name: "status", label: "Status", type: "select", demoValue: "in-progress" },
                { name: "notes", label: "Notes", type: "textarea", demoValue: "Technician dispatched. Replacement sensor ordered from vendor Wayne Fueling." },
            ]}
        />
    );
}
