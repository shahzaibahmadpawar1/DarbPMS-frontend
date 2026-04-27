import { GenericDepartmentForm } from "./GenericDepartmentForm";

export function MarketingDepartmentForm() {
    return (
        <GenericDepartmentForm
            title="Marketing Department"
            description="Manage marketing campaigns and branding"
            fields={[
                { name: "campaignId", label: "Campaign ID", type: "text", required: true, demoValue: "CAM-SUMMER-24" },
                { name: "campaignName", label: "Campaign Name", type: "text", demoValue: "Summer Road Trip Fuel Rewards" },
                { name: "channel", label: "Marketing Channel", type: "text", demoValue: "Social Media & On-Site Print" },
                { name: "startDate", label: "Start Date", type: "date", demoValue: "2024-06-01" },
                { name: "endDate", label: "End Date", type: "date", demoValue: "2024-08-31" },
                { name: "budget", label: "Budget (SAR)", type: "number", demoValue: "45,000" },
                { name: "status", label: "Status", type: "select", demoValue: "active" },
                { name: "notes", label: "Notes", type: "textarea", demoValue: "Promoting higher-grade fuel with loyalty points bonus. Expected reach: 50,000 customers." },
            ]}
        />
    );
}
