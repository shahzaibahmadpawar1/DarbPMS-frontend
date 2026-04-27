// DeepL DOM translation service
// Translates the page content from English to Arabic via the backend DeepL endpoint.
// Only activates when the user has selected Arabic as their language.

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
// Bump this version whenever glossary terms change to force cache invalidation
const CACHE_KEY = 'deepl_ar_cache_v2';

function loadCache(): Record<string, string> {
    try {
        return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    } catch {
        return {};
    }
}

function saveCache(cache: Record<string, string>): void {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'code', 'pre', 'textarea', 'input', 'select']);

function shouldTranslateNode(node: Text): boolean {
    const parent = node.parentElement;
    if (!parent) return false;
    if (SKIP_TAGS.has(parent.tagName.toLowerCase())) return false;
    if (parent.closest('[translate="no"]')) return false;

    const text = node.textContent?.trim() || '';
    if (text.length < 2) return false;
    // Skip pure numbers, symbols, or already-Arabic text
    if (/^[\d\s\W]+$/.test(text)) return false;
    if (/[\u0600-\u06FF]/.test(text)) return false; // Already Arabic

    return true;
}

function getTextNodes(root: Element): Text[] {
    const nodes: Text[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) =>
            shouldTranslateNode(node as Text)
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT,
    });
    let node: Node | null;
    while ((node = walker.nextNode()) !== null) {
        nodes.push(node as Text);
    }
    return nodes;
}

function applyTranslations(nodes: Text[], cache: Record<string, string>): void {
    for (const node of nodes) {
        const trimmed = node.textContent?.trim() || '';
        const translated = cache[trimmed];
        if (translated) {
            // Preserve surrounding whitespace
            const original = node.textContent || '';
            const leadMatch = original.match(/^(\s*)/);
            const trailMatch = original.match(/(\s*)$/);
            const lead = leadMatch ? leadMatch[1] : '';
            const trail = trailMatch ? trailMatch[1] : '';
            node.textContent = lead + translated + trail;
        }
    }
}

class DeepLService {
    private cache: Record<string, string> = loadCache();
    private observer: MutationObserver | null = null;
    private debounceTimer: ReturnType<typeof setTimeout> | null = null;
    private active = false;

    async translatePage(): Promise<void> {
        if (!this.active) return;

        const nodes = getTextNodes(document.body);
        const uncachedSet = new Set<string>();
        for (const node of nodes) {
            const text = node.textContent?.trim() || '';
            if (text.length >= 2 && !this.cache[text]) {
                uncachedSet.add(text);
            }
        }

        const uncached = Array.from(uncachedSet);
        if (uncached.length > 0) {
            await this.fetchTranslations(uncached);
        }

        applyTranslations(nodes, this.cache);
    }

    private async fetchTranslations(texts: string[]): Promise<void> {
        const BATCH_SIZE = 50;
        for (let i = 0; i < texts.length; i += BATCH_SIZE) {
            const batch = texts.slice(i, i + BATCH_SIZE);
            try {
                const response = await fetch(`${API_BASE}/translate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ texts: batch, targetLang: 'AR' }),
                });
                if (response.ok) {
                    const data: { success: boolean; translations?: string[] } = await response.json();
                    if (data.translations) {
                        batch.forEach((text, j) => {
                            this.cache[text] = data.translations![j];
                        });
                        saveCache(this.cache);
                    }
                }
            } catch (err) {
                console.error('DeepL translation error:', err);
            }
        }
    }

    activate(): void {
        this.active = true;
        this.translatePage();
        this.startObserver();
    }

    deactivate(): void {
        this.active = false;
        this.stopObserver();
    }

    private startObserver(): void {
        if (this.observer) return;

        // Only watch childList (new nodes added by React/API data loading).
        // We intentionally do NOT watch characterData to avoid feedback loops
        // when we set textContent on text nodes during translation.
        this.observer = new MutationObserver(() => {
            if (!this.active) return;
            if (this.debounceTimer) clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.translatePage();
            }, 300);
        });

        this.observer.observe(document.body, { childList: true, subtree: true });
    }

    private stopObserver(): void {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
    }
}

export const deeplService = new DeepLService();
