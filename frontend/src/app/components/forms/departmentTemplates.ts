// Template generator for department forms
const departments = [
    {
        name: "FranchiseManagement",
        title: "Franchise Management",
        description: "Manage franchise agreements and partnerships",
        fields: ["franchiseId", "franchiseName", "franchisee", "startDate", "endDate", "fee", "status", "notes"]
    },
    {
        name: "PropertyManagement",
        title: "Property Management",
        description: "Manage property assets and maintenance",
        fields: ["propertyId", "propertyName", "location", "area", "value", "status", "manager", "notes"]
    },
    {
        name: "QualityManagement",
        title: "Quality Management",
        description: "Manage quality standards and audits",
        fields: ["auditId", "auditType", "auditor", "date", "score", "status", "findings", "notes"]
    },
    {
        name: "ProcurementDepartment",
        title: "Procurement Department",
        description: "Manage procurement and supplier relations",
        fields: ["poNumber", "supplier", "item", "quantity", "cost", "orderDate", "deliveryDate", "status"]
    },
    {
        name: "MaintenanceDepartment",
        title: "Maintenance Department",
        description: "Manage maintenance schedules and repairs",
        fields: ["ticketId", "equipment", "issueType", "reportedDate", "assignedTo", "priority", "status", "notes"]
    },
    {
        name: "LegalDepartment",
        title: "Legal Department",
        description: "Manage legal matters and compliance",
        fields: ["caseId", "caseType", "party", "filingDate", "lawyer", "status", "court", "notes"]
    },
    {
        name: "MarketingDepartment",
        title: "Marketing Department",
        description: "Manage marketing campaigns and branding",
        fields: ["campaignId", "campaignName", "channel", "startDate", "endDate", "budget", "status", "notes"]
    },
    {
        name: "GovernmentRelationsDepartment",
        title: "Government Relations Department",
        description: "Manage government relations and compliance",
        fields: ["requestId", "requestType", "agency", "submissionDate", "status", "officer", "deadline", "notes"]
    },
    {
        name: "ITManagement",
        title: "IT Management",
        description: "Manage IT infrastructure and systems",
        fields: ["ticketId", "system", "issueType", "reportedBy", "assignedTo", "priority", "status", "resolution"]
    },
    {
        name: "HumanResource",
        title: "Human Resource",
        description: "Manage employee records and HR processes",
        fields: ["employeeId", "employeeName", "position", "department", "hireDate", "salary", "status", "notes"]
    },
    {
        name: "Finance",
        title: "Finance",
        description: "Manage financial transactions and budgets",
        fields: ["transactionId", "transactionType", "amount", "date", "category", "account", "status", "notes"]
    },
    {
        name: "Safety",
        title: "Safety",
        description: "Manage safety protocols and incidents",
        fields: ["incidentId", "incidentType", "location", "date", "reportedBy", "severity", "status", "notes"]
    },
    {
        name: "Certificates",
        title: "Certificates",
        description: "Manage certificates and accreditations",
        fields: ["certificateId", "certificateName", "issuingBody", "issueDate", "expiryDate", "status", "holder", "notes"]
    }
];

export { departments };
