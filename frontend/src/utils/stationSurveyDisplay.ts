export type SurveySnapshotRaw = {
    survey_version_id?: string | number | null;
    survey_saved_at?: string | null;
    survey_project_start_date?: string | null;
    survey_project_delivery_date?: string | null;
    survey_expected_date?: string | null;
    survey_station_status_code?: string | null;
    survey_station_status_stage?: string | null;
};

const SURVEY_STATUS_CODE_LABELS: Record<string, string> = {
    "1": "Active",
    "2": "Inactive",
    "3": "Under Construction",
    "4": "Under Development",
    "5": "Pending",
};

export function formatSurveyStatusLabel(code: string | null | undefined): string {
    const c = String(code ?? "").trim();
    if (!c) return "—";
    return SURVEY_STATUS_CODE_LABELS[c] || c;
}

export function formatShortDate(iso: string | null | undefined): string {
    const raw = String(iso ?? "").trim();
    if (!raw) return "—";
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return raw;
    return d.toLocaleDateString();
}

/** e.g. "28 days left", "Overdue by 3 days", "Due today" */
export function formatDeliveryCountdown(isoDate: string | null | undefined): string {
    const raw = String(isoDate ?? "").trim();
    if (!raw) return "—";
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return "—";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
    if (diff < 0) {
        const n = Math.abs(diff);
        return `Overdue by ${n} day${n === 1 ? "" : "s"}`;
    }
    if (diff === 0) return "Due today";
    return `${diff} day${diff === 1 ? "" : "s"} left`;
}

export function hasSurveySnapshot(raw: SurveySnapshotRaw | null | undefined): boolean {
    return raw != null && raw.survey_version_id != null && raw.survey_version_id !== "";
}
