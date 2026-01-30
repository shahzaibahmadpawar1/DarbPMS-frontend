import { useState, useEffect } from "react";
import { Languages, ChevronDown } from "lucide-react";

export function LanguageSwitcher() {
    const [lang, setLang] = useState<"en" | "ar">("en");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if there's a saved language preference
        const savedLang = localStorage.getItem("darb_lang") as "en" | "ar";
        if (savedLang && savedLang !== lang) {
            // Small delay to ensure Google script has loaded
            setTimeout(() => {
                applyLanguage(savedLang);
            }, 1000);
        }
    }, []);

    const setGoogleTranslateCookie = (newLang: string) => {
        // The google translate cookie format is /src_lang/target_lang
        const value = `/en/${newLang}`;
        document.cookie = `googtrans=${value}; path=/`;
        document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname}`;
    };

    const triggerGoogleTranslate = (newLang: string, retryCount = 0) => {
        const googleCombo = document.querySelector(".goog-te-combo") as HTMLSelectElement;

        if (googleCombo) {
            googleCombo.value = newLang;
            googleCombo.dispatchEvent(new Event("change"));
        } else if (retryCount < 5) {
            // If combo not found, retry after a short delay
            setTimeout(() => triggerGoogleTranslate(newLang, retryCount + 1), 500);
        }
    };

    const applyLanguage = (newLang: "en" | "ar") => {
        setLang(newLang);
        setIsOpen(false);
        localStorage.setItem("darb_lang", newLang);

        // Toggle RTL/LTR on the HTML tag
        document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = newLang;

        // 1. Set the cookie (works for some configurations)
        setGoogleTranslateCookie(newLang);

        // 2. Trigger the hidden combo box (main method)
        triggerGoogleTranslate(newLang);

        // 3. Force refresh if it's the first time switching to Arabic and UI didn't update
        // But we avoid this if possible for better UX. Let's try without refresh first.
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-[#ff6b35] transition-all shadow-sm"
            >
                <Languages className="w-4 h-4 text-[#ff6b35]" />
                <span className="text-sm font-bold text-[#020713]">
                    {lang === "en" ? "English" : "العربية"}
                </span>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full mt-2 right-0 w-32 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => applyLanguage("en")}
                            className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-orange-50 transition-colors ${lang === "en" ? "text-[#ff6b35] bg-orange-50/50" : "text-gray-700"
                                }`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => applyLanguage("ar")}
                            className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-orange-50 transition-colors ${lang === "ar" ? "text-[#ff6b35] bg-orange-50/50" : "text-gray-700"
                                }`}
                        >
                            العربية
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
