import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "@/utils/translations";

type PreOpeningTab = "government" | "other";

export function PreOpeningPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { t } = useTranslation();
    const activeTab: PreOpeningTab = searchParams.get("tab") === "other" ? "other" : "government";

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">{t("preOpening")}</h1>
                <p className="text-muted-foreground mt-1">License-related actions before opening.</p>
            </div>
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setSearchParams({}, { replace: true })}
                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === "government" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                >
                    {t("governmentLicenses")}
                </button>
                <button
                    type="button"
                    onClick={() => setSearchParams({ tab: "other" }, { replace: true })}
                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === "other" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                >
                    {t("otherLicenses")}
                </button>
            </div>

            {activeTab === "government" ? (
                <div className="rounded-xl border border-border bg-card p-6 space-y-3">
                    <p className="text-sm text-muted-foreground">Open station list and complete government licenses from station forms.</p>
                    <Link to="/all-stations-list" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                        {t("governmentLicenses")}
                    </Link>
                </div>
            ) : (
                <div className="rounded-xl border border-border bg-card p-6 space-y-3">
                    <p className="text-sm text-muted-foreground">Open station list and complete other licenses from station forms.</p>
                    <Link to="/all-stations-list" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                        {t("otherLicenses")}
                    </Link>
                </div>
            )}
        </div>
    );
}

