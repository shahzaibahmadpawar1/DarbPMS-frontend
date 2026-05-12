/** Derive display metrics from persisted feasibility study JSON fields (matches New Study form logic). */

export function parseNum(v: unknown): number {
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) ? n : 0;
}

export type StudyFinancialSummary = {
  propertyMin: number;
  productsMin: number;
  expensesTotal: number;
  annualRent: number;
  result: number;
  expectedNetIncomeMin: number;
};

export function computeStudyFinancials(study: {
  expected_property_income?: { rows?: Array<{ totalRentMin?: unknown }> };
  product_sales?: Record<string, { salesMinL?: unknown; margin?: unknown }>;
  expenses?: Record<string, unknown>;
  final_result?: { annualRentAmount?: unknown };
}): StudyFinancialSummary {
  const rows = Array.isArray(study.expected_property_income?.rows) ? study.expected_property_income!.rows! : [];
  let propertyMin = 0;
  for (const r of rows) {
    propertyMin += parseNum(r.totalRentMin);
  }
  const ps = study.product_sales || {};
  const keys = ["product91", "product95", "diesel1", "diesel2"] as const;
  let productsMin = 0;
  for (const key of keys) {
    const row = ps[key] || {};
    productsMin += parseNum(row.salesMinL) * parseNum(row.margin);
  }
  const exp = study.expenses || {};
  const expensesTotal =
    parseNum(exp.workers) + parseNum(exp.utilities) + parseNum(exp.transport) + parseNum(exp.other);
  const annualRent = parseNum(study.final_result?.annualRentAmount);
  const result = propertyMin + productsMin - expensesTotal;
  const expectedNetIncomeMin = result - annualRent;
  return { propertyMin, productsMin, expensesTotal, annualRent, result, expectedNetIncomeMin };
}

export function fmtStudyNumber(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

const PRODUCT_KEYS = ["product91", "product95", "diesel1", "diesel2"] as const;

export function computeProductProfitTotals(product_sales: Record<string, { salesMinL?: unknown; avgSalesL?: unknown; salesMaxL?: unknown; margin?: unknown }> | undefined | null): {
  min: number;
  avg: number;
  max: number;
} {
  const ps = product_sales || {};
  let min = 0;
  let avg = 0;
  let max = 0;
  for (const key of PRODUCT_KEYS) {
    const row = ps[key] || {};
    const margin = parseNum(row.margin);
    min += parseNum(row.salesMinL) * margin;
    avg += parseNum(row.avgSalesL) * margin;
    max += parseNum(row.salesMaxL) * margin;
  }
  return { min, avg, max };
}
