import { useState } from "react";
import { Languages, ChevronDown } from "lucide-react";

export function LanguageSwitcher() {
    const [lang, setLang] = useState<"en" | "ar">(() => {
        return (localStorage.getItem("darb_lang") as "en" | "ar") || "en";
    });

    const [isOpen, setIsOpen] = useState(false);

    const applyLanguage = (newLang: "en" | "ar") => {
        if (lang === newLang) {
            setIsOpen(false);
            return;
        }

        localStorage.setItem("darb_lang", newLang);
        setLang(newLang);

        // Update document direction
        document.documentElement.lang = newLang;
        document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";

        // Reload the page — on reload, main.tsx will activate the DeepL
        // translation service automatically when darb_lang === 'ar'.
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-background border border-border rounded-lg sm:rounded-xl hover:border-primary transition-all shadow-sm"
            >
                <Languages className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-foreground whitespace-nowrap">
                    {lang === "en" ? "English" : "العربية"}
                </span>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full mt-2 right-0 w-32 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => applyLanguage("en")}
                            className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-primary/10 transition-colors ${lang === "en" ? "text-primary bg-primary/5" : "text-foreground"}`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => applyLanguage("ar")}
                            className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-primary/10 transition-colors ${lang === "ar" ? "text-primary bg-primary/5" : "text-foreground"}`}
                        >
                            العربية
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}





