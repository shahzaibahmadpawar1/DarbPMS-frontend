import { useEffect } from "react";

const STORAGE_PREFIX = "station_form_autofill_v1";

type AutofillOptions = {
  pathname: string;
  stationCode?: string | null;
};

type AutofillScopeOptions = {
  pathname: string;
  stationCode?: string | null;
};

type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

type AutofillMap = Record<string, string>;

const NON_FORM_DASHBOARD_PATHS = new Set([
  "/dashboard",
  "/dashboard/tasks",
  "/dashboard/reports",
  "/dashboard/requests",
  "/dashboard/under-review",
  "/dashboard/executive-analytics",
  "/dashboard/total-stations",
  "/dashboard/active-licenses",
  "/dashboard/pending-permits",
  "/dashboard/active-projects",
  "/all-stations-dashboard",
  "/all-stations-analytics",
  "/all-stations-list",
  "/all-stations-departments",
  "/all-stations-tasks",
  "/all-stations-reports",
  "/all-stations-requests",
  "/all-stations-under-review",
  "/all-stations-users",
]);

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}

function shouldEnableAutofill(pathname: string): boolean {
  if (pathname.includes("/form/")) return true;
  if (pathname.startsWith("/dashboard/") && !NON_FORM_DASHBOARD_PATHS.has(pathname)) return true;
  return false;
}

function getStationScope(pathname: string, stationCode?: string | null): string {
  if (stationCode && stationCode.trim()) return stationCode.trim().toLowerCase();

  const match = pathname.match(/\/station\/([^/]+)/i);
  if (match?.[1]) return match[1].toLowerCase();

  return "global";
}

function parseStoredMap(storageKey: string): AutofillMap {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveMap(storageKey: string, map: AutofillMap): void {
  localStorage.setItem(storageKey, JSON.stringify(map));
}

function isFieldElement(target: EventTarget | null): target is FieldElement {
  return !!target && target instanceof HTMLElement && (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

function skipField(el: FieldElement): boolean {
  if (el.disabled) return true;

  if (el instanceof HTMLInputElement) {
    const t = el.type.toLowerCase();
    if (["hidden", "password", "file", "button", "submit", "reset", "image"].includes(t)) return true;
  }

  return false;
}

function labelText(el: FieldElement): string {
  if (el.labels && el.labels.length > 0) {
    return el.labels[0].textContent || "";
  }

  if (el.id) {
    const css = (window as any).CSS;
    const safeId = css && css.escape ? css.escape(el.id) : el.id.replace(/([\\.#:[\],=])/g, "\\$1");
    const node = document.querySelector(`label[for=\"${safeId}\"]`);
    if (node?.textContent) return node.textContent;
  }

  return el.getAttribute("aria-label") || el.getAttribute("placeholder") || "";
}

function fieldKey(el: FieldElement): string | null {
  const candidates = [
    el.getAttribute("data-autofill-key") || "",
    el.name || "",
    el.id || "",
    labelText(el),
  ];

  for (const candidate of candidates) {
    const normalized = normalizeKey(candidate);
    if (normalized.length >= 3) return normalized;
  }

  return null;
}

function setNativeValue(el: FieldElement, value: string): void {
  if (el instanceof HTMLInputElement) {
    const type = el.type.toLowerCase();

    if (type === "checkbox") {
      const nextChecked = value === "1";
      if (el.checked !== nextChecked) {
        el.checked = nextChecked;
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }
      return;
    }

    if (type === "radio") {
      const nextChecked = el.value === value;
      if (el.checked !== nextChecked) {
        el.checked = nextChecked;
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }
      return;
    }
  }

  const current = el.value;
  if (current === value) return;

  const prototype = Object.getPrototypeOf(el);
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
  if (descriptor?.set) {
    descriptor.set.call(el, value);
  } else {
    el.value = value;
  }

  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

function getFieldValue(el: FieldElement): string | null {
  if (el instanceof HTMLInputElement) {
    const type = el.type.toLowerCase();
    if (type === "checkbox") return el.checked ? "1" : "0";
    if (type === "radio") return el.checked ? el.value : null;
  }

  return el.value ?? "";
}

export function useStationFormAutofill({ pathname, stationCode }: AutofillOptions): void {
  useEffect(() => {
    const enabled = shouldEnableAutofill(pathname);
    if (!enabled) return;

    const scope = getStationScope(pathname, stationCode);
    const storageKey = `${STORAGE_PREFIX}:${scope}`;

    const collectAndStore = (preferEmptyOnly: boolean) => {
      const map = parseStoredMap(storageKey);
      const fields = Array.from(document.querySelectorAll("input, textarea, select"));
      let changed = false;

      for (const node of fields) {
        if (!isFieldElement(node) || skipField(node)) continue;
        const key = fieldKey(node);
        if (!key) continue;

        const value = getFieldValue(node);
        if (value === null || value === "") continue;

        if (preferEmptyOnly && map[key]) continue;
        map[key] = value;
        changed = true;
      }

      if (changed) saveMap(storageKey, map);
    };

    const applyStoredValues = () => {
      const map = parseStoredMap(storageKey);
      if (!Object.keys(map).length) return;

      const fields = Array.from(document.querySelectorAll("input, textarea, select"));
      for (const node of fields) {
        if (!isFieldElement(node) || skipField(node)) continue;
        const key = fieldKey(node);
        if (!key) continue;

        const stored = map[key];
        if (stored === undefined) continue;

        if (node instanceof HTMLInputElement && ["checkbox", "radio"].includes(node.type.toLowerCase())) {
          setNativeValue(node, stored);
          continue;
        }

        if (node.value === "") {
          setNativeValue(node, stored);
        }
      }
    };

    const onFieldInput = (event: Event) => {
      if (!isFieldElement(event.target) || skipField(event.target)) return;

      const key = fieldKey(event.target);
      if (!key) return;

      const value = getFieldValue(event.target);
      if (value === null) return;

      const map = parseStoredMap(storageKey);
      map[key] = value;
      saveMap(storageKey, map);
    };

    // Step 1: capture any already-filled values from API/defaults.
    collectAndStore(true);

    // Step 2: apply stored values to empty matching fields.
    applyStoredValues();

    // Step 3: run a second pass after child components finish rendering.
    const t1 = window.setTimeout(() => {
      collectAndStore(true);
      applyStoredValues();
    }, 0);
    const t2 = window.setTimeout(() => {
      collectAndStore(true);
      applyStoredValues();
    }, 220);

    document.addEventListener("input", onFieldInput, true);
    document.addEventListener("change", onFieldInput, true);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      document.removeEventListener("input", onFieldInput, true);
      document.removeEventListener("change", onFieldInput, true);
    };
  }, [pathname, stationCode]);
}

export function clearStationAutofillData({ pathname, stationCode }: AutofillScopeOptions): void {
  const scope = getStationScope(pathname, stationCode);
  const storageKey = `${STORAGE_PREFIX}:${scope}`;
  localStorage.removeItem(storageKey);
}
