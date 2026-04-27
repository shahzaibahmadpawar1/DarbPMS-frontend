import { GenericDepartmentForm } from "./GenericDepartmentForm";

export function HumanResourceForm() {
    return (
        <GenericDepartmentForm
            title="Human Resource"
            description="Manage employee records and HR processes"
            fields={[
                { name: "employeeId", label: "Employee ID", type: "text", required: true, demoValue: "EMP-204" },
                { name: "employeeName", label: "Employee Name", type: "text", demoValue: "Mohammed Al-Qahtani" },
                { name: "position", label: "Position", type: "text", demoValue: "Station Manager" },
                { name: "department", label: "Department", type: "text", demoValue: "Operations" },
                { name: "hireDate", label: "Hire Date", type: "date", demoValue: "2022-03-01" },
                { name: "salary", label: "Salary (SAR)", type: "number", demoValue: "18,500" },
                { name: "status", label: "Status", type: "select", demoValue: "active" },
                { name: "notes", label: "Notes", type: "textarea", demoValue: "Promoted to Station Manager in Jan 2024. Excellent performance record." },
            ]}
        />
    );
}
