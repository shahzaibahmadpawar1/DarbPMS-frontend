import {
    formatDeliveryCountdown,
    formatShortDate,
    formatSurveyStatusLabel,
    hasSurveySnapshot,
    type SurveySnapshotRaw,
} from "@/utils/stationSurveyDisplay";

type Layout = "card" | "detailHeader";

type StationSurveySnapshotProps = {
    raw: SurveySnapshotRaw | null | undefined;
    layout?: Layout;
    className?: string;
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

/**
 * Latest survey snapshot: dates, days left (bold), status label, stage, saved time.
 * Matches station list / detail header mockups (grid + compact bar on narrow screens).
 */
export function StationSurveySnapshot({ raw, layout = "card", className = "" }: StationSurveySnapshotProps) {
    if (!hasSurveySnapshot(raw)) {
        return null;
    }

    const start = formatShortDate(raw.survey_project_start_date);
    const expected = formatShortDate(raw.survey_expected_date);
    const delivery = formatShortDate(raw.survey_project_delivery_date);
    const daysLeft = formatDeliveryCountdown(raw.survey_project_delivery_date);
    const status = formatSurveyStatusLabel(raw.survey_station_status_code);
    const stage = String(raw.survey_station_status_stage || "").trim() || "—";
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
            {/* Narrow screens: single-line style with bold prefix + bold days (mockup 1) */}
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
                <span className="font-bold text-foreground">Stage</span> {stage}
                {saved ? (
                    <>
                        <span className="mx-1">·</span>
                        Saved {saved}
                    </>
                ) : null}
            </div>

            {/* md+: column mockup — dates / days / status+stage (mockup 2) */}
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
                        {stage}
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
