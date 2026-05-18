import { useCallback, useEffect, useState } from "react";
import { PENDING_TASK_COUNT_EVENT } from "@/components/TaskPendingBadge";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function usePendingTaskCount(token: string | null, userId: string | undefined) {
    const [taskCount, setTaskCount] = useState(0);

    const fetchTaskCount = useCallback(async () => {
        if (!token || !userId) {
            setTaskCount(0);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/tasks/pending-count`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) return;

            const result = await response.json();
            setTaskCount(Number(result?.count || 0));
        } catch {
            setTaskCount(0);
        }
    }, [token, userId]);

    useEffect(() => {
        void fetchTaskCount();
        const intervalId = window.setInterval(() => void fetchTaskCount(), 60_000);

        const onFocus = () => void fetchTaskCount();
        const onCountChanged = () => void fetchTaskCount();

        window.addEventListener("focus", onFocus);
        window.addEventListener(PENDING_TASK_COUNT_EVENT, onCountChanged);

        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener("focus", onFocus);
            window.removeEventListener(PENDING_TASK_COUNT_EVENT, onCountChanged);
        };
    }, [fetchTaskCount]);

    return { taskCount, setTaskCount, refreshTaskCount: fetchTaskCount };
}
