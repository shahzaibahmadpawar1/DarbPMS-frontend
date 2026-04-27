import React from "react";
import {
    FileText,
    Users,
    Scroll,
    Shield,
    Leaf,
    Package,
    TrendingUp,
    Briefcase,
    Building2,
    Settings,
    Home,
    ShieldCheck,
    ShoppingBag,
    Scale,
    Target,
    Landmark,
    Monitor,
    Wallet,
    AlertTriangle,
    Paperclip,
    Info,
    Camera,
    Fuel,
    Droplet,
    Database,
    Maximize,
} from "lucide-react";

export type FormItem = {
    title: string;
    icon: React.ReactNode;
    path: string;
    completed: boolean;
};

export type FormSection = {
    group: string;
    items: FormItem[];
};

export const stationSections: FormSection[] = [
    {
        group: "STATION ESSENTIALS",
        items: [
            { title: "Station Information", icon: <Info className="w-4 h-4" />, path: "station-information", completed: false },
            { title: "Cameras", icon: <Camera className="w-4 h-4" />, path: "cameras", completed: false },
            { title: "Dispensers", icon: <Fuel className="w-4 h-4" />, path: "dispensers", completed: false },
            { title: "Nozzles", icon: <Droplet className="w-4 h-4" />, path: "nozzles", completed: false },
            { title: "Tanks", icon: <Database className="w-4 h-4" />, path: "tanks", completed: false },
            { title: "Areas", icon: <Maximize className="w-4 h-4" />, path: "areas", completed: false },
        ],
    },
    {
        group: "OWNERSHIP & LEGAL",
        items: [
            { title: "Owner Information", icon: <Users className="w-4 h-4" />, path: "owner-information", completed: false },
            { title: "Deed Information", icon: <Scroll className="w-4 h-4" />, path: "deed-information", completed: false },
            { title: "Building Permit", icon: <FileText className="w-4 h-4" />, path: "building-permit", completed: false },
            { title: "Contract", icon: <FileText className="w-4 h-4" />, path: "contract", completed: false },
            { title: "Commercial License", icon: <FileText className="w-4 h-4" />, path: "commercial-license", completed: false },
        ],
    },
    {
        group: "GOVERNMENT LICENSES",
        items: [
            { title: "Salamah License", icon: <Shield className="w-4 h-4" />, path: "salamah-license", completed: false },
            { title: "Taqyees License", icon: <FileText className="w-4 h-4" />, path: "taqyees-license", completed: false },
            { title: "Environmental License", icon: <Leaf className="w-4 h-4" />, path: "environmental-license", completed: false },
            { title: "Attachments", icon: <Paperclip className="w-4 h-4" />, path: "government-license-attachments", completed: false },
        ],
    },
    {
        group: "PROJECT SURVEY REPORT",
        items: [
            { title: "Survey Report", icon: <FileText className="w-4 h-4" />, path: "survey-report", completed: false },
        ],
    },
    {
        group: "ASSETS",
        items: [
            { title: "Fixed Assets", icon: <Package className="w-4 h-4" />, path: "fixed-assets", completed: false },
        ],
    },
];

export const departmentSections: FormSection[] = [
    {
        group: "DEPARTMENTS",
        items: [
            { title: "Investment Department", icon: <TrendingUp className="w-4 h-4" />, path: "investment-department", completed: false },
            { title: "Franchise Department", icon: <Briefcase className="w-4 h-4" />, path: "franchise-department", completed: false },
            { title: "Projects Department", icon: <Building2 className="w-4 h-4" />, path: "project-department", completed: false },
            { title: "Operations Department", icon: <Settings className="w-4 h-4" />, path: "operations-management", completed: false },
            { title: "Property Department", icon: <Home className="w-4 h-4" />, path: "property-department", completed: false },
            { title: "Maintenance & Quality Department", icon: <ShieldCheck className="w-4 h-4" />, path: "quality-department", completed: false },
            { title: "Purchase Department", icon: <ShoppingBag className="w-4 h-4" />, path: "purchase-department", completed: false },
            { title: "Legal Department", icon: <Scale className="w-4 h-4" />, path: "legal-department", completed: false },
            { title: "Marketing Department", icon: <Target className="w-4 h-4" />, path: "marketing-department", completed: false },
            { title: "Government Relations Department", icon: <Landmark className="w-4 h-4" />, path: "government-relations-department", completed: false },
            { title: "IT Department", icon: <Monitor className="w-4 h-4" />, path: "it-department", completed: false },
            { title: "Human Resource Department", icon: <Users className="w-4 h-4" />, path: "human-resource", completed: false },
            { title: "Finance Department", icon: <Wallet className="w-4 h-4" />, path: "finance-department", completed: false },
            { title: "Safety & HSE Department", icon: <AlertTriangle className="w-4 h-4" />, path: "safety", completed: false },
            { title: "Certificates", icon: <FileText className="w-4 h-4" />, path: "certificates", completed: false },
        ],
    },
];
