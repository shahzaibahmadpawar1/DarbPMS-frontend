export type CompletionStageRow = {
    id: string;
    stage: string;
    customStage: string;
    condition: string;
    completionRate: string;
    remarks: string;
    createdAt?: string | null;
    updatedAt?: string | null;
    attachment?: File | null;
    attachmentUrl?: string | null;
    attachmentName?: string | null;
};

export type StageOption = { value: string; label: string };

export const FALLBACK_SURVEY_STAGE_OPTIONS: StageOption[] = [
    { value: "operating license", label: "operating license" },
    { value: "electricity connection", label: "electricity connection" },
    { value: "automation", label: "automation" },
    { value: "cameras", label: "cameras" },
    { value: "finishing stage", label: "finishing stage" },
    { value: "it works", label: "it works" },
    { value: "other", label: "other" },
];

export function formatCompletionStageLabel(stage: CompletionStageRow): string {
    if (stage.stage === "other" && stage.customStage.trim()) {
        return stage.customStage.trim();
    }
    return stage.stage.trim() || "—";
}

export function formatCompletionStageTimestamp(stage: CompletionStageRow): string {
    const raw = stage.updatedAt ?? stage.createdAt;
    if (!raw) return "—";
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString();
}
