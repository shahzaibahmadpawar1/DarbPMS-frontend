export const TASKS_LAST_SEEN_SUFFIX = 'tasks_last_seen_at';
export const UNDER_REVIEW_LAST_SEEN_SUFFIX = 'under_review_last_seen_at';

const BADGE_PREFIX = 'sidebar_badges';
const LOGIN_BASELINE_PREFIX = 'auth_login_at';

export const getLoginBaselineKey = (userId: string): string => `${LOGIN_BASELINE_PREFIX}:${userId}`;

export const getBadgeLastSeenKey = (userId: string, suffix: string): string => {
    return `${BADGE_PREFIX}:${userId}:${suffix}`;
};

export const toTimestamp = (value: unknown): number | null => {
    if (typeof value !== 'string') {
        return null;
    }

    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
};

export const toIsoOrNow = (value?: string | null): string => {
    const parsed = Date.parse(String(value || ''));
    if (Number.isNaN(parsed)) {
        return new Date().toISOString();
    }

    return new Date(parsed).toISOString();
};

export const ensureLoginBaseline = (userId: string, preferredIso?: string | null): string => {
    const storageKey = getLoginBaselineKey(userId);
    const existing = localStorage.getItem(storageKey);
    const existingTimestamp = toTimestamp(existing);

    if (existingTimestamp !== null) {
        return new Date(existingTimestamp).toISOString();
    }

    const baseline = toIsoOrNow(preferredIso);
    localStorage.setItem(storageKey, baseline);
    return baseline;
};

export const getOrInitLastSeenAt = (userId: string, suffix: string): number => {
    const storageKey = getBadgeLastSeenKey(userId, suffix);
    const existing = localStorage.getItem(storageKey);
    const existingTimestamp = toTimestamp(existing);

    if (existingTimestamp !== null) {
        return existingTimestamp;
    }

    const baseline = ensureLoginBaseline(userId);
    localStorage.setItem(storageKey, baseline);
    return toTimestamp(baseline) || Date.now();
};

export const markLastSeenNow = (userId: string, suffix: string): string => {
    const now = new Date().toISOString();
    localStorage.setItem(getBadgeLastSeenKey(userId, suffix), now);
    return now;
};