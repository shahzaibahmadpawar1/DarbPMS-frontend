import { useState } from "react";
import { Languages, ChevronDown } from "lucide-react";

export function LanguageSwitcher() {
    // Initialize state directly from localStorage to prevent mismatch on load
    const [lang, setLang] = useState<"en" | "ar">(() => {
        return (localStorage.getItem("darb_lang") as "en" | "ar") || "en";
    });

    const [isOpen, setIsOpen] = useState(false);

    const applyLanguage = (newLang: "en" | "ar") => {
        // Don't reload if already on the selected language
        if (lang === newLang) {
            setIsOpen(false);
            return;
        }

        // 1. Save preference
        localStorage.setItem("darb_lang", newLang);
        setLang(newLang);

        // 2. Set the Google Translate Cookies (both variations)
        // Google Translate reads the cookie in the format /source/target
        const cookieValue = newLang === "en" ? "/en/en" : "/en/ar";

        // Clear any existing cookies first
        document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = `googtrans=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

        // Set new cookies
        document.cookie = `googtrans=${cookieValue}; path=/`;
        document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;

        // 3. Try to trigger the Google Translate widget before reload
        const googleCombo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        if (googleCombo) {
            googleCombo.value = newLang;
            googleCombo.dispatchEvent(new Event("change", { bubbles: true }));
        }

        // 4. RELOAD THE PAGE after a short delay to let the cookie set
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl hover:border-primary transition-all shadow-sm"
            >
                <Languages className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-foreground">
                    {lang === "en" ? "English" : "العربية"}
                </span>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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





