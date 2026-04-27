import type { Department } from '@/services/api';

export type RequestTypeValue =
    | 'general-enquiry'
    | 'site-visit'
    | 'survey-report'
    | 'inspection'
    | 'audit'
    | 'workers'
    | 'branding'
    | 'promotion'
    | 'computer'
    | 'laptop'
    | 'printer'
    | 'tv-screen'
    | 'internet-router'
    | 'it-support'
    | 'mada-payment-machine'
    | 'electricity-issue'
    | 'pump-issue'
    | 'nozzle-issue'
    | 'uniform'
    | 'cctv-quotation-request'
    | 'automation-quotation-request'
    | 'pumps'
    | 'fuel-91'
    | 'fuel-95'
    | 'fuel-98'
    | 'fuel-diesel'
    | 'price-screens-quote'
    | 'camera-installation-quote'
    | 'fuel-tanks-quotation'
    | 'housing-preparation'
    | 'cleaning-supplies'
    | 'office-furniture';

export interface RequestTypeOption {
    value: RequestTypeValue;
    label: string;
}

const GENERAL_ONLY: RequestTypeOption[] = [{ value: 'general-enquiry', label: 'General Enquiry' }];

const REQUEST_TYPES_BY_DEPARTMENT: Record<Department, RequestTypeOption[]> = {
    investment: GENERAL_ONLY,
    franchise: GENERAL_ONLY,
    finance: GENERAL_ONLY,
    realestate: GENERAL_ONLY,
    property_management: GENERAL_ONLY,
    legal: GENERAL_ONLY,
    government_relations: GENERAL_ONLY,
    safety: GENERAL_ONLY,
    project: [
        { value: 'site-visit', label: 'Site Visit' },
        { value: 'survey-report', label: 'Survey Report' },
    ],
    quality: [
        { value: 'inspection', label: 'Inspection' },
        { value: 'audit', label: 'Audit' },
        { value: 'site-visit', label: 'Site Visit' },
        { value: 'survey-report', label: 'Survey Report' },
    ],
    hr: [{ value: 'workers', label: 'Workers' }],
    marketing: [
        { value: 'branding', label: 'Branding' },
        { value: 'promotion', label: 'Promotion' },
    ],
    it: [
        { value: 'computer', label: 'Computer' },
        { value: 'laptop', label: 'Laptop' },
        { value: 'printer', label: 'Printer' },
        { value: 'tv-screen', label: 'TV Screen' },
        { value: 'internet-router', label: 'Internet Router' },
        { value: 'it-support', label: 'IT Support' },
    ],
    operation: [{ value: 'mada-payment-machine', label: 'MADA/Payment Machine' }],
    maintanance: [
        { value: 'electricity-issue', label: 'Electricity Issue' },
        { value: 'pump-issue', label: 'Pump Issue' },
        { value: 'nozzle-issue', label: 'Nozzle Issue' },
    ],
    procurement: [
        { value: 'uniform', label: 'Uniform' },
        { value: 'cctv-quotation-request', label: 'CCTV Quotation Request' },
        { value: 'automation-quotation-request', label: 'Automation Quotation Request' },
        { value: 'pumps', label: 'Pumps' },
        { value: 'fuel-91', label: 'Fuel (91)' },
        { value: 'fuel-95', label: 'Fuel (95)' },
        { value: 'fuel-98', label: 'Fuel (98)' },
        { value: 'fuel-diesel', label: 'Fuel (Diesel)' },
        { value: 'price-screens-quote', label: 'Request a Price Quote for Price Screens' },
        { value: 'camera-installation-quote', label: 'Request a Price Quote for Camera Installation' },
        { value: 'fuel-tanks-quotation', label: 'Request Quotation for Fuel Tanks' },
        { value: 'housing-preparation', label: 'Housing Preparation' },
        { value: 'cleaning-supplies', label: 'Cleaning Supplies' },
        { value: 'office-furniture', label: 'Office Furniture' },
    ],
};

export const getRequestTypesByDepartment = (department: Department | ''): RequestTypeOption[] => {
    if (!department) {
        return [];
    }

    return REQUEST_TYPES_BY_DEPARTMENT[department] || GENERAL_ONLY;
};
