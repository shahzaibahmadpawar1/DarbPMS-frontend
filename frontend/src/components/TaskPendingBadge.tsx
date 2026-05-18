type TaskPendingBadgeProps = {
    count: number;
    className?: string;
};

export function TaskPendingBadge({ count, className = "" }: TaskPendingBadgeProps) {
    if (count <= 0) return null;

    return (
        <span
            className={`min-w-5 h-5 px-1.5 bg-info text-info-foreground rounded-full inline-flex items-center justify-center text-[10px] font-bold leading-none shadow-sm shrink-0 ${className}`}
            aria-label={`${count} pending tasks`}
        >
            {count > 99 ? "99+" : count}
        </span>
    );
}

export const PENDING_TASK_COUNT_EVENT = "darb-pending-task-count-changed";

export function notifyPendingTaskCountChanged(): void {
    window.dispatchEvent(new CustomEvent(PENDING_TASK_COUNT_EVENT));
}
