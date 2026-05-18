export type SurveySnapshotRaw = {
    survey_version_id?: string | number | null;
    survey_saved_at?: string | null;
    survey_project_start_date?: string | null;
    survey_project_delivery_date?: string | null;
    survey_expected_date?: string | null;
    survey_station_status_code?: string | null;
    survey_station_status_stage?: string | null;
    survey_station_status_custom_stage?: string | null;
    survey_station_status_completion_rate?: string | null;
    survey_latest_completion_stage?: string | null;
    survey_latest_completion_condition?: string | null;
    survey_latest_completion_updated_at?: string | null;
};

export type SurveyStatusOption = { value: string; label: string };

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

function resolveStatusLabel(
    code: string,
    statusOptions?: SurveyStatusOption[],
): string {
    if (!code) return "";
    const fromOptions = statusOptions?.find((o) => o.value === code)?.label;
    if (fromOptions) return fromOptions;
    const fallback = formatSurveyStatusLabel(code);
    return fallback === "—" ? code : fallback;
}

function resolveStationStatusStageLabel(raw: SurveySnapshotRaw): string {
    const stageCode = String(raw.survey_station_status_stage ?? "").trim();
    const customStage = String(raw.survey_station_status_custom_stage ?? "").trim();
    if (!stageCode) return "";
    if (stageCode === "other" && customStage) return customStage;
    return stageCode;
}

function normalizeCompletionRate(rate: string): string {
    const trimmed = rate.trim();
    if (!trimmed) return "";
    return trimmed.includes("%") ? trimmed : `${trimmed}%`;
}

/** e.g. "Inactive (operating license)(75%)" */
export function formatSurveyCardStatus(
    raw: SurveySnapshotRaw,
    statusOptions?: SurveyStatusOption[],
): string {
    const code = String(raw.survey_station_status_code ?? "").trim();
    const stageLabel = resolveStationStatusStageLabel(raw);
    const rate = normalizeCompletionRate(String(raw.survey_station_status_completion_rate ?? ""));

    if (!code && !stageLabel && !rate) return "—";

    const statusLabel = resolveStatusLabel(code, statusOptions);
    let result = statusLabel || "";
    if (stageLabel) {
        result += result ? ` (${stageLabel})` : `(${stageLabel})`;
    }
    if (rate) {
        result += `(${rate})`;
    }
    return result || "—";
}

/** e.g. "automation (done)" from latest completion stage row */
export function formatSurveyLatestCompletionStage(raw: SurveySnapshotRaw): string {
    const stage = String(raw.survey_latest_completion_stage ?? "").trim();
    const condition = String(raw.survey_latest_completion_condition ?? "").trim();
    if (!stage && !condition) return "—";
    if (stage && condition) return `${stage} (${condition})`;
    return stage || condition;
}

export function formatShortDate(iso: string | null | undefined): string {
    const raw = String(iso ?? "").trim();
    if (!raw) return "—";
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return raw;
    return d.toLocaleDateString();
}

/** Days from today until `isoDate` — e.g. "28 days left", "Overdue by 3 days", "Due today" */
export function formatDateCountdown(isoDate: string | null | undefined): string {
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
