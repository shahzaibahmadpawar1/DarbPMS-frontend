// Translation utility for sidebar navigation
// Uses localStorage to get current language

export const translations = {
    en: {
        // Navigation
        dashboard: "Dashboard",
        analytics: "Analytics",
        stations: "Stations",
        tasks: "Tasks",
        reports: "Reports",
        contactCEO: "Contact CEO Office",
        chat: "Chat",
        logout: "Log out",
        addNewProject: "Add New Project",
        allStations: "All Stations",
    },
    ar: {
        // Navigation
        dashboard: "لوحة التحكم",
        analytics: "التحليلات",
        stations: "المحطات",
        tasks: "المهام",
        reports: "التقارير",
        contactCEO: "اتصل بمكتب الرئيس التنفيذي",
        chat: "محادثة",
        logout: "تسجيل الخروج",
        addNewProject: "إضافة مشروع جديد",
        allStations: "جميع المحطات",
    },
};

export function useTranslation() {
    const lang = (localStorage.getItem("darb_lang") as "en" | "ar") || "en";

    return {
        t: (key: keyof typeof translations.en) => {
            return translations[lang][key] || translations.en[key];
        },
        lang,
    };
}

// Helper function for use outside React components
export function t(key: keyof typeof translations.en): string {
    const lang = (localStorage.getItem("darb_lang") as "en" | "ar") || "en";
    return translations[lang][key] || translations.en[key];
}
