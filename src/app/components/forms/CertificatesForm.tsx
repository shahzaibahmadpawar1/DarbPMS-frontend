import { GenericDepartmentForm } from "./GenericDepartmentForm";

export function CertificatesForm() {
    return (
        <GenericDepartmentForm
            title="Certificates"
            description="Manage certificates and accreditations"
            fields={[
                { name: "certificateId", label: "Certificate ID", type: "text", required: true, demoValue: "CERT-ISO-9001" },
                { name: "certificateName", label: "Certificate Name", type: "text", demoValue: "ISO 9001:2015 Quality Management" },
                { name: "issuingBody", label: "Issuing Body", type: "text", demoValue: "SGS Saudi Arabia" },
                { name: "issueDate", label: "Issue Date", type: "date", demoValue: "2023-01-01" },
                { name: "expiryDate", label: "Expiry Date", type: "date", demoValue: "2026-01-01" },
                { name: "status", label: "Status", type: "select", demoValue: "active" },
                { name: "holder", label: "Certificate Holder", type: "text", demoValue: "Darb Al Sultan Co. (Station N101)" },
                { name: "notes", label: "Notes", type: "textarea", demoValue: "Annual surveillance audit successfully completed in Dec 2023." },
            ]}
        />
    );
}
