export function BrandName() {
    const currentLang = localStorage.getItem("darb_lang") || "en";

    if (currentLang === "ar") {
        return <span className="notranslate">درب</span>;
    }

    return <span className="notranslate">Darb</span>;
}
