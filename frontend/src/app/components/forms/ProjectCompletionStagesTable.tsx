import { Trash2, Upload } from "lucide-react";
import {
    type CompletionStageRow,
    type StageOption,
    FALLBACK_SURVEY_STAGE_OPTIONS,
    formatCompletionStageTimestamp,
} from "./surveyReportTypes";

type ProjectCompletionStagesTableProps = {
    stages: CompletionStageRow[];
    stageOptions?: StageOption[];
    readOnly?: boolean;
    onRemoveStage?: (id: string) => void;
    onUpdateStage?: (id: string, field: keyof CompletionStageRow, value: string) => void;
    onUpdateAttachment?: (id: string, file: File | null) => void;
    onViewAttachment?: (file?: File | null, fileUrl?: string | null) => void;
};

export function ProjectCompletionStagesTable({
    stages,
    stageOptions = FALLBACK_SURVEY_STAGE_OPTIONS,
    readOnly = false,
    onRemoveStage,
    onUpdateStage,
    onUpdateAttachment,
    onViewAttachment,
}: ProjectCompletionStagesTableProps) {
    if (!stages.length) {
        return (
            <p className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border rounded-lg">
                No completion stages recorded yet.
            </p>
        );
    }

    return (
        <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-muted/50">
                        <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Stage</th>
                        <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Condition</th>
                        <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Completion Rate</th>
                        <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Date &amp; Time</th>
                        <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Remarks</th>
                        <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Attachment</th>
                        {!readOnly && <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {stages.map((stage) => (
                        <tr key={stage.id}>
                            <td className="border border-border px-2 py-2">
                                {readOnly ? (
                                    <span className="text-sm text-foreground px-1">
                                        {stage.stage === "other" && stage.customStage
                                            ? stage.customStage
                                            : stage.stage || "—"}
                                    </span>
                                ) : (
                                    <div className="space-y-2">
                                        <select
                                            value={stage.stage}
                                            onChange={(e) => onUpdateStage?.(stage.id, "stage", e.target.value)}
                                            className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground"
                                        >
                                            <option value="">Select Stage</option>
                                            {stageOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        {stage.stage === "other" && (
                                            <input
                                                type="text"
                                                value={stage.customStage}
                                                onChange={(e) => onUpdateStage?.(stage.id, "customStage", e.target.value)}
                                                className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground"
                                                placeholder="Enter custom stage"
                                            />
                                        )}
                                    </div>
                                )}
                            </td>
                            <td className="border border-border px-2 py-2">
                                {readOnly ? (
                                    <span className="text-sm text-muted-foreground px-1">{stage.condition || "—"}</span>
                                ) : (
                                    <input
                                        type="text"
                                        value={stage.condition}
                                        onChange={(e) => onUpdateStage?.(stage.id, "condition", e.target.value)}
                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground"
                                    />
                                )}
                            </td>
                            <td className="border border-border px-2 py-2">
                                {readOnly ? (
                                    <span className="text-sm text-muted-foreground px-1">{stage.completionRate || "—"}</span>
                                ) : (
                                    <input
                                        type="text"
                                        value={stage.completionRate}
                                        onChange={(e) => onUpdateStage?.(stage.id, "completionRate", e.target.value)}
                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground"
                                        placeholder="e.g., 100"
                                    />
                                )}
                            </td>
                            <td className="border border-border px-2 py-2">
                                <span className="text-sm text-muted-foreground px-1 whitespace-nowrap">
                                    {formatCompletionStageTimestamp(stage)}
                                </span>
                            </td>
                            <td className="border border-border px-2 py-2">
                                {readOnly ? (
                                    <span className="text-sm text-muted-foreground px-1 whitespace-pre-wrap">
                                        {stage.remarks || "—"}
                                    </span>
                                ) : (
                                    <textarea
                                        value={stage.remarks}
                                        onChange={(e) => onUpdateStage?.(stage.id, "remarks", e.target.value)}
                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground min-h-[70px]"
                                        placeholder="Add comment or remark"
                                    />
                                )}
                            </td>
                            <td className="border border-border px-2 py-2">
                                <div className="flex flex-col gap-2">
                                    {!readOnly && (
                                        <label className="cursor-pointer w-fit">
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => onUpdateAttachment?.(stage.id, e.target.files?.[0] || null)}
                                            />
                                            <div className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                                                <Upload className="w-5 h-5 text-primary" />
                                            </div>
                                        </label>
                                    )}
                                    {stage.attachment && (
                                        <span className="text-xs text-muted-foreground truncate">{stage.attachment.name}</span>
                                    )}
                                    {!stage.attachment && stage.attachmentUrl && (
                                        <button
                                            type="button"
                                            className="px-2 py-1 text-xs border border-border rounded-md hover:bg-muted w-fit"
                                            onClick={() => onViewAttachment?.(null, stage.attachmentUrl)}
                                        >
                                            View
                                        </button>
                                    )}
                                    {!stage.attachment && !stage.attachmentUrl && readOnly && (
                                        <span className="text-xs text-muted-foreground">No attachment</span>
                                    )}
                                    {!stage.attachment && stage.attachmentName && (
                                        <span className="text-xs text-muted-foreground truncate">{stage.attachmentName}</span>
                                    )}
                                </div>
                            </td>
                            {!readOnly && (
                                <td className="border border-border px-2 py-2 text-center">
                                    <button
                                        type="button"
                                        onClick={() => onRemoveStage?.(stage.id)}
                                        className="text-error hover:text-error/80 transition-colors"
                                        aria-label="Remove stage"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
