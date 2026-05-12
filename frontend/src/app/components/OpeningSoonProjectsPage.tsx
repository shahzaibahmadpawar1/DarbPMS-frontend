import { Link } from "react-router-dom";
import { useTranslation } from "@/utils/translations";

export function OpeningSoonProjectsPage() {
    const { t } = useTranslation();

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">{t("openingSoonProjects")}</h1>
                <p className="text-muted-foreground mt-1">Track projects that are close to launch.</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
                <p className="text-sm text-muted-foreground">{t("trackNearLaunchProject")}</p>
                <Link to="/all-stations-under-review" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                    {t("trackNearLaunchProject")}
                </Link>
            </div>
        </div>
    );
}

