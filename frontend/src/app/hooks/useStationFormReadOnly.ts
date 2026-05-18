import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useStation } from "@/app/context/StationContext";
import {
    canEditStationForm,
    extractFormPathFromPathname,
} from "@/utils/stationFormPermissions";

/**
 * True when the current user must not edit this station form (inputs disabled, saves hidden).
 * Ignores stale localStorage admin mode; uses role/department + form path.
 */
export function useStationFormReadOnly(explicitFormPath?: string): boolean {
    const { user } = useAuth();
    const { accessMode } = useStation();
    const { pathname } = useLocation();
    const { stationId } = useParams<{ stationId?: string }>();

    return useMemo(() => {
        const formPath =
            explicitFormPath?.trim().toLowerCase()
            || extractFormPathFromPathname(pathname)
            || null;

        if (!formPath) {
            return accessMode === "view-only";
        }

        return !canEditStationForm(user, formPath, { stationId: stationId ?? null });
    }, [user, explicitFormPath, pathname, stationId, accessMode]);
}
