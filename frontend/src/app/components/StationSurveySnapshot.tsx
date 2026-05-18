import { useEffect, useState } from "react";
import { Layers } from "lucide-react";
import { appSettingsAPI } from "@/services/api";
import {
    formatDateCountdown,
    formatShortDate,
    formatSurveyCardStatus,
    formatSurveyLatestCompletionStage,
    hasSurveySnapshot,
    type SurveySnapshotRaw,
    type SurveyStatusOption,
} from "@/utils/stationSurveyDisplay";
import { ProjectCompletionStagesModal } from "./ProjectCompletionStagesModal";

type Layout = "card" | "detailHeader";

type StationSurveySnapshotProps = {
    raw: SurveySnapshotRaw | null | undefined;
    layout?: Layout;
    className?: string;
    stationCode?: string | null;
    stationName?: string | null;
};

function Row({
    label,
    children,
    emphasizeValue,
    size,
}: {
    label: string;
    children: React.ReactNode;
    emphasizeValue?: boolean;
    size: "compact" | "comfortable";
}) {
    const text = size === "comfortable" ? "text-sm leading-snug" : "text-xs sm:text-sm leading-snug";
    return (
        <div className={text}>
            <span className="font-bold text-foreground">{label}</span>{" "}
            <span className={emphasizeValue ? "font-bold text-foreground" : "text-muted-foreground"}>{children}</span>
        </div>
    );
}

function StageWithQuickView({
    stage,
    stationCode,
    stationName,
    size,
}: {
    stage: string;
    stationCode?: string | null;
    stationName?: string | null;
    size: "compact" | "comfortable";
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const code = String(stationCode ?? "").trim();
    const iconClass = size === "comfortable" ? "w-4 h-4" : "w-3.5 h-3.5";

    return (
        <>
            <span className="inline-flex items-center gap-1.5 flex-wrap">
                <span className="text-muted-foreground">{stage}</span>
                {code ? (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setModalOpen(true);
                        }}
                        className="inline-flex items-center justify-center rounded-md border border-primary/30 bg-primary/10 p-1 text-primary hover:bg-primary/20 transition-colors"
                        title="View all completion stages"
                        aria-label="View project completion stages"
                    >
                        <Layers className={iconClass} />
                    </button>
                ) : null}
            </span>
            {code ? (
                <ProjectCompletionStagesModal
                    stationCode={code}
                    stationName={stationName ?? undefined}
                    open={modalOpen}
                    onOpenChange={setModalOpen}
                />
            ) : null}
        </>
    );
}

export function StationSurveySnapshot({
    raw,
    layout = "card",
    className = "",
    stationCode,
    stationName,
}: StationSurveySnapshotProps) {
    const [statusOptions, setStatusOptions] = useState<SurveyStatusOption[]>([]);

    useEffect(() => {
        let cancelled = false;
        appSettingsAPI
            .getSurveyDropdowns()
            .then(({ stationStatusOptions }) => {
                if (!cancelled && stationStatusOptions.length) {
                    setStatusOptions(stationStatusOptions);
                }
            })
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, []);

    if (!hasSurveySnapshot(raw)) {
        return null;
    }

    const start = formatShortDate(raw.survey_project_start_date);
    const expected = formatShortDate(raw.survey_expected_date);
    const delivery = formatShortDate(raw.survey_project_delivery_date);
    const daysLeft = formatDateCountdown(raw.survey_expected_date);
    const status = formatSurveyCardStatus(raw, statusOptions);
    const stage = formatSurveyLatestCompletionStage(raw);
    const saved =
        raw.survey_saved_at != null && String(raw.survey_saved_at).trim() !== ""
            ? new Date(String(raw.survey_saved_at)).toLocaleString()
            : null;

    const pad = layout === "detailHeader" ? "p-4 sm:p-5" : "p-3 sm:px-4 sm:py-3";
    const textBar = layout === "detailHeader" ? "text-sm" : "text-[11px] sm:text-xs";
    const rowSize = layout === "detailHeader" ? "comfortable" : "compact";

    return (
        <div
            className={`rounded-lg border border-border/60 bg-muted/25 ${pad} ${className}`.trim()}
            data-testid="station-survey-snapshot"
        >
            <div className={`${textBar} leading-relaxed text-muted-foreground md:hidden`}>
                <span className="font-bold text-foreground">Survey (latest): </span>
                Start {start}
                <span className="mx-1">·</span>
                Delivery {delivery}
                <span className="mx-1">·</span>
                Expected {expected}
                <span className="mx-1">·</span>
                <span className="font-bold text-foreground">{daysLeft}</span>
                <span className="mx-1">·</span>
                <span className="font-bold text-foreground">Status</span> {status}
                <span className="mx-1">·</span>
                <span className="font-bold text-foreground">Stage</span>{" "}
                <StageWithQuickView
                    stage={stage}
                    stationCode={stationCode}
                    stationName={stationName}
                    size="compact"
                />
                {saved ? (
                    <>
                        <span className="mx-1">·</span>
                        Saved {saved}
                    </>
                ) : null}
            </div>

            <div className="hidden md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-3">
                <div className="space-y-2">
                    <Row label="Start Date:" size={rowSize}>
                        {start}
                    </Row>
                    <Row label="Expected Date:" size={rowSize}>
                        {expected}
                    </Row>
                </div>
                <div className="space-y-2">
                    <Row label="Delivery Date:" size={rowSize}>
                        {delivery}
                    </Row>
                    <Row label="Days Left:" emphasizeValue size={rowSize}>
                        {daysLeft}
                    </Row>
                </div>
                <div className="space-y-2 md:border-l md:border-border/60 md:pl-8">
                    <Row label="Status:" size={rowSize}>
                        {status}
                    </Row>
                    <Row label="Stage:" size={rowSize}>
                        <StageWithQuickView
                            stage={stage}
                            stationCode={stationCode}
                            stationName={stationName}
                            size={rowSize}
                        />
                    </Row>
                </div>
            </div>

            {saved ? (
                <p className={`mt-2 hidden md:block text-[11px] sm:text-xs text-muted-foreground border-t border-border/40 pt-2`}>
                    <span className="font-semibold text-foreground">Saved: </span>
                    {saved}
                </p>
            ) : null}
        </div>
    );
}
