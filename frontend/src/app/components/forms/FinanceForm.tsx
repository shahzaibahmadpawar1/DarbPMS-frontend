import { GenericDepartmentForm } from "./GenericDepartmentForm";

export function FinanceForm() {
    return (
        <GenericDepartmentForm
            title="Finance"
            description="Manage financial transactions and budgets"
            fields={[
                { name: "transactionId", label: "Transaction ID", type: "text", required: true, demoValue: "TRX-N101-992" },
                { name: "transactionType", label: "Transaction Type", type: "text", demoValue: "Utility Bill Payment" },
                { name: "amount", label: "Amount (SAR)", type: "number", demoValue: "12,500" },
                { name: "date", label: "Transaction Date", type: "date", demoValue: "2024-06-15" },
                { name: "category", label: "Category", type: "text", demoValue: "Operations" },
                { name: "account", label: "Account", type: "text", demoValue: "Main Operations Account" },
                { name: "status", label: "Status", type: "select", demoValue: "completed" },
                { name: "notes", label: "Notes", type: "textarea", demoValue: "Monthly electricity and water bill for Station N101." },
            ]}
        />
    );
}
