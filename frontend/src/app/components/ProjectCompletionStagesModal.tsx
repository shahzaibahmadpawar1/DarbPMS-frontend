import { useEffect, useState } from "react";
import { appSettingsAPI } from "@/services/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog";
import { ProjectCompletionStagesTable } from "@/app/components/forms/ProjectCompletionStagesTable";
import {
    type CompletionStageRow,
    FALLBACK_SURVEY_STAGE_OPTIONS,
    type StageOption,
} from "@/app/components/forms/surveyReportTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

type ProjectCompletionStagesModalProps = {
    stationCode: string;
    stationName?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function ProjectCompletionStagesModal({
    stationCode,
    stationName,
    open,
    onOpenChange,
}: ProjectCompletionStagesModalProps) {
    const [loading, setLoading] = useState(false);
    const [stages, setStages] = useState<CompletionStageRow[]>([]);
    const [stageOptions, setStageOptions] = useState<StageOption[]>(FALLBACK_SURVEY_STAGE_OPTIONS);

    useEffect(() => {
        if (!open || !stationCode) return;

        const token = localStorage.getItem("auth_token");
        if (!token) return;

        let cancelled = false;

        const load = async () => {
            setLoading(true);
            try {
                const [{ stageOptions: opts }, surveyRes] = await Promise.all([
                    appSettingsAPI.getSurveyDropdowns().catch(() => ({
                        stationStatusOptions: [],
                        stageOptions: [],
                    })),
                    fetch(`${API_BASE_URL}/survey-reports/station/${encodeURIComponent(stationCode)}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }),
                ]);

                if (!cancelled && opts.length) {
                    setStageOptions(opts);
                }

                if (!surveyRes.ok) {
                    if (!cancelled) setStages([]);
                    return;
                }

                const result = await surveyRes.json();
                const rawStages = result?.data?.payload?.completionStages;
                if (!cancelled) {
                    setStages(
                        Array.isArray(rawStages)
                            ? rawStages.map((stage: CompletionStageRow & { attachment?: unknown }) => ({
                                  id: String(stage.id ?? crypto.randomUUID()),
                                  stage: stage.stage || "",
                                  customStage: stage.customStage || "",
                                  condition: stage.condition || "",
                                  completionRate: stage.completionRate || "",
                                  createdAt: stage.createdAt ?? null,
                                  updatedAt: stage.updatedAt ?? null,
                                  remarks: stage.remarks || "",
                                  attachment: null,
                                  attachmentUrl:
                                      typeof stage.attachmentUrl === "string"
                                          ? stage.attachmentUrl
                                          : typeof stage.attachment === "string"
                                            ? stage.attachment
                                            : null,
                                  attachmentName: stage.attachmentName || null,
                              }))
                            : [],
                    );
                }
            } catch {
                if (!cancelled) setStages([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, [open, stationCode]);

    const titleSuffix = stationName?.trim() ? ` — ${stationName.trim()}` : "";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl max-h-[min(85vh,720px)] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Project Completion Stages{titleSuffix}</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <ProjectCompletionStagesTable stages={stages} stageOptions={stageOptions} readOnly />
                )}
            </DialogContent>
        </Dialog>
    );
}
